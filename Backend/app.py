from flask import Flask, request, jsonify
import threading
from diagnostic_assistant import DiagnosticModel
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

assistant = DiagnosticModel()


@app.route('/')
def home():
    return jsonify({"message": "Flask backend is running"})


@app.route('/api/process_symptoms', methods=['POST'])
def process_symptoms():
    data = request.json
    symptoms = data.get('symptoms')
    language = data.get('language', 'en')

    assistant.voice.current_language = language
    result = assistant.symptom_checker(symptoms)

    return jsonify({
        'diagnosis': result['patient_message'],
        'relief_tips': result['relief_tips'],
        'emergency_signs': result['emergency_signs'],
        'important_note': result['important_note']
    })


@app.route('/api/listen', methods=['GET'])
def listen():
    language = request.args.get('language', 'en')
    assistant.voice.current_language = language
    text = assistant.voice.speech_to_text()
    return jsonify({'text': text if text else ''})


@app.route('/api/speak', methods=['POST'])
def speak():
    data = request.json
    text = data.get('text')
    language = data.get('language', 'en')

    def run_tts():
        assistant.voice.text_to_speech(text, language)

    threading.Thread(target=run_tts, daemon=True).start()
    return jsonify({'status': 'speaking'})


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=9000, debug=True)
