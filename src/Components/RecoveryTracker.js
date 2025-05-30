import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecoveryTracker = () => {
  const [progress, setProgress] = useState({ exercise: false, medicine: false });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = 'user1';

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:9000/recovery', { user, ...progress });
      setProgress({ exercise: false, medicine: false });
      fetchLogs();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to log recovery');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`http://localhost:9000/recovery/${user}`);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-6 mt-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">🛡️ Recovery Tracker</h2>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="exercise"
            checked={progress.exercise}
            onChange={e => setProgress({ ...progress, exercise: e.target.checked })}
            className="w-5 h-5 text-purple-600 rounded"
          />
          <label htmlFor="exercise" className="text-lg">Did you exercise today?</label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="medicine"
            checked={progress.medicine}
            onChange={e => setProgress({ ...progress, medicine: e.target.checked })}
            className="w-5 h-5 text-purple-600 rounded"
          />
          <label htmlFor="medicine" className="text-lg">Did you take your medicine?</label>
        </div>

        <button
          onClick={handleSubmit}
          className={`w-full py-2 px-4 text-white font-semibold rounded-lg transition-all duration-300 ${
            loading
              ? 'bg-purple-300 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : '📤 Submit Log'}
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">📋 Previous Logs</h3>
        {logs.length === 0 ? (
          <p className="text-gray-500 italic">No recovery logs yet.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log, i) => (
              <li
                key={i}
                className="bg-gray-100 rounded-lg px-4 py-2 flex justify-between items-center shadow-sm"
              >
                <div>
                  <p>🏋️ Exercise: <span className={log.exercise ? 'text-green-600' : 'text-red-600'}>{log.exercise ? 'Yes ✅' : 'No ❌'}</span></p>
                  <p>💊 Medicine: <span className={log.medicine ? 'text-green-600' : 'text-red-600'}>{log.medicine ? 'Yes ✅' : 'No ❌'}</span></p>
                </div>
                {log.timestamp && (
                  <div className="text-sm text-gray-500 text-right">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecoveryTracker;
