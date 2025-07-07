// BarChartBox.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", value: 120 },
  { name: "Feb", value: 190 },
  { name: "Mar", value: 300 },
  { name: "Apr", value: 250 },
  { name: "May", value: 220 },
  { name: "Jun", value: 180 },
  { name: "Jul", value: 110 },
  { name: "Aug", value: 280 },
];

export default function BarChartBox() {
  return (
    <div style={{ width: "90%", height: "90%"}}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#4caf50" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      
    </div>
  );
}
