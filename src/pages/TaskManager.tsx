import { useEffect, useState } from "react";
import { db } from "../firebase";
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

  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "tasks"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(updatedTasks);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddTask = async () => {
    if (!taskName.trim() || !user) return;

    await addDoc(collection(db, "tasks"), {
      uid: user.uid,
      name: taskName,
      category,
      priority,
      completed: false,
    });

    setTaskName("");
    setCategory("Work");
    setPriority("Medium");
  };

  const toggleComplete = async (id: string, currentStatus: boolean) => {
    await updateDoc(doc(db, "tasks", id), {
      completed: !currentStatus,
    });
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
  };

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
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{
        backgroundImage:
          "url('https://images.rawpixel.com/image_png_social_landscape/cHJpdmF0ZS90ZW1wbGF0ZXMvZmlsZXMvY3JlYXRlX3Rvb2wvMjAyMy0wNy8wMWdnbnhja3hyM3hnZjR5c3FtMngxdzJxYy1sa2IyenlmOC5wbmc.png')",
      }}
    >
      <div className="p-6 rounded-xl bg-white/80 backdrop-blur-md shadow-lg w-full max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          📝 Task Manager
        </h2>

        {/* Add Task Form */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Enter task..."
            className="border p-2 rounded-md flex-1"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded-md"
          >
            <option>Work</option>
            <option>Personal</option>
            <option>Study</option>
            <option>Other</option>
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border p-2 rounded-md"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <button
            onClick={handleAddTask}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
          >
            Add
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 justify-between">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border p-2 rounded-md"
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
            className="border p-2 rounded-md"
          >
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border p-2 rounded-md"
          >
            <option>All</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>
        </div>

        {/* Task List */}
        <ul className="space-y-4">
          {filteredTasks.length === 0 && (
            <p className="text-gray-500 text-center">
              No matching tasks found.
            </p>
          )}
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className={`flex justify-between items-center border p-4 rounded-md shadow-sm ${
                task.completed ? "bg-green-100" : "bg-white"
              }`}
            >
              <div>
                <p
                  className={`font-semibold ${
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.name}
                </p>
                <p className="text-sm text-gray-500">
                  📂 {task.category} | ⚡ {task.priority}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id, task.completed)}
                />
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-500 hover:text-red-700 font-semibold"
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
