import { useEffect, useMemo, useState } from "react";
import { FiTrendingUp } from "react-icons/fi";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PomodoroLog {
  startedAt: {
    seconds: number;
  };
  endedAt: {
    seconds: number;
  };
  duration: number;
  date: string;
}

export default function Stats() {
  const [logs, setLogs] = useState<PomodoroLog[]>([]);

  useEffect(() => {
    const cached = localStorage.getItem("pomodoroLogs");
    if (cached) {
      setLogs(JSON.parse(cached));
    }
  }, []);

  const todayStr = new Date().toDateString();

  const { todayTotal, totalSessions, totalMinutes } = useMemo(() => {
    const todayLogs = logs.filter((log) => log.date === todayStr);
    const todayTotal = todayLogs.reduce((sum, log) => sum + log.duration, 0);
    const totalMinutes = logs.reduce((sum, log) => sum + log.duration, 0);
    return {
      todayTotal,
      totalSessions: logs.length,
      totalMinutes,
    };
  }, [logs]);

  // 👇 Chart Data: Aggregate by date (last 7 days only)
  const chartData = useMemo(() => {
    const dayMap: Record<string, number> = {};

    logs.forEach((log) => {
      if (dayMap[log.date]) {
        dayMap[log.date] += log.duration;
      } else {
        dayMap[log.date] = log.duration;
      }
    });

    // Convert to array & sort by date (limit to last 7)
    const data = Object.entries(dayMap)
      .map(([date, total]) => ({ date, minutes: total }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 days

    return data;
  }, [logs]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
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
            <p className="text-2xl font-mono text-white">
              {totalMinutes} mins
            </p>
          </div>
        </div>

        {/* 📈 Bar Chart for Last 7 Days */}
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
