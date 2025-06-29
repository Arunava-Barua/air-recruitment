"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileText, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const sampleData = [
  { patientId: "P-001", region: "Lagos", diagnosis: "Malaria", medicine: "Chloroquine", date: "2024-01-15" },
  { patientId: "P-002", region: "Abuja", diagnosis: "Hypertension", medicine: "Lisinopril", date: "2024-01-15" },
  { patientId: "P-003", region: "Kano", diagnosis: "Diabetes", medicine: "Metformin", date: "2024-01-16" },
]

export default function BulkUploadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState(sampleData)
  const [isDragOver, setIsDragOver] = useState(false)
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setUploadedFile(files[0])
      toast({
        title: "File uploaded successfully",
        description: `${files[0].name} has been uploaded and is ready for processing.`,
      })
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setUploadedFile(files[0])
      toast({
        title: "File uploaded successfully",
        description: `${files[0].name} has been uploaded and is ready for processing.`,
      })
    }
  }

  const handleMapFields = () => {
    toast({
      title: "Fields mapped successfully",
      description: "Data has been processed and is ready for credential issuance.",
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Bulk Data</h1>
        <p className="text-gray-600">Upload CSV files containing daily health records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload CSV of daily records</h3>
            <p className="text-gray-600 mb-4">Drag and drop your CSV file here, or click to browse</p>
            <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" id="file-upload" />
            <Button asChild variant="outline">
              <label htmlFor="file-upload" className="cursor-pointer">
                Choose File
              </label>
            </Button>
          </div>

          {uploadedFile && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-green-900">{uploadedFile.name}</p>
                <p className="text-sm text-green-700">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Data Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.patientId}</TableCell>
                    <TableCell>{row.region}</TableCell>
                    <TableCell>{row.diagnosis}</TableCell>
                    <TableCell>{row.medicine}</TableCell>
                    <TableCell>{row.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleMapFields} size="lg">
              Map Fields and Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
