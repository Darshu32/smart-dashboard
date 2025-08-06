import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { LogOut, Menu, Timer, CheckSquare, CalendarDays, BarChart3, Bot, User } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = auth.currentUser;
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [isOpen, setIsOpen] = useState(false); // toggle for mobile

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/login"));
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

  const navLinks = [
    { name: "Pomodoro", to: "/pomodoro", icon: <Timer size={18} /> },
    { name: "Task Manager", to: "/TaskManager", icon: <CheckSquare size={18} /> },
    { name: "Weekly Planner", to: "/WeeklyPlanner", icon: <CalendarDays size={18} /> },
    { name: "Stats", to: "/stats", icon: <BarChart3 size={18} /> },
    { name: "AI Assistant", to: "/assistant", icon: <Bot size={18} /> },
    { name: "Profile", to: "/profile", icon: <User size={18} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Hamburger */}
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
        className={`fixed top-0 left-0 h-screen w-64 bg-[#121212] text-white p-6 shadow-xl flex flex-col justify-between z-40 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div>
          {/* Greeting */}
          <div className="flex items-center gap-3 mb-8">
            {photo ? (
              <img src={photo} alt="Avatar" className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-500" />
            )}
            <p className="text-lg font-semibold">
              Hi{name ? `, ${name}` : ""} 👋
            </p>
          </div>

          {/* Nav Title */}
          <h2 className="text-xl font-bold mb-5 text-pink-500">Smart AI Dashboard</h2>

          {/* Navigation */}
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 ${
                  isActive(link.to)
                    ? "bg-blue-600 text-white"
                    : "hover:bg-[#1f1f2e] text-gray-300"
                }`}
              >
                <span>{link.icon}</span>
                <span className="text-sm">{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-10 flex items-center gap-2 px-4 py-2 rounded-md bg-pink-500 hover:bg-pink-600 text-sm font-medium"

        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>
    </>
  );
}
