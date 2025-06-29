"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Globe, TrendingUp, AlertTriangle, Download, CalendarIcon, Lock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { ExplorerHeader } from "@/components/explorer-header"
import { TrendChart } from "@/components/trend-chart"
import { MedicineChart } from "@/components/medicine-chart"
import { InteractiveGlobe } from "@/components/interactive-globe"
import { RegionalStats } from "@/components/regional-stats"
import { DiseaseLegend } from "@/components/disease-legend"

const diseaseCategories = [
  "Respiratory",
  "Cardiovascular",
  "Infectious",
  "Metabolic",
  "Neurological",
  "Gastrointestinal",
  "Malaria",
  "Diabetes",
  "Hypertension",
  "Depression",
]

const regions = [
  "West Africa",
  "East Africa",
  "North Africa",
  "Central Africa",
  "Southern Africa",
  "South Asia",
  "East Asia",
  "Southeast Asia",
  "Western Europe",
  "Central Europe",
  "Southern Europe",
  "North America",
  "South America",
  "Oceania",
]

export default function ExplorerPage() {
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([])
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})

  const handleDiseaseChange = (disease: string, checked: boolean) => {
    if (checked) {
      setSelectedDiseases([...selectedDiseases, disease])
    } else {
      setSelectedDiseases(selectedDiseases.filter((d) => d !== disease))
    }
  }

  const handleExportCSV = () => {
    // Mock CSV export
    const csvContent =
      "Date,Region,Disease,Prescriptions\n2024-01-01,Lagos,Malaria,150\n2024-01-01,Abuja,Hypertension,89"
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "health-data-export.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ExplorerHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Disease Categories */}
                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-3 block">Disease Categories</Label>
                  <div className="space-y-3">
                    {diseaseCategories.map((disease) => (
                      <div key={disease} className="flex items-center space-x-2">
                        <Checkbox
                          id={disease}
                          checked={selectedDiseases.includes(disease)}
                          onCheckedChange={(checked) => handleDiseaseChange(disease, checked as boolean)}
                        />
                        <Label htmlFor={disease} className="text-sm text-gray-300">
                          {disease}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Region Filter */}
                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-3 block">Region</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="all">All Regions</SelectItem>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region.toLowerCase()}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-3 block">Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal bg-gray-700 border-gray-600 text-white",
                            !dateRange.from && "text-gray-400",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? format(dateRange.from, "MMM dd") : "From"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-gray-700 border-gray-600">
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal bg-gray-700 border-gray-600 text-white",
                            !dateRange.to && "text-gray-400",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.to ? format(dateRange.to, "MMM dd") : "To"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-gray-700 border-gray-600">
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <Button onClick={handleExportCSV} variant="outline" className="w-full bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>

                {/* Upgrade CTA */}
                <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
                  <CardContent className="p-4 text-center">
                    <Lock className="mx-auto h-8 w-8 mb-2" />
                    <p className="text-sm font-medium mb-2">Want more data?</p>
                    <p className="text-xs text-blue-100 mb-3">Upgrade to unlock real-time insights</p>
                    <Button size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
                      Upgrade Now
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Disease Legend */}
            <DiseaseLegend />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Global Map */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Global Health Data Distribution
                  <Badge className="ml-2 bg-blue-600 text-white text-xs">Color-coded by Disease</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InteractiveGlobe selectedDiseases={selectedDiseases} selectedRegion={selectedRegion} />
              </CardContent>
            </Card>

            {/* Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trend Chart */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Disease Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TrendChart />
                </CardContent>
              </Card>

              {/* Medicine Chart */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Top Prescribed Medicines</CardTitle>
                </CardHeader>
                <CardContent>
                  <MedicineChart />
                </CardContent>
              </Card>
            </div>

            {/* Regional Statistics */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Regional Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <RegionalStats />
              </CardContent>
            </Card>

            {/* Alert Box */}
            <div className="space-y-4">
              <Card className="bg-red-900/20 border-red-500/50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-red-400">Critical Health Alert</h3>
                      <p className="text-sm text-red-300 mt-1">
                        🚨 Dengue fever outbreak detected in Southeast Asia - Red spots indicate high transmission areas
                      </p>
                      <p className="text-xs text-red-400 mt-1">
                        Affected regions: Jakarta (+340%), Bangkok (+280%), Manila (+195%)
                      </p>
                      <div className="mt-2">
                        <Badge className="bg-red-500/20 text-red-300 border-red-500/50">Critical</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-900/20 border-green-500/50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-400">Positive Trend</h3>
                      <p className="text-sm text-green-300 mt-1">
                        📈 Diabetes management improving globally - Green spots show effective treatment programs
                      </p>
                      <p className="text-xs text-green-400 mt-1">
                        Leading regions: Mumbai, Mexico City, Cairo showing 25% improvement in outcomes
                      </p>
                      <div className="mt-2">
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/50">Improving</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
