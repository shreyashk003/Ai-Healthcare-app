// File: src/components/AppointmentForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import doctorIllustration from '../Doctor.mp4';

const AppointmentForm = () => {
  const [form, setForm] = useState({ name: '', symptoms: '', date: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:9000/appointments', form);
      alert('Appointment booked successfully');
      setForm({ name: '', symptoms: '', date: '' });
    } catch (err) {
      console.error(err);
      alert('Booking failed');
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md mx-auto mt-10 animate-fade-in">
      <div className="flex flex-col items-center mb-6">
        <video
          src={doctorIllustration}
          autoPlay
          loop
          muted
          className="w-32 h-32 rounded-full mb-4 object-cover shadow-sm"
        />
        <h2 className="text-2xl font-bold text-gray-800">Book Telemedicine Appointment</h2>
        <p className="text-gray-500 text-sm text-center">Fill out the form below to schedule your appointment</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            required
          />
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Symptoms"
            value={form.symptoms}
            onChange={e => setForm({ ...form, symptoms: e.target.value })}
            className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            required
          />
        </div>
        <div className="relative">
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition transform hover:scale-105 duration-300"
        >
          Book
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;

// Add to global CSS (e.g., index.css or App.css) for animation:
// .animate-fade-in {
//   animation: fadeIn 0.6s ease-out forwards;
// }
// @keyframes fadeIn {
//   0% { opacity: 0; transform: translateY(20px); }
//   100% { opacity: 1; transform: translateY(0); }
// }
