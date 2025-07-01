import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../firebase";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

type Task = {
  date: string;
  title: string;
};

export default function WeeklyPlanner() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "users", user.uid, "planner"),
      (snapshot) => {
        const allTasks: Task[] = [];
        snapshot.forEach((doc) => {
          const date = doc.id;
          const data = doc.data();
          if (Array.isArray(data.tasks)) {
            data.tasks.forEach((title: string) => {
              allTasks.push({ date, title });
            });
          }
        });
        setTasks(allTasks);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addTask = async () => {
    if (!selectedDate || task.trim() === "" || !user) return;
    const dateStr = selectedDate.toDateString();

    const taskRef = doc(db, "users", user.uid, "planner", dateStr);

    await setDoc(
      taskRef,
      {
        tasks: arrayUnion(task),
      },
      { merge: true }
    );

    setTask("");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/previews/007/184/268/non_2x/calendar-and-caspia-flower-on-table-wooden-day-celebration-free-photo.jpg')",
      }}
    >
      <div className="p-6 rounded-xl bg-white/80 backdrop-blur-md shadow-lg w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          📅 Weekly Planner
        </h2>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="px-4 py-2 border rounded-md shadow"
          />

          <input
            type="text"
            placeholder="Enter task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md shadow"
          />

          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add Task
          </button>
        </div>

        {/* Task List */}
        {tasks.length > 0 ? (
          <div className="space-y-4">
            {Array.from(new Set(tasks.map((t) => t.date))).map((date) => (
              <div
                key={date}
                className="bg-white p-4 rounded shadow backdrop-blur-md"
              >
                <h3 className="font-semibold text-lg text-blue-700">{date}</h3>
                <ul className="list-disc list-inside text-gray-700 mt-2">
                  {tasks
                    .filter((t) => t.date === date)
                    .map((t, idx) => (
                      <li key={idx}>{t.title}</li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 text-center">No tasks added yet.</p>
        )}
      </div>
    </div>
  );
}
