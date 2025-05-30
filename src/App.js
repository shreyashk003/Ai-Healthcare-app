import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import LoginPage from './Components/LoginPage';
import HomePage from './Components/HomePage'; // Make sure you have this
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  // Persist login state on page refresh
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/doctor"
          element={user ? <DoctorDashboard user={user} /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={(u) => setUser(u)} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
