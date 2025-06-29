"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, Activity } from "lucide-react"

const regionalStats = [
  {
    region: "West Africa",
    totalCredentials: 8234,
    growth: "+18%",
    trend: "up",
    topDisease: "Malaria",
    activeHospitals: 156,
    avgResponseTime: "2.3h",
  },
  {
    region: "South Asia",
    totalCredentials: 12567,
    growth: "+12%",
    trend: "up",
    topDisease: "Diabetes",
    activeHospitals: 289,
    avgResponseTime: "1.8h",
  },
  {
    region: "Southeast Asia",
    totalCredentials: 9876,
    growth: "+25%",
    trend: "up",
    topDisease: "Dengue",
    activeHospitals: 198,
    avgResponseTime: "2.1h",
  },
  {
    region: "North America",
    totalCredentials: 15432,
    growth: "+3%",
    trend: "down",
    topDisease: "Depression",
    activeHospitals: 445,
    avgResponseTime: "1.2h",
  },
]

export function RegionalStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {regionalStats.map((stat) => (
        <Card key={stat.region} className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center justify-between">
              {stat.region}
              <div className="flex items-center space-x-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
                <span className={`text-sm ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                  {stat.growth}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Total Credentials</p>
                <p className="text-white font-semibold">{stat.totalCredentials.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Active Hospitals</p>
                <p className="text-white font-semibold flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {stat.activeHospitals}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs">Top Disease</p>
                <Badge variant="secondary" className="text-xs">
                  {stat.topDisease}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">Avg Response</p>
                <p className="text-white text-sm flex items-center">
                  <Activity className="h-3 w-3 mr-1" />
                  {stat.avgResponseTime}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
