// src/context/TaskContext.tsx
import {
  collection,
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
  loadingTasks: boolean;
  addTask: (title: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  loadingTasks: true,
  addTask: async () => {},
  deleteTask: async () => {},
});

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Wait until auth is finished and user exists
    if (authLoading || !user?.uid) {
      setTasks([]);
      setLoadingTasks(false);
      return;
    }

    const tasksRef = collection(db, "users", user.uid, "tasks");

    const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
      const fetchedTasks: Task[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Task, "id">),
      }));
      setTasks(fetchedTasks);
      setLoadingTasks(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  const addTask = async (title: string) => {
    if (!user?.uid) throw new Error("User not authenticated");
    const taskRef = collection(db, "users", user.uid, "tasks");
    await addDoc(taskRef, { title, completed: false });
  };

  const deleteTask = async (id: string) => {
    if (!user?.uid) throw new Error("User not authenticated");
    const taskDoc = doc(db, "users", user.uid, "tasks", id);
    await deleteDoc(taskDoc);
  };

  return (
    <TaskContext.Provider
      value={{ tasks, loadingTasks, addTask, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
