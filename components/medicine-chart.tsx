"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

// Enhanced medicine data with more realistic numbers
const medicineData = [
  { medicine: "Paracetamol", prescriptions: 4580, category: "Analgesic" },
  { medicine: "Metformin", prescriptions: 3920, category: "Antidiabetic" },
  { medicine: "Amoxicillin", prescriptions: 3240, category: "Antibiotic" },
  { medicine: "Lisinopril", prescriptions: 2890, category: "ACE Inhibitor" },
  { medicine: "Chloroquine", prescriptions: 2650, category: "Antimalarial" },
  { medicine: "Atorvastatin", prescriptions: 2340, category: "Statin" },
  { medicine: "Salbutamol", prescriptions: 2120, category: "Bronchodilator" },
  { medicine: "Omeprazole", prescriptions: 1890, category: "PPI" },
  { medicine: "Aspirin", prescriptions: 1670, category: "Antiplatelet" },
  { medicine: "Sertraline", prescriptions: 1450, category: "Antidepressant" },
]

const colors = [
  "#8B5CF6",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#6366F1",
  "#14B8A6",
  "#F97316",
  "#84CC16",
]

export function MedicineChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={medicineData} layout="horizontal" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis type="number" stroke="#9CA3AF" />
          <YAxis dataKey="medicine" type="category" stroke="#9CA3AF" width={75} fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F9FAFB",
            }}
            formatter={(value, name, props) => [`${value} prescriptions`, `${props.payload.category}`]}
          />
          <Bar dataKey="prescriptions" radius={[0, 4, 4, 0]}>
            {medicineData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
