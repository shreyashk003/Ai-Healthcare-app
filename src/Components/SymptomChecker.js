import React, { useState } from "react";
import axios from "axios";

const SymptomChecker = () => {
  const [symptom, setSymptom] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!symptom.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await axios.post("http://localhost:9000/api/symptom-check", {
        symptom,
      });
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching data. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md w-full mx-auto mt-6 bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-3 border-b border-gray-300">
        <h2 className="text-lg font-semibold text-blue-700">🩺 Symptom Checker</h2>
      </div>

      <div className="p-4">
        <input
          type="text"
          placeholder="Enter symptom..."
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          disabled={loading}
          className="w-full p-2 border rounded-md mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
        />

        <button
          onClick={handleCheck}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md transition duration-200 disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check"}
        </button>

        {response && (
          <div
            className="mt-4 space-y-3 text-sm max-h-64 overflow-y-auto px-2"
            style={{ wordBreak: "break-word" }}
          >
            <div>
              <h3 className="font-semibold text-green-700">Advice:</h3>
              <p className="text-gray-800">{response.patient_message}</p>
            </div>

            <div>
              <h3 className="font-semibold text-indigo-700">Relief Tips:</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {response.relief_tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-yellow-700">Possible Causes:</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {response.possible_causes.map((cause, i) => (
                  <li key={i}>{cause}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-red-700">Emergency Signs:</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {response.emergency_signs.map((sign, i) => (
                  <li key={i}>{sign}</li>
                ))}
              </ul>
            </div>

            <p className="text-gray-600">
              <strong>Note:</strong> {response.important_note}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;
