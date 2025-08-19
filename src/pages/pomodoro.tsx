// src/pages/pomodoro.tsx


import { useState, useRef, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import BackButton from "@/components/BackButton";

const FOCUS_TIME = 25 * 60; // 25 mins in seconds
const STORAGE_KEY = "pomodoroStart";
const STORAGE_ELAPSED_KEY = "pomodoroElapsed";

export default function Pomodoro() {
  const { user } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // how many seconds focused this session
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartRef = useRef<Date | null>(null);

  // Format seconds to MM:SS
  const formatTime = (time: number) => {
    const mins = String(Math.floor(time / 60)).padStart(2, "0");
    const secs = String(time % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Start or resume timer
  const startTimer = (restore = false) => {
    if (intervalRef.current) return;
    setIsRunning(true);

    if (!restore) {
      sessionStartRef.current = new Date();
      setElapsed(0);
      localStorage.setItem(STORAGE_ELAPSED_KEY, "0");
      localStorage.setItem(STORAGE_KEY, sessionStartRef.current.getTime().toString());
      setSecondsLeft(FOCUS_TIME);
    } else {
      // Restore sessionStartRef if needed
      const savedStart = localStorage.getItem(STORAGE_KEY);
      if (savedStart) sessionStartRef.current = new Date(Number(savedStart));
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsRunning(false);
          setSecondsLeft(0);

          // Log full session (25 mins)
          logPomodoroSession(sessionStartRef.current!, FOCUS_TIME / 60);

          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(STORAGE_ELAPSED_KEY);
          setElapsed(0);

          return 0;
        }
        // Update elapsed seconds and localStorage
        setElapsed(prevElapsed => {
          const newElapsed = prevElapsed + 1;
          localStorage.setItem(STORAGE_ELAPSED_KEY, newElapsed.toString());
          updateTodayFocusMinutes(user, 1 / 60); // update stats live in Firestore & localStorage
          return newElapsed;
        });

        return prev - 1;
      });
    }, 1000);
  };

  // Pause timer
  const pauseTimer = () => {
    clearInterval(intervalRef.current!);
    intervalRef.current = null;
    setIsRunning(false);
  };

  // Reset timer, count partial session as a completed session
  const resetTimer = () => {
    if (elapsed > 0 && sessionStartRef.current && user) {
      // Calculate partial minutes completed in session
      const partialMins = Math.floor(elapsed / 60);

      // Log partial session minutes to Firestore
      logPomodoroSession(sessionStartRef.current, partialMins);
      updateTodayFocusMinutes(user, partialMins); // add partial mins to today's focus immediately
    }

    pauseTimer();
    setSecondsLeft(FOCUS_TIME);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_ELAPSED_KEY);
    setElapsed(0);

    // Also increment total sessions count for partial or reset session
    incrementTotalSessions(user);
  };

  // Log Pomodoro session (called on full or partial session end)
  const logPomodoroSession = async (startTime: Date, durationMins: number) => {
    if (!user || durationMins <= 0) return;

    try {
      await addDoc(collection(db, "users", user.uid, "pomodoroLogs"), {
        startedAt: Timestamp.fromDate(startTime),
        endedAt: Timestamp.fromDate(new Date()),
        duration: durationMins,
        date: new Date().toDateString(),
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to log Pomodoro session:", error);
    }
  };

  // Update today's focus minutes in Firestore and localStorage
  const updateTodayFocusMinutes = async (user: any, minutes: number) => {
    if (!user || minutes <= 0) return;

    const todayStr = new Date().toDateString();
    const todayDocRef = collection(db, "users", user.uid, "stats");
    const todayDocId = todayStr.replace(/\s/g, "-"); // unique id by date e.g. "Mon-Apr-17-2023"

    try {
      // Update Firestore with today's minutes incrementally
      // This requires a proper Firestore function or you can read-modify-write:
      // For simplicity: read the doc, update, then write back
      // Alternatively, use transactions (out of this snippet scope)
      // Here we keep a cache in localStorage too
      let cachedStatsRaw = localStorage.getItem("statsTodayFocus");
      let cachedStats = cachedStatsRaw ? JSON.parse(cachedStatsRaw) : { minutes: 0, sessions: 0 };

      cachedStats.minutes += minutes;

      localStorage.setItem("statsTodayFocus", JSON.stringify(cachedStats));

      // Here you can update a stats document if you want (optional)

      // For simplicity, the Stats page will also sum from logs, so this is optional

    } catch (err) {
      console.error("Failed to update today's focus minutes", err);
    }
  };

  // Increment total sessions count in Firestore and localStorage
  const incrementTotalSessions = async (user: any) => {
    if (!user) return;

    let cachedStatsRaw = localStorage.getItem("statsTodayFocus");
    let cachedStats = cachedStatsRaw ? JSON.parse(cachedStatsRaw) : { minutes: 0, sessions: 0 };
    cachedStats.sessions += 1;
    localStorage.setItem("statsTodayFocus", JSON.stringify(cachedStats));

    // Optionally you can update total sessions in Firestore stats doc here as well
  };

  // Restore timer on mount
  useEffect(() => {
    const savedStart = localStorage.getItem(STORAGE_KEY);
    const savedElapsed = localStorage.getItem(STORAGE_ELAPSED_KEY);

    if (savedStart && savedElapsed) {
      const elapsedSec = Number(savedElapsed);
      const elapsedMins = Math.floor(elapsedSec / 60);

      const elapsedTime = elapsedSec;
      const remaining = FOCUS_TIME - elapsedTime;

      if (remaining > 0) {
        sessionStartRef.current = new Date(Number(savedStart));
        setElapsed(elapsedSec);
        setSecondsLeft(remaining);
        startTimer(true);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_ELAPSED_KEY);
      }
    }
  }, []);

 return (
  <div className="relative min-h-screen flex items-center justify-center px-4 bg-[#0f0f11]">
    
    {/* 🔙 Back Button fixed at top-left of the page */}
    <div className="absolute top-4 left-4 z-50">
      <BackButton to="/dashboard" />
    </div>

    {/* 🔲 Main Focus Timer Card (centered) */}
    <div className="bg-pink-500/10 backdrop-blur-lg border border-pink-500/20 rounded-2xl p-10 w-full max-w-xl shadow-2xl text-white text-center">
      
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-pink-500">⏱ Focus Timer</h1>

      <div className="text-7xl font-mono px-12 py-8 rounded-3xl border border-white/20 bg-black/40 backdrop-blur-md shadow-inner">
        {formatTime(secondsLeft)}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button
           onClick={() => startTimer(false)}
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
