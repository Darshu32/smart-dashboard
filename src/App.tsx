import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
import Pomodoro from "./pages/pomodoro";
import TaskManager from "./pages/TaskManager";
import WeeklyPlanner from "./pages/WeeklyPlanner";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login"; // 🔥 Add this line
import Register from "./pages/Register";
import Stats from "./pages/Stats";
import Profile from "./pages/Profile";


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Route (Public) */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />


        {/* Pomodoro Route (Protected) */}
        <Route
          path="/pomodoro"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <main className="ml-64 w-full min-h-screen bg-[#f4f5f7] p-6">
                  <Pomodoro />
                </main>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Task Manager Route (Protected) */}
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <main className="ml-64 w-full min-h-screen bg-[#f4f5f7] p-6">
                  <TaskManager />
                </main>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Weekly Planner Route (Protected) */}
        <Route
          path="/planner"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <main className="ml-64 w-full min-h-screen bg-[#f4f5f7] p-6">
                  <WeeklyPlanner />
                </main>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
  path="/stats"
  element={
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <main className="ml-64 w-full min-h-screen bg-[#f4f5f7] p-6">
          <Stats />
        </main>
      </div>
    </ProtectedRoute>
  }
/>
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <main className="ml-64 w-full min-h-screen bg-[#f4f5f7] p-6">
          <Profile />
        </main>
      </div>
    </ProtectedRoute>
  }
/>


      </Routes>
    </Router>
  );
}
