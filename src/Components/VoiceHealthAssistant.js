import React, { useState, useEffect } from 'react';

const VoiceHealthAssistant = () => {
  const [language, setLanguage] = useState('en');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [reliefTips, setReliefTips] = useState([]);
  const [emergencySigns, setEmergencySigns] = useState([]);
  const [importantNote, setImportantNote] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9000';

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const speechRecognition = new SpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;

      speechRecognition.onstart = () => setIsListening(true);
      speechRecognition.onend = () => setIsListening(false);

      speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSymptoms(transcript);
      };

      speechRecognition.onerror = (event) => {
        alert('Speech recognition error: ' + event.error);
      };

      setRecognition(speechRecognition);
    } else {
      alert('Your browser does not support Speech Recognition.');
    }
  }, []);

  const handleMicClick = () => {
    if (recognition) {
      if (!isListening) {
        recognition.lang = language;
        recognition.start();
      } else {
        recognition.stop();
      }
    }
  };

  const handleSpeakInstructions = () => {
    fetch(`${API_BASE_URL}/api/speak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Please describe your symptoms after the beep', language })
    }).catch((error) => {
      console.error('Error:', error);
      alert('Error sending speak instructions');
    });
  };

  const handleSubmit = () => {
    if (!symptoms.trim()) {
      alert('Please describe your symptoms first');
      return;
    }

    fetch(`${API_BASE_URL}/api/process_symptoms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms, language })
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setDiagnosis(data.diagnosis);
        setReliefTips(data.relief_tips);
        setEmergencySigns(data.emergency_signs);
        setImportantNote(data.important_note);
        setShowResults(true);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error processing symptoms');
      });
  };

  const handleReadAloud = () => {
    const fullText = [
      diagnosis,
      'Relief Tips: ' + reliefTips.join('. '),
      'Emergency Signs: ' + emergencySigns.join('. '),
      'Important Note: ' + importantNote,
    ].join('. ');

    fetch(`${API_BASE_URL}/api/speak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: fullText, language })
    }).catch((error) => {
      console.error('Error:', error);
      alert('Error sending read aloud request');
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 font-sans text-gray-800">
      <header className="bg-gray-800 text-white text-center p-6 rounded-t-lg mb-6">
        <h1 className="text-3xl font-bold">Voice Health Assistant</h1>
        <p className="text-sm mt-1">Describe your symptoms and get medical advice</p>
      </header>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="flex-grow p-2 rounded bg-gray-100 text-sm"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="kn">Kannada</option>
            <option value="mr">Marathi</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
          </select>
          <button
            onClick={handleSpeakInstructions}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Speak Instructions
          </button>
        </div>

        <button
          onClick={handleMicClick}
          className={`w-full text-white py-2 px-4 rounded mb-4 ${
            isListening ? 'bg-red-600 animate-pulse' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {isListening ? 'Listening... Speak Now' : 'Press and Speak Your Symptoms'}
        </button>

        <p className="text-sm mb-2">Or type your symptoms below:</p>
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe your symptoms here..."
          className="w-full border border-gray-300 rounded p-2 text-sm mb-4 min-h-[100px]"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Get Diagnosis
        </button>
      </div>

      {showResults && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 border-b border-blue-400 mb-2">Diagnosis</h2>
          <p className="mb-4">{diagnosis}</p>

          <h2 className="text-xl font-semibold text-gray-700 border-b border-blue-400 mb-2">Relief Tips</h2>
          <ul className="list-disc list-inside mb-4">
            {reliefTips.map((tip, idx) => <li key={idx}>{tip}</li>)}
          </ul>

          <h2 className="text-xl font-semibold text-gray-700 border-b border-blue-400 mb-2">Emergency Signs</h2>
          <ul className="list-disc list-inside mb-4">
            {emergencySigns.map((sign, idx) => <li key={idx}>{sign}</li>)}
          </ul>

          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
            <h2 className="font-semibold text-yellow-800">Important Note</h2>
            <p>{importantNote}</p>
          </div>

          <button
            onClick={handleReadAloud}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4"
          >
            Read Aloud
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceHealthAssistant;
