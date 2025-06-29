"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

const regions = [
  { name: "Lagos", x: 45, y: 60, count: 1250, diseases: ["Malaria", "Hypertension", "Diabetes"] },
  { name: "Abuja", x: 48, y: 55, count: 890, diseases: ["Respiratory", "Cardiovascular", "Infectious"] },
  { name: "Kano", x: 50, y: 45, count: 650, diseases: ["Infectious", "Metabolic", "Respiratory"] },
  { name: "Port Harcourt", x: 47, y: 70, count: 420, diseases: ["Malaria", "Respiratory", "Gastrointestinal"] },
  { name: "Ibadan", x: 44, y: 62, count: 780, diseases: ["Hypertension", "Diabetes", "Cardiovascular"] },
]

export function GlobalMap() {
  const [hoveredRegion, setHoveredRegion] = useState<(typeof regions)[0] | null>(null)

  return (
    <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
      {/* Simplified Africa Map Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-80 h-80 border-2 border-white/30 rounded-full relative">
          <div className="absolute top-8 left-12 w-32 h-40 border border-white/20 rounded-tl-3xl rounded-tr-lg rounded-bl-2xl rounded-br-3xl"></div>
          <div className="absolute top-20 left-20 w-24 h-32 border border-white/20 rounded-lg"></div>
          <div className="absolute bottom-12 left-16 w-28 h-24 border border-white/20 rounded-b-3xl"></div>
        </div>
      </div>

      {/* Data Points */}
      {regions.map((region) => (
        <div
          key={region.name}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{ left: `${region.x}%`, top: `${region.y}%` }}
          onMouseEnter={() => setHoveredRegion(region)}
          onMouseLeave={() => setHoveredRegion(null)}
        >
          <div className="relative">
            <div
              className="w-4 h-4 bg-white rounded-full animate-pulse"
              style={{
                boxShadow: `0 0 ${Math.min(region.count / 50, 20)}px rgba(255, 255, 255, 0.8)`,
              }}
            ></div>
            <div
              className="absolute inset-0 bg-white/20 rounded-full animate-ping"
              style={{
                width: `${Math.min(region.count / 100, 24)}px`,
                height: `${Math.min(region.count / 100, 24)}px`,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            ></div>
          </div>
        </div>
      ))}

      {/* Hover Tooltip */}
      {hoveredRegion && (
        <Card
          className="absolute z-10 bg-gray-800 border-gray-600 text-white p-0 max-w-xs"
          style={{
            left: `${hoveredRegion.x}%`,
            top: `${hoveredRegion.y - 10}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <CardContent className="p-3">
            <h3 className="font-semibold text-blue-400 mb-2">{hoveredRegion.name}</h3>
            <p className="text-sm text-gray-300 mb-2">{hoveredRegion.count} verified prescriptions</p>
            <div>
              <p className="text-xs text-gray-400 mb-1">Top 3 diagnoses:</p>
              <div className="space-y-1">
                {hoveredRegion.diseases.slice(0, 3).map((disease, index) => (
                  <div key={disease} className="text-xs text-white">
                    {index + 1}. {disease}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
