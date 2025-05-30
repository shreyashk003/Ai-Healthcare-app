import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock } from "react-icons/fi";

const LoginPage = ({ onLoginSuccess }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:9000/login", { name, password });

      if (res.data.success) {
        onLoginSuccess(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard"); // 🔥 Go to dashboard after successful login
      } else {
        setError("Invalid name or password.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-teal-100 px-4 py-12">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md border border-gray-100 transition-all duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-2">Login to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Username</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-300">
              <FiUser className="text-gray-400 mr-2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                placeholder="Your Name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-300">
              <FiLock className="text-gray-400 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                placeholder="********"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-100 py-2 rounded">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-400 hover:bg-green-500 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-gray-500 text-xs mt-4">
            Don’t have an account?{" "}
            <span className="text-green-600 hover:underline cursor-pointer">Contact Admin</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
