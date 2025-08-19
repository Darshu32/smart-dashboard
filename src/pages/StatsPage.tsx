// src/pages/StatsPage.tsx

import React from "react";
import WeeklyChart from "../components/WeeklyChart";
import Stats from "./Stats"; // your existing summary stats

const StatsPage = () => {
  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">📊 Productivity Stats</h1>
      
      <div className="mb-8">
        <Stats /> {/* Your current stats summary (today, total sessions, etc.) */}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">📅 Weekly Focus Chart</h2>
        <WeeklyChart /> {/* New chart for weekly focus */}
      </div>
    </div>
  );
};

export default StatsPage;
