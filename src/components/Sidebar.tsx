import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/login");
    });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setName(snap.data().name || "");
        setPhoto(snap.data().photoURL || "");
      }
    };
    fetchProfile();
  }, [user]);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1E1F22] text-white p-6 shadow-xl flex flex-col justify-between">
      <div>
        {/* Profile Section */}
        <div className="flex items-center gap-3 mb-6">
          {photo ? (
            <img src={photo} alt="Avatar" className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-500" />
          )}
          <p className="font-semibold text-lg">Hi{ name ? `, ${name}` : "" } 👋</p>
        </div>

        <h2 className="text-xl font-bold mb-4">Smart Dashboard</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/pomodoro" className="hover:text-blue-400">⏱ Pomodoro</Link>
          <Link to="/tasks" className="hover:text-blue-400">📝 Task Manager</Link>
          <Link to="/planner" className="hover:text-blue-400">📅 Weekly Planner</Link>
          <Link to="/stats" className="hover:text-blue-400">📊 Stats</Link>
          <Link to="/profile" className="hover:text-blue-400">👤 Profile</Link>
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-8 flex items-center gap-2 text-red-400 hover:text-red-500 font-medium"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
