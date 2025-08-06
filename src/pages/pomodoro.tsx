import { useState, useRef } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Sidebar from "@/components/Sidebar"; // your existing sidebar


const FOCUS_TIME = 25 * 60;

export default function Pomodoro() {
  const { user } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (time: number) => {
    const mins = String(Math.floor(time / 60)).padStart(2, "0");
    const secs = String(time % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const startTimer = () => {
    if (intervalRef.current) return;
    setIsRunning(true);
    const sessionStart = new Date();

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsRunning(false);
          setSecondsLeft(0);
          logPomodoroSession(sessionStart);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current!);
    intervalRef.current = null;
    setIsRunning(false);
  };

  const resetTimer = () => {
    pauseTimer();
    setSecondsLeft(FOCUS_TIME);
  };

  const logPomodoroSession = async (startTime: Date) => {
    if (!user) return;

    try {
      await addDoc(collection(db, "users", user.uid, "pomodoroLogs"), {
        startedAt: startTime,
        endedAt: new Date(),
        duration: 25,
        date: new Date().toDateString(),
        createdAt: serverTimestamp(),
      });
      alert("🎉 Focus session logged!");
    } catch (error) {
      console.error("Failed to log Pomodoro session:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0f0f11]">
      <div className="bg-pink-500/10 backdrop-blur-lg border border-pink-500/20 rounded-2xl p-10 w-full max-w-xl shadow-2xl text-white text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-pink-500">⏱ Focus Timer</h1>


        <div className="text-7xl font-mono px-12 py-8 rounded-3xl border border-white/20 bg-black/40 backdrop-blur-md shadow-inner">
          {formatTime(secondsLeft)}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <button
            onClick={startTimer}
            disabled={isRunning}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow transition disabled:opacity-40"
          >
            Start
          </button>
          <button
            onClick={pauseTimer}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg shadow transition"
          >
            Pause
          </button>
          <button
            onClick={resetTimer}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow transition"
          >
            Reset
          </button>
        </div>

        <p className="mt-6 text-lg">
          Session Type: <span className="font-semibold text-pink-400">Focus</span>
        </p>
      </div>
    </div>
  );
}
