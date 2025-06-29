"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Filter,
  Shield,
  GraduationCap,
  Briefcase,
  Eye,
  QrCode,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  MapPin,
  Calendar,
} from "lucide-react"
import { RecruiterHeader } from "@/components/recruiter-header"

// Mock data
const candidates = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=60&width=60",
    location: "San Francisco, CA",
    tags: ["React", "TypeScript", "Node.js", "AWS"],
    hasVerifiedDegree: true,
    hasVerifiedExperience: true,
    credentials: [
      {
        type: "Education",
        title: "Master of Computer Science",
        issuer: "Stanford University",
        status: "verified",
        issueDate: "2022-06-15",
        expiry: "2027-06-15",
        metadata: {
          degree: "Master of Computer Science",
          gpa: "3.9",
          specialization: "Machine Learning",
        },
      },
      {
        type: "Employment",
        title: "Senior Software Engineer",
        issuer: "Google",
        status: "verified",
        issueDate: "2022-07-01",
        expiry: "2025-07-01",
        metadata: {
          role: "Senior Software Engineer",
          department: "Search Infrastructure",
          level: "L5",
        },
      },
    ],
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=60&width=60",
    location: "Seattle, WA",
    tags: ["Python", "Machine Learning", "TensorFlow", "Docker"],
    hasVerifiedDegree: true,
    hasVerifiedExperience: false,
    credentials: [
      {
        type: "Education",
        title: "PhD in Computer Science",
        issuer: "MIT",
        status: "verified",
        issueDate: "2021-05-20",
        expiry: "2026-05-20",
        metadata: {
          degree: "PhD in Computer Science",
          thesis: "Deep Learning for Natural Language Processing",
          advisor: "Dr. Jane Smith",
        },
      },
    ],
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    avatar: "/placeholder.svg?height=60&width=60",
    location: "Austin, TX",
    tags: ["Java", "Spring", "Microservices", "Kubernetes"],
    hasVerifiedDegree: false,
    hasVerifiedExperience: true,
    credentials: [
      {
        type: "Employment",
        title: "Software Engineer",
        issuer: "Meta",
        status: "verified",
        issueDate: "2020-08-15",
        expiry: "2025-08-15",
        metadata: {
          role: "Software Engineer",
          department: "Infrastructure",
          projects: ["Messenger Backend", "WhatsApp Scaling"],
        },
      },
    ],
  },
]

const skillsets = [
  "React",
  "TypeScript",
  "Python",
  "Java",
  "Node.js",
  "AWS",
  "Docker",
  "Kubernetes",
  "Machine Learning",
]
const roleTypes = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "DevOps Engineer",
]

export default function RecruiterPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [hasVerifiedDegree, setHasVerifiedDegree] = useState(false)
  const [hasVerifiedExperience, setHasVerifiedExperience] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<(typeof candidates)[0] | null>(null)
  const { toast } = useToast()

  const handleSkillChange = (skill: string, checked: boolean) => {
    if (checked) {
      setSelectedSkills([...selectedSkills, skill])
    } else {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill))
    }
  }

  const handleRoleChange = (role: string, checked: boolean) => {
    if (checked) {
      setSelectedRoles([...selectedRoles, role])
    } else {
      setSelectedRoles(selectedRoles.filter((r) => r !== role))
    }
  }

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesSkills = selectedSkills.length === 0 || selectedSkills.some((skill) => candidate.tags.includes(skill))

    const matchesDegree = !hasVerifiedDegree || candidate.hasVerifiedDegree
    const matchesExperience = !hasVerifiedExperience || candidate.hasVerifiedExperience

    return matchesSearch && matchesSkills && matchesDegree && matchesExperience
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "expired":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Shield className="w-3 h-3 mr-1" />
            Verified via AIR Kit
          </Badge>
        )
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Expired</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const handleVerifyCredential = (credentialId: string) => {
    toast({
      title: "Credential verified",
      description: "Verification completed via AIR Kit",
    })
  }

  const handleScanQR = () => {
    toast({
      title: "QR Scanner opened",
      description: "Scan candidate's credential QR code",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RecruiterHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Search Bar */}
        <Card className="mb-8 shadow-sm border-0">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search candidates by name, skills, or experience..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-lg h-12"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm border-0 sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-purple-600" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Skillsets */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Skillsets</Label>
                  <div className="space-y-2">
                    {skillsets.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={(checked) => handleSkillChange(skill, checked as boolean)}
                        />
                        <Label htmlFor={skill} className="text-sm text-gray-600">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Role Types */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Role Types</Label>
                  <div className="space-y-2">
                    {roleTypes.map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={role}
                          checked={selectedRoles.includes(role)}
                          onCheckedChange={(checked) => handleRoleChange(role, checked as boolean)}
                        />
                        <Label htmlFor={role} className="text-sm text-gray-600">
                          {role}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification Toggles */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Verification Status</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="verifiedDegree"
                        checked={hasVerifiedDegree}
                        onCheckedChange={setHasVerifiedDegree}
                      />
                      <Label htmlFor="verifiedDegree" className="text-sm text-gray-600 flex items-center">
                        <GraduationCap className="w-4 h-4 mr-1" />
                        Has Verified Degree ✅
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="verifiedExperience"
                        checked={hasVerifiedExperience}
                        onCheckedChange={setHasVerifiedExperience}
                      />
                      <Label htmlFor="verifiedExperience" className="text-sm text-gray-600 flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        Has Verified Experience ✅
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Candidate Cards */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCandidates.map((candidate) => (
                <Card key={candidate.id} className="shadow-sm border-0 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
                        <AvatarFallback>
                          {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{candidate.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {candidate.location}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {candidate.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex space-x-2">
                        {candidate.hasVerifiedDegree && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                            <GraduationCap className="w-3 h-3 mr-1" />
                            Verified Degree
                          </Badge>
                        )}
                        {candidate.hasVerifiedExperience && (
                          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                            <Briefcase className="w-3 h-3 mr-1" />
                            Verified Experience
                          </Badge>
                        )}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedCandidate(candidate)}>
                            <Eye className="w-4 h-4 mr-1" />
                            View Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <User className="w-5 h-5 mr-2" />
                              {candidate.name} - Credential Preview
                            </DialogTitle>
                            <DialogDescription>Verify candidate credentials using AIR Kit</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {candidate.credentials.map((credential, index) => (
                              <Card key={index} className="border border-gray-200">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-gray-900">{credential.title}</h4>
                                      <p className="text-gray-600">{credential.issuer}</p>
                                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                        <span className="flex items-center">
                                          <Calendar className="w-4 h-4 mr-1" />
                                          Issued: {credential.issueDate}
                                        </span>
                                        <span>Expires: {credential.expiry}</span>
                                      </div>
                                    </div>
                                    {getStatusIcon(credential.status)}
                                  </div>
                                  <div className="flex items-center justify-between mt-4">
                                    {getStatusBadge(credential.status)}
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleVerifyCredential(credential.title)}
                                      >
                                        <Shield className="w-4 h-4 mr-1" />
                                        Verify via AIR Kit
                                      </Button>
                                      <Button variant="outline" size="sm" onClick={handleScanQR}>
                                        <QrCode className="w-4 h-4 mr-1" />
                                        Scan QR
                                      </Button>
                                    </div>
                                  </div>
                                  {/* Credential Metadata */}
                                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <h5 className="text-sm font-medium text-gray-700 mb-2">Credential Metadata</h5>
                                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                                      {JSON.stringify(credential.metadata, null, 2)}
                                    </pre>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCandidates.length === 0 && (
              <Card className="shadow-sm border-0">
                <CardContent className="p-12 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or filters</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
