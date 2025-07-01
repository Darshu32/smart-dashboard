import { useState, useRef } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const FOCUS_TIME = 25 * 60;

export default function Pomodoro() {
  const { user } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (time: number) => {
    const mins = String(Math.floor(time / 60)).padStart(2, "0");
    const secs = String(time % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const startTimer = () => {
    if (intervalRef.current) return;
    setIsRunning(true);
    const sessionStart = new Date(); // record start time

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsRunning(false);
          setSecondsLeft(0);
          logPomodoroSession(sessionStart); // save to Firestore
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
      alert("🎉 Focus session logged to Firestore!");
    } catch (error) {
      console.error("Failed to log Pomodoro session:", error);
    }
  };

  return (
    <div
  className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
  style={{
    backgroundImage: `url('https://images.pexels.com/photos/2680270/pexels-photo-2680270.jpeg')`,
  }}
>
  <div className="bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-lg">
    <h1 className="text-4xl font-bold text-gray-800">Pomodoro Timer</h1>

<div className="text-7xl font-mono px-12 py-8 rounded-3xl shadow-lg border border-white/20 bg-black/50 backdrop-blur text-white my-6">
  {formatTime(secondsLeft)}
</div>


    <div className="flex gap-6 mt-4 justify-center">
      <button
        onClick={startTimer}
        disabled={isRunning}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow-md disabled:opacity-50"
      >
        Start
      </button>
      <button
        onClick={pauseTimer}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl shadow-md"
      >
        Pause
      </button>
      <button
        onClick={resetTimer}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl shadow-md"
      >
        Reset
      </button>
    </div>

    <p className="mt-6 text-lg text-gray-100">
      Session: <span className="font-semibold text-white">Focus</span>
    </p>
  </div>
</div>

  );
}
