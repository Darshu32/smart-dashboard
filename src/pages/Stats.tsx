import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs } from "firebase/firestore";

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
  const { user } = useAuth();
  const [logs, setLogs] = useState<PomodoroLog[]>([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchLogs = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "users", user.uid, "pomodoroLogs")
        );
        const fetchedLogs: PomodoroLog[] = [];

        snapshot.forEach((doc) => {
          fetchedLogs.push(doc.data() as PomodoroLog);
        });

        setLogs(fetchedLogs);

        const todayStr = new Date().toDateString();
        const todayLogs = fetchedLogs.filter(
          (log) => log.date === todayStr
        );

        const totalToday = todayLogs.reduce(
          (sum, log) => sum + log.duration,
          0
        );
        setTodayTotal(totalToday);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [user]);

  const totalSessions = logs.length;
  const totalMinutes = logs.reduce((sum, log) => sum + log.duration, 0);

  if (loading) {
    return (
      <div className="p-6 text-gray-100 bg-black/30 min-h-screen flex justify-center items-center">
        Loading stats...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{
        backgroundImage:
          "url('https://tse3.mm.bing.net/th/id/OIP.-JKsyNyx4iA8TiqgeyBNrAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3')",
      }}
    >
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          📊 Focus Stats
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-blue-100 p-6 rounded shadow text-center">
            <h3 className="text-lg font-semibold">Today’s Focus</h3>
            <p className="text-2xl font-mono text-blue-900">{todayTotal} mins</p>
          </div>

          <div className="bg-green-100 p-6 rounded shadow text-center">
            <h3 className="text-lg font-semibold">Total Sessions</h3>
            <p className="text-2xl font-mono text-green-900">{totalSessions}</p>
          </div>

          <div className="bg-yellow-100 p-6 rounded shadow text-center">
            <h3 className="text-lg font-semibold">Total Focus Time</h3>
            <p className="text-2xl font-mono text-yellow-900">
              {totalMinutes} mins
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
