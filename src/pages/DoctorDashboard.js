// File: src/pages/DoctorDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:9000/appointments')
      .then(res => setAppointments(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>
      <ul className="space-y-2">
        {appointments.map((a, i) => (
          <li key={i} className="border p-2 rounded">
            <p><strong>Name:</strong> {a.name}</p>
            <p><strong>Symptoms:</strong> {a.symptoms}</p>
            <p><strong>Date:</strong> {a.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorDashboard;