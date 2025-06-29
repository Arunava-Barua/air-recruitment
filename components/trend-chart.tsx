"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

// Enhanced dummy data with more realistic trends
const trendData = [
  {
    month: "Jan",
    respiratory: 1240,
    cardiovascular: 890,
    infectious: 2100,
    metabolic: 756,
    neurological: 432,
    gastrointestinal: 678,
  },
  {
    month: "Feb",
    respiratory: 1580,
    cardiovascular: 945,
    infectious: 1890,
    metabolic: 823,
    neurological: 467,
    gastrointestinal: 712,
  },
  {
    month: "Mar",
    respiratory: 1820,
    cardiovascular: 1120,
    infectious: 2240,
    metabolic: 891,
    neurological: 523,
    gastrointestinal: 789,
  },
  {
    month: "Apr",
    respiratory: 2280,
    cardiovascular: 1250,
    infectious: 1950,
    metabolic: 967,
    neurological: 578,
    gastrointestinal: 834,
  },
  {
    month: "May",
    respiratory: 2890,
    cardiovascular: 1420,
    infectious: 2580,
    metabolic: 1045,
    neurological: 634,
    gastrointestinal: 923,
  },
  {
    month: "Jun",
    respiratory: 3650,
    cardiovascular: 1680,
    infectious: 2890,
    metabolic: 1156,
    neurological: 712,
    gastrointestinal: 1067,
  },
  {
    month: "Jul",
    respiratory: 4120,
    cardiovascular: 1834,
    infectious: 3240,
    metabolic: 1289,
    neurological: 789,
    gastrointestinal: 1234,
  },
  {
    month: "Aug",
    respiratory: 3890,
    cardiovascular: 1923,
    infectious: 2980,
    metabolic: 1367,
    neurological: 845,
    gastrointestinal: 1156,
  },
]

export function TrendChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F9FAFB",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="respiratory"
            stroke="#EF4444"
            strokeWidth={2}
            name="Respiratory"
            dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="cardiovascular"
            stroke="#3B82F6"
            strokeWidth={2}
            name="Cardiovascular"
            dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="infectious"
            stroke="#10B981"
            strokeWidth={2}
            name="Infectious"
            dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="metabolic"
            stroke="#F59E0B"
            strokeWidth={2}
            name="Metabolic"
            dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="neurological"
            stroke="#8B5CF6"
            strokeWidth={2}
            name="Neurological"
            dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="gastrointestinal"
            stroke="#EC4899"
            strokeWidth={2}
            name="Gastrointestinal"
            dot={{ fill: "#EC4899", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
