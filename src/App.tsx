import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PomodoroPage from "./pages/pomodoro";
import TaskManagerPage from "./pages/TaskManager";
import WeeklyPlannerPage from "./pages/WeeklyPlanner";
import StatsPage from "./pages/Stats";
import ProfilePage from "./pages/Profile";
import AIAssistant from "./pages/AIAssistantPage";
import { useAuth } from "./context/AuthContext";
import { JSX } from "react";

const App = () => {
  const { user } = useAuth();

  // 🔒 Protect routes from unauthenticated access
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 Protected Dashboard & Feature Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pomodoro"
          element={
            <ProtectedRoute>
              <PomodoroPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/TaskManager"
          element={
            <ProtectedRoute>
              <TaskManagerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/WeeklyPlanner"
          element={
            <ProtectedRoute>
              <WeeklyPlannerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stats"
          element={
            <ProtectedRoute>
              <StatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assistant"
          element={
            <ProtectedRoute>
              <AIAssistant/>
            </ProtectedRoute>
         }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
