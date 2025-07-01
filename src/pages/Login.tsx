import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/pomodoro"); // redirect on success
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/premium-photo/abstract-background-beautiful-close-up-image-wallpaper-ai-generated_859483-200869.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="relative z-10 bg-white/90 backdrop-blur-md shadow-xl rounded-xl p-10 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login to Your Dashboard
        </h2>

        {error && (
          <p className="mb-4 text-red-500 text-sm text-center">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account yet?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </Link>
        </div>

        <div className="mt-2 text-center text-sm">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
