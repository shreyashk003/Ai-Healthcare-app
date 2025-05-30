// File: src/components/HealthTips.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const fallbackTips = [
  "Drink at least 8 glasses of water daily.",
  "Get at least 7–8 hours of sleep each night.",
  "Incorporate fruits and vegetables into every meal.",
  "Take short walks after meals to aid digestion.",
  "Practice deep breathing or meditation for 10 minutes daily."
];

const HealthTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:9000/tips')
      .then(res => {
        const fetchedTips = (res.data.tips || []).filter(tip => tip && typeof tip === 'string');
        setTips(fetchedTips.length > 0 ? fetchedTips : fallbackTips);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching tips:", err);
        setTips(fallbackTips); // fallback if fetch fails
        setLoading(false);
      });
  }, []);

  return (
    <motion.div
      className="bg-white shadow-xl rounded-2xl p-6 max-w-xl mx-auto border border-gray-100"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="text-yellow-500" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Daily Health Tips</h2>
      </div>

      {loading ? (
        <p className="text-gray-500 italic">Loading tips...</p>
      ) : (
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          {tips.map((tip, i) => (
            <li key={i} className="leading-relaxed">{tip}</li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default HealthTips;
