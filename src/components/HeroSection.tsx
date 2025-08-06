import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const features = [
  "Pomodoro Timer",
  "AI Assistant",
  "Task Manager",
  "Smart Planner",
  "Stats & History",
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 2000); // change every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
        Your 24/7 AI Productivity Partner
      </h1>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-semibold text-center text-purple-400 h-[40px]"
      >
        {features[currentIndex]}
      </motion.div>

      <p className="mt-8 text-lg md:text-xl max-w-2xl text-center text-gray-300">
        A powerful productivity tool that combines the AI Assistant tool,
        Pomodoro technique, smart planning, task categorization, and historical
        analytics—all in one dashboard.
      </p>
    </section>
  );
}
