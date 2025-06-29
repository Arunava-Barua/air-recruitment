"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Shield, FileText, TrendingUp, Check, X, RotateCcw, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { EmployerHeader } from "@/components/employer-header"

// Mock data
const credentialRequests = [
  {
    id: 1,
    candidateName: "John Smith",
    walletAddress: "0x123...abc",
    credentialType: "Employment Verification",
    requestDate: "2024-01-15",
    status: "pending",
  },
  {
    id: 2,
    candidateName: "Emily Davis",
    walletAddress: "0x456...def",
    credentialType: "Role Certificate",
    requestDate: "2024-01-14",
    status: "pending",
  },
  {
    id: 3,
    candidateName: "Michael Chen",
    walletAddress: "0x789...ghi",
    credentialType: "Performance Review",
    requestDate: "2024-01-13",
    status: "approved",
  },
]

const analyticsData = {
  totalIssued: 1247,
  totalVerified: 1189,
  totalRevoked: 12,
  weeklyIssuance: [
    { day: "Mon", count: 23 },
    { day: "Tue", count: 31 },
    { day: "Wed", count: 28 },
    { day: "Thu", count: 35 },
    { day: "Fri", count: 42 },
    { day: "Sat", count: 18 },
    { day: "Sun", count: 15 },
  ],
}

export default function EmployerPage() {
  const [issuanceForm, setIssuanceForm] = useState({
    candidateWallet: "",
    credentialType: "",
    metadata: {
      role: "",
      startDate: "",
      endDate: "",
      department: "",
    },
    expirable: true,
    revokable: true,
  })
  const [isIssuing, setIsIssuing] = useState(false)
  const { toast } = useToast()

  const handleApproveRequest = (requestId: number) => {
    toast({
      title: "Request approved",
      description: "Credential will be issued via AIR Kit",
    })
  }

  const handleRejectRequest = (requestId: number) => {
    toast({
      title: "Request rejected",
      description: "Candidate has been notified",
      variant: "destructive",
    })
  }

  const handleIssueCredential = async () => {
    if (!issuanceForm.candidateWallet || !issuanceForm.credentialType) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsIssuing(true)

    // Simulate AIR Kit integration
    setTimeout(() => {
      setIsIssuing(false)
      toast({
        title: "Credential issued successfully!",
        description: "Verifiable credential has been issued via AIR Kit",
      })

      // Reset form
      setIssuanceForm({
        candidateWallet: "",
        credentialType: "",
        metadata: {
          role: "",
          startDate: "",
          endDate: "",
          department: "",
        },
        expirable: true,
        revokable: true,
      })
    }, 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployerHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests">Credential Requests</TabsTrigger>
            <TabsTrigger value="issue">Issue New Credential</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Credential Requests Tab */}
          <TabsContent value="requests">
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Incoming Credential Requests
                </CardTitle>
                <CardDescription>Review and approve credential requests from candidates</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate Name</TableHead>
                      <TableHead>Wallet Address</TableHead>
                      <TableHead>Credential Type</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {credentialRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.candidateName}</TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{request.walletAddress}</code>
                        </TableCell>
                        <TableCell>{request.credentialType}</TableCell>
                        <TableCell>{request.requestDate}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          {request.status === "pending" && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveRequest(request.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectRequest(request.id)}
                                className="border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Issue New Credential Tab */}
          <TabsContent value="issue">
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Issue New Credential via AIR Kit
                </CardTitle>
                <CardDescription>Create and issue verifiable credentials to candidates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="candidateWallet">Candidate Wallet/DID *</Label>
                      <Input
                        id="candidateWallet"
                        placeholder="0x... or did:web:..."
                        value={issuanceForm.candidateWallet}
                        onChange={(e) => setIssuanceForm({ ...issuanceForm, candidateWallet: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="credentialType">Credential Type *</Label>
                      <Select
                        value={issuanceForm.credentialType}
                        onValueChange={(value) => setIssuanceForm({ ...issuanceForm, credentialType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select credential type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employment">Employment Verification</SelectItem>
                          <SelectItem value="role">Role Certificate</SelectItem>
                          <SelectItem value="performance">Performance Review</SelectItem>
                          <SelectItem value="training">Training Completion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role/Position</Label>
                      <Input
                        id="role"
                        placeholder="e.g., Senior Software Engineer"
                        value={issuanceForm.metadata.role}
                        onChange={(e) =>
                          setIssuanceForm({
                            ...issuanceForm,
                            metadata: { ...issuanceForm.metadata, role: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        placeholder="e.g., Engineering"
                        value={issuanceForm.metadata.department}
                        onChange={(e) =>
                          setIssuanceForm({
                            ...issuanceForm,
                            metadata: { ...issuanceForm.metadata, department: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={issuanceForm.metadata.startDate}
                          onChange={(e) =>
                            setIssuanceForm({
                              ...issuanceForm,
                              metadata: { ...issuanceForm.metadata, startDate: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={issuanceForm.metadata.endDate}
                          onChange={(e) =>
                            setIssuanceForm({
                              ...issuanceForm,
                              metadata: { ...issuanceForm.metadata, endDate: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Expirable Credential</Label>
                          <p className="text-sm text-gray-500">Set an expiration date for this credential</p>
                        </div>
                        <Switch
                          checked={issuanceForm.expirable}
                          onCheckedChange={(checked) => setIssuanceForm({ ...issuanceForm, expirable: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Revokable Credential</Label>
                          <p className="text-sm text-gray-500">Allow this credential to be revoked if needed</p>
                        </div>
                        <Switch
                          checked={issuanceForm.revokable}
                          onCheckedChange={(checked) => setIssuanceForm({ ...issuanceForm, revokable: checked })}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleIssueCredential}
                      disabled={isIssuing}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      {isIssuing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Issuing via AIR Kit...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Issue via AIR Kit
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">VCs Issued</p>
                      <p className="text-3xl font-bold text-blue-600">{analyticsData.totalIssued}</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">VCs Verified</p>
                      <p className="text-3xl font-bold text-green-600">{analyticsData.totalVerified}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">VCs Revoked</p>
                      <p className="text-3xl font-bold text-red-600">{analyticsData.totalRevoked}</p>
                    </div>
                    <RotateCcw className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                  Weekly Issuance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.weeklyIssuance.map((day) => (
                    <div key={day.day} className="flex items-center space-x-4">
                      <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(day.count / 50) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-8 text-sm font-medium text-gray-900">{day.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
