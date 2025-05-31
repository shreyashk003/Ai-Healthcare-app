import os
import json
import tempfile
import google.generativeai as genai
from gtts import gTTS
import pygame
import speech_recognition as sr

# Setup Google Gemini API Key and model
os.environ["GOOGLE_API_KEY"] = "YOUR_API_KEY_HERE"  # Replace with your actual API key
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
model = genai.GenerativeModel("models/gemini-1.5-flash")

# Initialize pygame mixer once
pygame.mixer.init()
pygame.mixer.pre_init(44100, -16, 2, 2048)


class VoiceAssistant:
    def __init__(self):
        self.current_language = 'en'
        self.recognizer = sr.Recognizer()
        self.recognizer.energy_threshold = 4000
        self.recognizer.dynamic_energy_adjustment_ratio = 1.5

    def text_to_speech(self, text, language=None):
        if not language:
            language = self.current_language
        try:
            with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as f:
                temp_path = f.name

            tts = gTTS(text=text, lang=language, slow=False)
            tts.save(temp_path)

            pygame.mixer.music.load(temp_path)
            pygame.mixer.music.play()

            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)

            os.unlink(temp_path)
        except Exception as e:
            print(f"TTS Error: {e}. Text: {text}")

    def speech_to_text(self, language=None):
        if not language:
            language = self.current_language
        with sr.Microphone() as source:
            print("Listening...")
            self.recognizer.adjust_for_ambient_noise(source)
            try:
                audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=5)
                text = self.recognizer.recognize_google(audio, language=language)
                print(f"You said: {text}")
                return text
            except sr.WaitTimeoutError:
                print("No speech detected within timeout.")
                return None
            except sr.UnknownValueError:
                print("Could not understand audio.")
                return None
            except sr.RequestError as e:
                print(f"Google Speech Recognition service error: {e}")
                return None
            except Exception as e:
                print(f"Unexpected speech recognition error: {e}")
                return None


class DiagnosticModel:
    def __init__(self):
        self.voice = VoiceAssistant()
        self.supported_languages = {
            'english': 'en',
            'hindi': 'hi',
            'kannada': 'kn',
            'marathi': 'mr',
            'tamil': 'ta',
            'telugu': 'te',
            'bengali': 'bn',
            'gujarati': 'gu',
            'malayalam': 'ml'
        }

        self.command_translations = {
            'en': {
                'exit': ['exit', 'quit', 'stop', 'end'],
                'no': ['no', 'nope', 'nah'],
                'prompts': {
                    'choose_language': "Please say your preferred language",
                    'describe_symptoms': "Please describe your symptoms",
                    'continue_prompt': "Would you like to check another symptom?",
                    'goodbye': "Goodbye!",
                    'not_understood': "I didn't understand. Please try again"
                },
                'labels': {
                    'relief_tips': "Relief tips",
                    'emergency_signs': "Emergency signs",
                    'important_note': "Important note"
                }
            },
            # Add other languages with the same structure...
            'hi': {
                'exit': ['बाहर', 'समाप्त', 'रुको'],
                'no': ['नहीं', 'ना'],
                'prompts': {
                    'choose_language': "कृपया अपनी पसंदीदा भाषा बताएं",
                    'describe_symptoms': "कृपया अपने लक्षण बताएं",
                    'continue_prompt': "क्या आप कोई अन्य लक्षण जांचना चाहेंगे?",
                    'goodbye': "अलविदा!",
                    'not_understood': "मैं समझा नहीं। कृपया फिर से प्रयास करें"
                },
                'labels': {
                    'relief_tips': "राहत के उपाय",
                    'emergency_signs': "आपातकालीन संकेत",
                    'important_note': "महत्वपूर्ण नोट"
                }
            },
            # Add 'kn', 'mr', and others similarly...
        }

    def is_command(self, text, command_type='exit'):
        if not text:
            return False
        text = text.lower()
        commands = self.command_translations.get(
            self.voice.current_language, self.command_translations['en'])[command_type]
        return any(cmd.lower() in text for cmd in commands)

    def get_prompt(self, prompt_type):
        return self.command_translations.get(
            self.voice.current_language, self.command_translations['en'])['prompts'][prompt_type]

    def get_label(self, label_type):
        return self.command_translations.get(
            self.voice.current_language, self.command_translations['en'])['labels'][label_type]

    def call_gemini_json(self, prompt: str) -> dict:
        full_prompt = prompt + f"""

Please respond with a JSON object in {self.voice.current_language} language with these fields:
- "patient_message": string (complete response in simple terms)
- "relief_tips": array of strings (localized)
- "possible_causes": array of strings (localized)
- "emergency_signs": array of strings (localized)
- "important_note": string (localized)
"""
        resp = model.generate_content(full_prompt)
        text = resp.text.strip()
        for ch in ["```json", "```"]:
            text = text.replace(ch, "")
        return json.loads(text)

    def symptom_checker(self, symptom: str) -> dict:
        prompt = (
            f"You are a rural health assistant. A patient says: \"{symptom}\". "
            f"Advise them in simple terms in {self.voice.current_language} language. "
            "Provide a complete response that can be read aloud directly."
        )
        result = self.call_gemini_json(prompt)

        localized_labels = {
            'relief_tips': self.get_label('relief_tips'),
            'emergency_signs': self.get_label('emergency_signs'),
            'important_note': self.get_label('important_note')
        }

        full_response = (
            f"{result['patient_message']}\n\n"
            f"{localized_labels['relief_tips']}: {'; '.join(result['relief_tips'])}\n"
            f"{localized_labels['emergency_signs']}: {'; '.join(result['emergency_signs'])}\n"
            f"{localized_labels['important_note']}: {result['important_note']}"
        )

        # Speak the full response asynchronously (if you want blocking, remove thread)
        threading.Thread(target=self.voice.text_to_speech, args=(full_response, self.voice.current_language), daemon=True).start()

        return result

    # Optional interactive_mode and pretty_print_section omitted for backend service context
