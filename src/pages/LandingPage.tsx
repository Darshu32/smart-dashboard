import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lightbulb, Timer, ClipboardList, CalendarCheck } from "lucide-react";

const quickFeatures = [
  "Pomodoro Timer",
  "AI Assistant",
  "Task Manager",
  "Analytics",
  "Smart Planner",
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white font-sans scroll-smooth overflow-hidden">
      
      {/* 3D Animated Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-black via-gray-900 to-black animate-pulse opacity-30" />
        <div className="absolute top-1/4 left-1/3 w-[60vw] h-[60vw] rounded-full bg-gradient-radial from-gray-700 via-gray-900 to-black blur-3xl opacity-40 animate-[spin_60s_linear_infinite]" />
        <div className="absolute bottom-10 right-10 w-[40vw] h-[40vw] rounded-full bg-gradient-radial from-white/10 to-transparent blur-2xl opacity-20" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg shadow"
      >
        <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">Smart AI Dashboard</span>
            <span className="text-xs text-gray-400">your dashboard as your co-pilot</span>
          </div>

          <div className="space-x-6 hidden md:flex items-center text-sm">
            <a href="#features" className="hover:text-pink-400 transition">Features</a>
            <a href="#download" className="hover:text-pink-400 transition">Download</a>
            <Link to="/login" className="text-white hover:text-pink-400">Login</Link>
            <Link
              to="/register"
              className="bg-pink-600 hover:bg-pink-700 transition text-white px-4 py-2 rounded-lg shadow"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </motion.header>

      {/* Hero */}
      <section className="flex flex-col justify-center items-center text-center px-4 min-h-screen relative bg-gradient-to-br from-black via-gray-900 to-black">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight"
        >
          Your 24/7 <span className="text-pink-500">AI Productivity Dashboard</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-2xl text-gray-300 text-lg mb-8"
        >
          A powerful productivity tool that combines the AI Assistant, Pomodoro timer, smart planning, task
          categorization, and analytics — all in one place.
        </motion.p>

        {/* Staggered Feature Bubbles */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.25,
              },
            },
          }}
          className="grid sm:grid-cols-2 gap-4 text-lg text-white"
        >
          {quickFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/5 px-6 py-4 rounded-xl backdrop-blur border border-white/10 shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.3, duration: 0.5 }}
            >
              {feature}
            </motion.div>
          ))}
        </motion.div>

        
      </section>

      {/* New Features Section */}
      <section id="features" className="bg-gray-900 text-white py-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 text-pink-500">
            Why Smart AI Dashboard?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 text-left">
            {[
              {
                title: "AI Assistant",
                icon: <Lightbulb className="h-8 w-8 text-yellow-400" />,
                description:
                  "Receive smart suggestions, task summaries, and even personalized productivity tips in real-time.",
              },
              {
                title: "Pomodoro Timer",
                icon: <Timer className="h-8 w-8 text-red-400" />,
                description:
                  "Boost focus and avoid burnout with built-in focus intervals and intelligent break reminders.",
              },
              {
                title: "Task Manager",
                icon: <ClipboardList className="h-8 w-8 text-green-400" />,
                description:
                  "Easily organize, categorize, and prioritize your tasks with a clean drag-and-drop interface.",
              },
              {
                title: "Smart Planner",
                icon: <CalendarCheck className="h-8 w-8 text-blue-400" />,
                description:
                  "Let AI build your optimal day or week plan based on urgency, energy, and goals.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-800 p-6 rounded-2xl shadow-md"
              >
                <div className="flex items-center gap-4 mb-3">
                  {feature.icon}
                  <h3 className="text-2xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
{/* Dashboard + AI Assistant Showcase Section */}
<section className="bg-black text-white py-20 px-6 md:px-20 border-t border-white/10">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-4xl font-bold text-center mb-16 text-pink-500">
      Explore the Interface
    </h2>

    {/* Dashboard Section */}
    <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
      {/* Image */}
      <div className="w-full md:w-1/2 group">
        <div className="overflow-hidden rounded-xl border border-white/10 shadow-lg transform transition duration-500 group-hover:scale-105 group-hover:shadow-2xl">
          <img
            src="/images/dashboard-screenshot.png"
            alt="Dashboard"
            className="rounded-xl transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </div>
      </div>

      {/* Description */}
      <div className="w-full md:w-1/2 space-y-4">
        <h3 className="text-2xl font-semibold">Your AI-Powered Dashboard</h3>
        <p className="text-gray-400">
          A clean, distraction-free layout that tracks your productivity, tasks,
          and Pomodoro sessions — all synced with your smart planner.
        </p>
      </div>
    </div>

    {/* AI Assistant Section */}
    <div className="flex flex-col md:flex-row-reverse items-center gap-12">
      {/* Image */}
      <div className="w-full md:w-1/2 group">
        <div className="overflow-hidden rounded-xl border border-white/10 shadow-lg transform transition duration-500 group-hover:scale-105 group-hover:shadow-2xl">
          <img
            src="/images/assistant-screenshot.png"
            alt="AI Assistant"
            className="rounded-xl transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </div>
      </div>

      {/* Description */}
      <div className="w-full md:w-1/2 space-y-4">
        <h3 className="text-2xl font-semibold">Real-Time AI Assistant</h3>
        <p className="text-gray-400">
          Ask your assistant to summarize your day, recommend tasks, or even give
          motivational tips — it's like having a productivity coach in your pocket.
        </p>
      </div>
    </div>
  </div>
</section>


      {/* Download Section */}
      <section id="download" className="py-24 bg-black text-center">
        <motion.h2
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Download Coming Soon
        </motion.h2>
        <p className="text-gray-400 mb-8">Available soon on Web, Android, and Desktop platforms.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-white text-black px-5 py-2 rounded-md hover:bg-gray-200 transition">
            ⬇ Web App
          </button>
          <button className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600 transition">
            ⬇ Android
          </button>
          <button className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition">
            ⬇ Desktop
          </button>
        </div>
      </section>

      {/* Feedback & Community Section */}
<section className="bg-black text-white py-16 px-6 text-center space-y-12 border-t border-white/10">
  <div>
    <h2 className="text-3xl font-bold mb-4">Share Your Feedback</h2>
    <p className="text-gray-400 text-lg max-w-xl mx-auto">
      Help us improve Focus Flow by sharing your thoughts and suggestions.
    </p>
    <button className="mt-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg shadow">
      Send Feedback
    </button>
  </div>

  <div>
    <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
    <p className="text-gray-400 text-lg max-w-xl mx-auto">
      Connect with other Focus Flow users, share wins, and get motivation.
    </p>
    <a
      href="https://discord.gg/your-server-link"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.369A19.791 19.791 0 0016.725 3c-.211.367-.452.85-.616 1.223a18.286 18.286 0 00-4.218 0c-.17-.375-.412-.856-.624-1.223A19.739 19.739 0 003.682 4.369C.533 9.018-.319 13.495.099 17.926a19.9 19.9 0 006.166 3.171c.508-.7.958-1.444 1.357-2.222a12.282 12.282 0 01-1.957-.938c.166-.12.327-.247.483-.378a12.026 12.026 0 0011.746 0c.155.131.316.258.483.378a12.33 12.33 0 01-1.97.94c.397.772.846 1.513 1.354 2.212a19.913 19.913 0 006.167-3.17c.47-4.931-.82-9.343-3.683-13.558z" />
      </svg>
      Join Discord
    </a>
  </div>
</section>


      {/* Pre-Footer Quick Links Section */}
<section className="bg-gray-900 text-white py-12 px-4 md:px-16">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
    <div>
      <h2 className="text-2xl font-semibold mb-4">Smart AI Dashboard</h2>
      <p className="text-gray-300">
        Your 24/7 AI accountability partner for achieving your dreams.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold mb-4">Legal</h3>
      <ul className="text-gray-400 space-y-2">
        <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
        <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
        <li><a href="#" className="hover:text-white transition">Google API Data Use Disclosure</a></li>
      </ul>
    </div>

    <div>
      <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
      <ul className="text-gray-400 space-y-2">
        <li><a href="#features" className="hover:text-white transition">Features</a></li>
        <li><a href="#download" className="hover:text-white transition">Download</a></li>
        <li><a href="#support" className="hover:text-white transition">Support</a></li>
        <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
      </ul>
    </div>
  </div>
</section>


      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm border-t border-white/10 bg-black">
        © 2025 Smart AI Dashboard. All rights reserved.
      </footer>
    </div>
  );
}
