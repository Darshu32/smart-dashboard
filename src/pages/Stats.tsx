// src/pages/Stats.tsx

import { useEffect, useMemo, useState } from "react";
import { FiTrendingUp } from "react-icons/fi";
import BackButton from "@/components/BackButton";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

interface PomodoroLog {
  startedAt: { seconds: number };
  endedAt: { seconds: number };
  duration: number;
  date: string;
}

export default function Stats() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<PomodoroLog[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "pomodoroLogs"),
      orderBy("startedAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: PomodoroLog[] = [];
      snapshot.forEach((doc) => {
        fetched.push(doc.data() as PomodoroLog);
      });
      setLogs(fetched);

      // Cache locally for offline / refresh
      localStorage.setItem("pomodoroLogs", JSON.stringify(fetched));
    });

    return () => unsubscribe();
  }, [user]);

  const todayStr = new Date().toDateString();

  // Calculate stats live from logs + localStorage
  const { todayTotal, totalSessions, totalMinutes } = useMemo(() => {
    // Try get cached stats as fallback for instant display
    let cachedStatsRaw = localStorage.getItem("statsTodayFocus");
    let cachedStats = cachedStatsRaw ? JSON.parse(cachedStatsRaw) : null;

    // Logs from firestore
    const todayLogs = logs.filter(log => log.date === todayStr);

    const todayTotalFromLogs = todayLogs.reduce((sum, log) => sum + log.duration, 0);
    const totalMinutesFromLogs = logs.reduce((sum, log) => sum + log.duration, 0);

    // Use logs value if no cache or cache less (means logs more updated)
    const todayTotal = cachedStats && cachedStats.minutes > todayTotalFromLogs
      ? cachedStats.minutes
      : todayTotalFromLogs;

    const totalSessions = cachedStats ? cachedStats.sessions : logs.length;
    const totalMinutes = totalMinutesFromLogs;

    return { todayTotal, totalSessions, totalMinutes };
  }, [logs]);

  // Chart data grouped by date, last 7 days
  const chartData = useMemo(() => {
    const dayMap: Record<string, number> = {};
    logs.forEach((log) => {
      dayMap[log.date] = (dayMap[log.date] || 0) + log.duration;
    });
    return Object.entries(dayMap)
      .map(([date, minutes]) => ({ date, minutes }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7);
  }, [logs]);


  return (
    <div className="min-h-screen bg-black text-white p-6 relative">
      {/* Back Button - fixed top left */}
      <div className="absolute top-6 left-6 z-10">
        <BackButton to="/dashboard" />
      </div>

      <div className="max-w-4xl mx-auto bg-zinc-900 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center text-pink-500 flex items-center justify-center gap-2">
          <FiTrendingUp className="text-4xl" />
          Focus Stats
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          <div className="bg-zinc-800 p-6 rounded shadow text-center">
            <h3 className="text-lg font-semibold">Today’s Focus</h3>
            <p className="text-2xl font-mono text-white">{todayTotal} mins</p>
          </div>

          <div className="bg-zinc-800 p-6 rounded shadow text-center">
            <h3 className="text-lg font-semibold">Total Sessions</h3>
            <p className="text-2xl font-mono text-white">{totalSessions}</p>
          </div>

          <div className="bg-zinc-800 p-6 rounded shadow text-center">
            <h3 className="text-lg font-semibold">Total Focus Time</h3>
            <p className="text-2xl font-mono text-white">{totalMinutes} mins</p>
          </div>
        </div>

        <div className="bg-zinc-800 p-6 rounded shadow mt-8">
          <h3 className="text-xl font-semibold mb-4 text-center">Last 7 Days Focus</h3>
          {chartData.length === 0 ? (
            <p className="text-center text-gray-400">No data to display.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#333", border: "none" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="minutes" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}