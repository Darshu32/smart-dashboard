import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // for showing error messages
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError(""); // clear previous errors

    if (!email || !password) {
      setError("⚠️ Please fill all fields.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/pomodoro");
    } catch (err: any) {
      console.error("Signup Error:", err.message);
      
      if (err.code === "auth/email-already-in-use") {
        setError("⚠️ This email is already in use. Try logging in.");
      } else if (err.code === "auth/invalid-email") {
        setError("⚠️ Invalid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("⚠️ Password should be at least 6 characters.");
      } else {
        setError(err.message || "⚠️ Signup failed. Try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
        )}

        <button
          onClick={handleSignup}
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Sign Up
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
