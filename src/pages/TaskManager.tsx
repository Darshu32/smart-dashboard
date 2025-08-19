// src/pages/TaskManager.tsx

import { useEffect, useState } from "react";
import { db } from "../firebase";
import { FiClipboard } from "react-icons/fi";
import BackButton from "@/components/BackButton";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

type Task = {
  id: string;
  name: string;
  category: string;
  priority: string;
  completed: boolean;
};

export default function TaskManager() {
  const { user } = useAuth();
  const [taskName, setTaskName] = useState("");
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState("Medium");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Load tasks from localStorage on mount to show something quickly
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Firestore realtime sync
  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const q = query(collection(db, "tasks"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const updatedTasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];

        setTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        setLoading(false);
      },
      (error) => {
        console.error("Firestore onSnapshot error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Add new task to Firestore
  const handleAddTask = async () => {
    if (!taskName.trim() || !user) return;

    try {
      await addDoc(collection(db, "tasks"), {
        uid: user.uid,
        name: taskName,
        category,
        priority,
        completed: false,
      });
      setTaskName(""); // reset input immediately after add
      setCategory("Work");
      setPriority("Medium");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Toggle completed status in Firestore
  const toggleComplete = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "tasks", id), {
        completed: !currentStatus,
      });
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  // Delete task in Firestore
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Filter tasks based on UI filters
  const filteredTasks = tasks.filter((task) => {
    return (
      (filterCategory === "All" || task.category === filterCategory) &&
      (filterPriority === "All" || task.priority === filterPriority) &&
      (filterStatus === "All" ||
        (filterStatus === "Completed" && task.completed) ||
        (filterStatus === "Pending" && !task.completed))
    );
  });
 


  return (
  <div className="min-h-screen bg-[#0f0f11] text-white px-6 py-10 relative">
    {/* Back Button - absolute top left, not affecting layout */}
    <div className="absolute top-6 left-6">
      <BackButton to="/dashboard" />
    </div>

    {/* Task Manager Container */}
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-5xl mx-auto shadow-2xl">
      <h2 className="text-3xl font-bold mb-8 text-center text-pink-500 flex items-center justify-center gap-2">
        <FiClipboard className="text-4xl" />
        Task Manager
      </h2>

      {/* Add Task Form */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Enter a new task..."
          className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg flex-1 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-white"
        >
          <option>Work</option>
          <option>Personal</option>
          <option>Study</option>
          <option>Other</option>
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-white"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button
          onClick={handleAddTask}
          className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-lg transition shadow-md"
        >
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 justify-between">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-white"
        >
          <option>All</option>
          <option>Work</option>
          <option>Personal</option>
          <option>Study</option>
          <option>Other</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-white"
        >
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-white"
        >
          <option>All</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>
      </div>

      {/* Task List */}
      <ul className="space-y-4">
        {filteredTasks.length === 0 && (
          <p className="text-gray-400 text-center">No tasks found.</p>
        )}
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className={`flex justify-between items-center px-4 py-3 rounded-xl border ${
              task.completed
                ? "bg-green-400/10 border-green-400/30 text-green-300"
                : "bg-white/10 border-white/20"
            }`}
          >
            <div>
              <p
                className={`font-semibold ${
                  task.completed ? "line-through opacity-70" : ""
                }`}
              >
                {task.name}
              </p>
              <p className="text-sm text-gray-300">
                📁 {task.category} | ⚡ {task.priority}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id, task.completed)}
                className="w-5 h-5 accent-pink-500"
              />
              <button
                onClick={() => handleDelete(task.id)}
                className="text-red-500 hover:text-red-700 font-semibold text-lg"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
}