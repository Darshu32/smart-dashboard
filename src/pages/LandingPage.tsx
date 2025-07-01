import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="text-gray-800 font-sans">
      {/* HERO SECTION */}
      <section
  className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: `url('https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29sb3IlMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D')`,
  }}
>
  <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-md max-w-2xl">
    <h1 className="text-5xl font-extrabold mb-4">Smart Productivity Dashboard</h1>
    <p className="text-lg text-gray-700 mb-6">
      A powerful productivity tool that combines the Pomodoro technique, smart planning, task categorization, and historical analytics—all in one dashboard.
    </p>
    <Link
      to="/pomodoro"
      className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
    >
      Launch Dashboard
    </Link>
  </div>
</section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-6 bg-orange-50">
        <h2 className="text-3xl font-bold text-center mb-12">What You Get</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="p-6 bg-white rounded-xl shadow text-center">
            <h3 className="text-xl font-bold mb-2">⏱ Pomodoro Technique</h3>
            <p>Work with intense focus using 25/5 Pomodoro cycles to maximize productivity.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow text-center">
            <h3 className="text-xl font-bold mb-2">📅 Task & Goal Planner</h3>
            <p>Plan your day and week with categorized task lists and priorities.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow text-center">
            <h3 className="text-xl font-bold mb-2">📊 Historical Stats</h3>
            <p>Track your completed Pomodoros, time spent, and focus trends over time.</p>
          </div>
        </div>
      </section>

      {/* DOWNLOAD SECTION */}
      <section className="py-20 px-6 text-center bg-orange-50">
        <h2 className="text-2xl font-bold mb-6">Download on Any Platform</h2>
        <p className="mb-6 text-gray-600">Coming soon to Web, Android, and Desktop platforms.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button className="bg-black text-white px-6 py-3 rounded-xl shadow hover:bg-gray-900">⬇ Web App</button>
          <button className="bg-green-500 text-white px-6 py-3 rounded-xl shadow hover:bg-green-600">⬇ Android</button>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-600">⬇ Desktop</button>
        </div>
      </section>

      {/* ACCESS SECTION */}
      <section className="py-20 px-6 bg-orange-50 text-center">
        <h2 className="text-2xl font-bold mb-4">Access from Anywhere</h2>
        <p className="max-w-2xl mx-auto text-gray-600">
          Whether you're at work, at home, or on the move, your productivity dashboard is always with you. Cloud syncing ensures your tasks and progress are always updated.
        </p>
      </section>

      {/* CTA SECTION */}
<section className="py-20 px-6 bg-orange-50 text-center">
  <h2 className="text-3xl font-bold mb-0">Start Your Productive Journey Today</h2>
</section>



      {/* FOOTER */}
<footer className="py-6 text-center text-white bg-blue-600">
  © 2025 Smart Productivity Dashboard. All rights reserved.
</footer>

    </div>
  );
}
