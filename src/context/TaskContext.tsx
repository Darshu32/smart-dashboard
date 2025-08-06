// src/context/TaskContext.tsx
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  addTask: async () => {},
  deleteTask: async () => {},
});

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const tasksRef = collection(db, "users", user.uid, "tasks");

    const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
      const fetchedTasks: Task[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Task, "id">),
      }));
      setTasks(fetchedTasks);
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async (title: string) => {
    if (!user) return;
    const taskRef = collection(db, "users", user.uid, "tasks");
    await addDoc(taskRef, { title, completed: false });
  };

  const deleteTask = async (id: string) => {
    if (!user) return;
    const taskDoc = doc(db, "users", user.uid, "tasks", id);
    await deleteDoc(taskDoc);
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
