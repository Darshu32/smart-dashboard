import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // global styles
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <TaskProvider>
        <App />
      </TaskProvider>
      
    </AuthProvider>
  </React.StrictMode>
);
