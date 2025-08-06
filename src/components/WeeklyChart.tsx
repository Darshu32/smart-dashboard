import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Sample Data - Replace this with data from Firebase later
const data = [
  { day: "Mon", focus: 50 },
  { day: "Tue", focus: 80 },
  { day: "Wed", focus: 100 },
  { day: "Thu", focus: 70 },
  { day: "Fri", focus: 40 },
  { day: "Sat", focus: 90 },
  { day: "Sun", focus: 65 },
];

const WeeklyChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="day" />
        <YAxis label={{ value: "Mins", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Bar dataKey="focus" fill="#4F46E5" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WeeklyChart;
