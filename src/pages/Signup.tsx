import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/pomodoro");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Signup</h1>
      <input
        type="email"
        placeholder="Email"
        className="p-2 border rounded mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="p-2 border rounded mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSignup}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Signup
      </button>
      <p className="mt-4 text-sm">
        Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
      </p>
    </div>
  );
}
