import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { LogOut, Menu } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [isOpen, setIsOpen] = useState(false); // toggle for mobile

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
    <>
      {/* Hamburger icon (mobile) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white bg-[#1E1F22] p-2 rounded-md shadow-md"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#1E1F22] text-white p-6 shadow-xl flex flex-col justify-between z-40 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div>
          {/* Profile */}
          <div className="flex items-center gap-3 mb-6">
            {photo ? (
              <img src={photo} alt="Avatar" className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-500" />
            )}
            <p className="font-semibold text-lg">
              Hi{name ? `, ${name}` : ""} 👋
            </p>
          </div>

          <h2 className="text-xl font-bold mb-4">Smart Dashboard</h2>

          {/* Navigation */}
          <nav className="flex flex-col gap-4">
            <Link to="/pomodoro" className="hover:text-blue-400" onClick={() => setIsOpen(false)}>
              ⏱ Pomodoro
            </Link>
            <Link to="/tasks" className="hover:text-blue-400" onClick={() => setIsOpen(false)}>
              📝 Task Manager
            </Link>
            <Link to="/planner" className="hover:text-blue-400" onClick={() => setIsOpen(false)}>
              📅 Weekly Planner
            </Link>
            <Link to="/stats" className="hover:text-blue-400" onClick={() => setIsOpen(false)}>
              📊 Stats
            </Link>
            <Link to="/profile" className="hover:text-blue-400" onClick={() => setIsOpen(false)}>
              👤 Profile
            </Link>
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
    </>
  );
}
