// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

import {
  FaRegClock,        // Pomodoro Timer
  FaTasks,           // Task Manager
  FaChartBar,        // Productivity Stats
  FaCalendarAlt,     // Weekly Planner
  FaUserCircle,      // Profile (not used here but useful later)
             // AI Assistant
} from "react-icons/fa";
import { SiOpenai } from "react-icons/si";

type Task = {
  id: string;
  name: string;
  completed: boolean;
};

type WeeklyTask = {
  id: string;
  day: string;
  text: string;
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.displayName || "User";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "tasks"),
      where("uid", "==", user.uid),
      orderBy("name", "desc"),
      limit(3)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        completed: doc.data().completed,
      })) as Task[];
      setTasks(fetchedTasks);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleComplete = async (task: Task) => {
    await updateDoc(doc(db, "tasks", task.id), {
      completed: !task.completed,
    });
  };

  const handleStartPomodoro = () => {
    navigate("/pomodoro");
  };

  const handleAIAssistant = () => {
    navigate("/assistant");
  };

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "weeklyTasks"),
      where("uid", "==", user.uid),
      where("day", "==", selectedDay)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        day: doc.data().day,
        text: doc.data().text,
      })) as WeeklyTask[];
      setWeeklyTasks(data);
    });

    return () => unsubscribe();
  }, [user, selectedDay]);

  const addWeeklyTask = async () => {
    if (!input.trim() || !user) return;

    await addDoc(collection(db, "weeklyTasks"), {
      uid: user.uid,
      day: selectedDay,
      text: input.trim(),
    });

    setInput("");
  };

  const deleteWeeklyTask = async (id: string) => {
    await deleteDoc(doc(db, "weeklyTasks", id));
  };

  return (
    <div className="flex bg-[#0f0f11] min-h-screen text-white">
      <Sidebar />

      <main className="ml-0 md:ml-64 flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">
            Welcome back, <span className="text-pink-400">{displayName}</span>!
          </h1>
          <p className="text-sm text-gray-400">
            Let's boost your productivity today 
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Pomodoro Timer */}
          <div className="bg-zinc-900 rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FaRegClock /> Pomodoro Timer
            </h2>
            <p className="text-sm text-gray-400">
              Stay focused for 25 minutes, then take a break.
            </p>
            <button
              onClick={handleStartPomodoro}
            className="mt-4 bg-pink-500 hover:bg-pink-600 py-2 rounded-md text-sm"

            >
              Start Session
            </button>
          </div>

          {/* Task Manager */}
          <div className="bg-zinc-900 rounded-xl p-5 shadow-lg">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FaTasks /> Tasks
            </h2>
            {tasks.length === 0 ? (
              <p className="text-gray-400 text-sm">No tasks yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex justify-between items-center"
                  >
                    <span
                      className={`${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.name}
                    </span>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task)}
                      className="accent-blue-500"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Productivity Stats */}
          <div
            className="bg-zinc-900 rounded-xl p-5 shadow-lg cursor-pointer hover:bg-zinc-800 transition"
            onClick={() => navigate("/stats")}
          >
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FaChartBar /> Productivity Stats
            </h2>
            <div className="w-full h-2 bg-gray-700 rounded-full">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "0%" }}
              ></div>
            </div>
            <p className="text-xs text-right mt-1 text-gray-400">
              0% of your goal
            </p>
          </div>

          {/* Weekly Planner */}
          <div className="bg-zinc-900 rounded-xl p-5 shadow-lg col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FaCalendarAlt /> Weekly Planner
            </h2>

            <div className="flex space-x-2 mb-4 overflow-x-auto">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedDay === day
  ? "bg-pink-600 text-white"
  : "bg-zinc-800 text-gray-300"

                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder={`Add task for ${selectedDay}`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-zinc-800 text-sm px-3 py-2 rounded-md outline-none"
              />
              <button
                onClick={addWeeklyTask}
                className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-md text-sm"

              >
                Add
              </button>
            </div>

            {weeklyTasks.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No tasks for {selectedDay}.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {weeklyTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex justify-between items-center bg-zinc-800 p-2 rounded"
                  >
                    <span>{task.text}</span>
                    <button
                      onClick={() => deleteWeeklyTask(task.id)}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* AI Assistant */}
          <div className="bg-zinc-900 rounded-xl p-5 shadow-lg col-span-1 md:col-span-2 xl:col-span-3">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              < SiOpenai  /> AI Assistant
            </h2>
            <p className="text-sm text-gray-400 mb-3">
              Ask me to set reminders, help plan your day, or suggest
              improvements!
            </p>
            <button
              onClick={handleAIAssistant}
              className="mt-4 bg-pink-500 hover:bg-pink-600 py-2 px-1 rounded-md text-sm"

            >
              Chat with Assistant
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
