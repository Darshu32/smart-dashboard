// src/pages/Login.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { motion } from "framer-motion";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      const errorCode = err.code;
      let message = "Login failed. Please try again.";

      switch (errorCode) {
        case "auth/invalid-email":
          message = "Invalid email format.";
          break;
        case "auth/user-not-found":
          message = "No account found with this email.";
          break;
        case "auth/wrong-password":
          message = "Incorrect password.";
          break;
        case "auth/too-many-requests":
          message = "Too many failed attempts. Try again later.";
          break;
      }

      setError(message);
    }
  };

  return (
    <motion.div
      className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Background Layer (copied from LandingPage) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-black via-gray-900 to-black animate-pulse opacity-30" />
        <div className="absolute top-1/4 left-1/3 w-[60vw] h-[60vw] rounded-full bg-gradient-radial from-gray-700 via-gray-900 to-black blur-3xl opacity-40 animate-[spin_60s_linear_infinite]" />
        <div className="absolute bottom-10 right-10 w-[40vw] h-[40vw] rounded-full bg-gradient-radial from-white/10 to-transparent blur-2xl opacity-20" />
      </div>

      {/* Login Box */}
      <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-black">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        {error && (
          <p className="mb-4 text-red-500 text-sm text-center">{error}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-3 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-3 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 rounded-md hover:bg-pink-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;
