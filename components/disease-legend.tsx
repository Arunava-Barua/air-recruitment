"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const diseaseCategories = [
  {
    category: "Infectious Diseases",
    diseases: [
      { name: "Malaria", color: "#EF4444" },
      { name: "Dengue", color: "#DC2626" },
      { name: "Tuberculosis", color: "#B91C1C" },
      { name: "HIV/AIDS", color: "#991B1B" },
    ],
  },
  {
    category: "Cardiovascular",
    diseases: [
      { name: "Cardiovascular", color: "#3B82F6" },
      { name: "Hypertension", color: "#2563EB" },
      { name: "Stroke", color: "#1D4ED8" },
    ],
  },
  {
    category: "Metabolic",
    diseases: [
      { name: "Diabetes", color: "#10B981" },
      { name: "Obesity", color: "#059669" },
    ],
  },
  {
    category: "Mental Health",
    diseases: [{ name: "Depression", color: "#8B5CF6" }],
  },
  {
    category: "Other",
    diseases: [
      { name: "Respiratory", color: "#F59E0B" },
      { name: "Skin Cancer", color: "#EC4899" },
      { name: "Arthritis", color: "#14B8A6" },
    ],
  },
]

export function DiseaseLegend() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white text-sm">Disease Color Legend</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {diseaseCategories.map((category) => (
          <div key={category.category}>
            <h4 className="text-xs font-medium text-gray-400 mb-2">{category.category}</h4>
            <div className="space-y-1">
              {category.diseases.map((disease) => (
                <div key={disease.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: disease.color }} />
                  <span className="text-xs text-gray-300">{disease.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
