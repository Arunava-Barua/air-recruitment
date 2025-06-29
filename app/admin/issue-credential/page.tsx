"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const regions = ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt", "Benin City", "Maiduguri", "Zaria", "Aba", "Jos"]

const diagnoses = [
  "Malaria",
  "Hypertension",
  "Diabetes",
  "Asthma",
  "Pneumonia",
  "Tuberculosis",
  "Typhoid",
  "HIV/AIDS",
  "Hepatitis",
  "Anemia",
  "Arthritis",
  "Depression",
]

const treatmentTypes = ["Consultation", "Surgery", "Medication", "Therapy", "Emergency Care", "Preventive Care"]

const medicines = [
  "Paracetamol",
  "Amoxicillin",
  "Chloroquine",
  "Metformin",
  "Lisinopril",
  "Salbutamol",
  "Ciprofloxacin",
  "Omeprazole",
  "Aspirin",
  "Ibuprofen",
]

export default function IssueCredentialPage() {
  const [date, setDate] = useState<Date>()
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>([])
  const [medicine, setMedicine] = useState("")
  const [filteredMedicines, setFilteredMedicines] = useState<string[]>([])
  const { toast } = useToast()

  const handleDiagnosisChange = (diagnosis: string, checked: boolean) => {
    if (checked) {
      setSelectedDiagnoses([...selectedDiagnoses, diagnosis])
    } else {
      setSelectedDiagnoses(selectedDiagnoses.filter((d) => d !== diagnosis))
    }
  }

  const handleMedicineChange = (value: string) => {
    setMedicine(value)
    if (value) {
      const filtered = medicines.filter((med) => med.toLowerCase().includes(value.toLowerCase()))
      setFilteredMedicines(filtered)
    } else {
      setFilteredMedicines([])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Credential issued successfully!",
      description: "Credential issued via AIR Kit",
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Issue New Health Credential</h1>
        <p className="text-gray-600">Create a verified, anonymized health credential</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input id="patientId" placeholder="Enter patient ID" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region.toLowerCase()}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date of Visit</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatmentType">Treatment Type</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select treatment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {treatmentTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Diagnosis (Select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg">
                {diagnoses.map((diagnosis) => (
                  <div key={diagnosis} className="flex items-center space-x-2">
                    <Checkbox
                      id={diagnosis}
                      checked={selectedDiagnoses.includes(diagnosis)}
                      onCheckedChange={(checked) => handleDiagnosisChange(diagnosis, checked as boolean)}
                    />
                    <Label htmlFor={diagnosis} className="text-sm">
                      {diagnosis}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicine">Prescribed Medicine</Label>
              <div className="relative">
                <Input
                  id="medicine"
                  value={medicine}
                  onChange={(e) => handleMedicineChange(e.target.value)}
                  placeholder="Start typing medicine name..."
                />
                {filteredMedicines.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {filteredMedicines.map((med) => (
                      <button
                        key={med}
                        type="button"
                        className="w-full px-3 py-2 text-left hover:bg-gray-100"
                        onClick={() => {
                          setMedicine(med)
                          setFilteredMedicines([])
                        }}
                      >
                        {med}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Optional Notes</Label>
              <Textarea id="notes" placeholder="Additional notes or observations..." rows={4} />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Issue Credential
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
