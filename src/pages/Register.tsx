import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError(""); // Reset error
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      navigate("/pomodoro");
    } catch (err: any) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already in use.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;
        default:
          setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Animated Gradient Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-black via-gray-900 to-black animate-pulse opacity-30" />
        <div className="absolute top-1/4 left-1/3 w-[60vw] h-[60vw] rounded-full bg-gradient-radial from-gray-700 via-gray-900 to-black blur-3xl opacity-40 animate-[spin_60s_linear_infinite]" />
        <div className="absolute bottom-10 right-10 w-[40vw] h-[40vw] rounded-full bg-gradient-radial from-white/10 to-transparent blur-2xl opacity-20" />
      </div>

    {/* Foreground Register Form */}
    <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create your account</h2>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          aria-label="Email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          aria-label="Password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-600 underline hover:text-pink-800">
            Login
          </Link>
        </p>
      </div>
    </div>
  </div>
);

}
