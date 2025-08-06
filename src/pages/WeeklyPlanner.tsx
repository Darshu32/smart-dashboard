import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar } from "react-icons/fi";

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
    <div className="min-h-screen bg-neutral-950 p-6 text-white">
      <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl w-full max-w-2xl mx-auto border border-white/20">
        <h2 className="text-3xl font-semibold mb-6 text-center text-pink-500 flex items-center justify-center gap-2">
          <FiCalendar className="text-4xl" />
            Weekly Planner
          </h2>



        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="px-4 py-2 rounded-md bg-neutral-800 text-white border border-white/20 shadow"
          />

          <input
            type="text"
            placeholder="Enter task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="flex-1 px-4 py-2 rounded-md bg-neutral-800 text-white border border-white/20 shadow"
          />

          <button
            onClick={addTask}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md transition shadow"
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
                className="bg-white/5 border border-white/10 rounded-lg p-4 shadow"
              >
                <h3 className="text-lg font-bold text-blue-400">{date}</h3>
                <ul className="list-disc list-inside text-gray-300 mt-2">
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
          <p className="text-gray-400 text-center">No tasks added yet.</p>
        )}
      </div>
    </div>
  );
}
