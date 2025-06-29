"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Filter } from "lucide-react"

const records = [
  {
    id: "CR-2024-001",
    date: "2024-01-15",
    diagnosis: "Malaria",
    region: "Lagos",
    status: "Verified",
    patientId: "P-001",
  },
  {
    id: "CR-2024-002",
    date: "2024-01-15",
    diagnosis: "Hypertension",
    region: "Abuja",
    status: "Pending",
    patientId: "P-002",
  },
  {
    id: "CR-2024-003",
    date: "2024-01-16",
    diagnosis: "Diabetes",
    region: "Kano",
    status: "Verified",
    patientId: "P-003",
  },
  {
    id: "CR-2024-004",
    date: "2024-01-16",
    diagnosis: "Asthma",
    region: "Lagos",
    status: "Verified",
    patientId: "P-004",
  },
  {
    id: "CR-2024-005",
    date: "2024-01-17",
    diagnosis: "Pneumonia",
    region: "Port Harcourt",
    status: "Failed",
    patientId: "P-005",
  },
]

export default function RecordsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status.toLowerCase() === statusFilter
    const matchesRegion = regionFilter === "all" || record.region.toLowerCase() === regionFilter

    return matchesSearch && matchesStatus && matchesRegion
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "Failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleDownloadCSV = () => {
    const csvContent = [
      ["ID", "Date", "Diagnosis", "Region", "Status", "Patient ID"],
      ...filteredRecords.map((record) => [
        record.id,
        record.date,
        record.diagnosis,
        record.region,
        record.status,
        record.patientId,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "health-records.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Records History</h1>
        <p className="text-gray-600">View and manage issued health credentials</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Health Credentials</span>
            <Button onClick={handleDownloadCSV} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by diagnosis, ID, or patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="lagos">Lagos</SelectItem>
                <SelectItem value="abuja">Abuja</SelectItem>
                <SelectItem value="kano">Kano</SelectItem>
                <SelectItem value="port harcourt">Port Harcourt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Credential ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Patient ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.id}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.diagnosis}</TableCell>
                    <TableCell>{record.region}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>{record.patientId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-gray-500">No records found matching your criteria.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
