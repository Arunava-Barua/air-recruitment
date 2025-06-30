"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  FileText,
  TrendingUp,
  RotateCcw,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { EmployerHeader } from "@/components/employer-header";

// Mock data
const outgoingRequests = [
  {
    id: 1,
    employeeName: "John Smith",
    employeeWallet: "0x123...abc",
    credentialType: "Employment Verification",
    requestDate: "2024-01-15",
    status: "pending",
    role: "Senior Software Engineer",
    department: "Engineering",
  },
  {
    id: 2,
    employeeName: "Emily Davis",
    employeeWallet: "0x456...def",
    credentialType: "Role Certificate",
    requestDate: "2024-01-14",
    status: "accepted",
    role: "Product Manager",
    department: "Product",
  },
  {
    id: 3,
    employeeName: "Michael Chen",
    employeeWallet: "0x789...ghi",
    credentialType: "Performance Review",
    requestDate: "2024-01-13",
    status: "rejected",
    role: "Data Scientist",
    department: "Analytics",
  },
];

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
};

export default function EmployerPage() {
  const [issuanceForm, setIssuanceForm] = useState({
    candidateWallet: "",
    credentialType: "",
    metadata: {
      role: "",
      startDate: "",
      endDate: "",
      department: "",
      employeeName: "",
      salary: "",
      achievements: "",
      includePerformance: false,
      performanceRating: "",
    },
    expirable: true,
    revokable: true,
  });
  const [isIssuing, setIsIssuing] = useState(false);
  const { toast } = useToast();

  // AIR Issuance Configuration
  const [airConfig] = useState({
    issuerDid: "did:key:YOUR_ISSUER_DID_HERE", // Replace with your issuer DID
    apiKey: "YOUR_ISSUER_API_KEY_HERE", // Replace with your issuer API key
    credentialId: "c21hc0g0joevn0015479aK", // Replace with your credential ID
    partnerId: "67264f2e-99a9-4ee0-b23b-6a0f96bb573a",
  });

  const handleIssueCredential = async () => {
    if (
      !issuanceForm.candidateWallet ||
      !issuanceForm.credentialType ||
      !issuanceForm.metadata.employeeName
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsIssuing(true);

    try {
      // Create credential request payload
      const credentialRequest = {
        id: Date.now(),
        employeeName: issuanceForm.metadata.employeeName,
        employeeWallet: issuanceForm.candidateWallet,
        credentialType: issuanceForm.credentialType,
        requestDate: new Date().toISOString().split("T")[0],
        status: "pending",
        details: {
          role: issuanceForm.metadata.role,
          department: issuanceForm.metadata.department,
          startDate: issuanceForm.metadata.startDate,
          endDate: issuanceForm.metadata.endDate || "Present",
          salary: issuanceForm.metadata.salary,
          achievements: issuanceForm.metadata.achievements,
          performanceRating: issuanceForm.metadata.includePerformance
            ? issuanceForm.metadata.performanceRating
            : null,
        },
        // AIR Configuration for issuance
        airConfig: {
          issuerDid: airConfig.issuerDid,
          apiKey: airConfig.apiKey,
          credentialId: airConfig.credentialId,
          partnerId: airConfig.partnerId,
        },
        // Credential subject that will be issued
        credentialSubject: {
          employeeName: issuanceForm.metadata.employeeName,
          role: issuanceForm.metadata.role,
          department: issuanceForm.metadata.department,
          startDate: issuanceForm.metadata.startDate,
          endDate: issuanceForm.metadata.endDate,
          employerName: "TechCorp Inc.", // Replace with your company name
          ...(issuanceForm.metadata.salary && {
            salaryRange: issuanceForm.metadata.salary,
          }),
          ...(issuanceForm.metadata.achievements && {
            achievements: issuanceForm.metadata.achievements,
          }),
          ...(issuanceForm.metadata.includePerformance &&
            issuanceForm.metadata.performanceRating && {
              performanceRating: issuanceForm.metadata.performanceRating,
            }),
        },
      };

      // In a real implementation, this would be sent to your backend
      // which would then notify the candidate through various channels (email, wallet notification, etc.)
      console.log("Sending credential request:", credentialRequest);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, we'll store it in localStorage
      // In production, this would be handled by your backend
      const existingRequests = JSON.parse(
        localStorage.getItem("credentialRequests") || "[]"
      );
      existingRequests.push(credentialRequest);
      localStorage.setItem(
        "credentialRequests",
        JSON.stringify(existingRequests)
      );

      setIsIssuing(false);
      toast({
        title: "Credential request sent successfully!",
        description: `Request sent to ${issuanceForm.metadata.employeeName} for review and acceptance`,
      });

      // Reset form
      setIssuanceForm({
        candidateWallet: "",
        credentialType: "",
        metadata: {
          role: "",
          startDate: "",
          endDate: "",
          department: "",
          employeeName: "",
          salary: "",
          achievements: "",
          includePerformance: false,
          performanceRating: "",
        },
        expirable: true,
        revokable: true,
      });
    } catch (error) {
      setIsIssuing(false);
      toast({
        title: "Error sending request",
        description: "Failed to send credential request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Awaiting Employee Response
          </Badge>
        );
      case "accepted":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Accepted & Issued
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Rejected by Employee
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployerHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs defaultValue="outgoing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="outgoing">Outgoing Requests</TabsTrigger>
            <TabsTrigger value="issue">Send New Request</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Credential Requests Tab */}
          <TabsContent value="outgoing">
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Outgoing Credential Requests
                </CardTitle>
                <CardDescription>
                  Track the status of credential requests sent to employees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee Name</TableHead>
                      <TableHead>Wallet Address</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Credential Type</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outgoingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {request.employeeName}
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {request.employeeWallet}
                          </code>
                        </TableCell>
                        <TableCell>{request.role}</TableCell>
                        <TableCell>{request.credentialType}</TableCell>
                        <TableCell>{request.requestDate}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Send Credential Request Tab */}
          <TabsContent value="issue">
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Send Credential Request to Employee
                </CardTitle>
                <CardDescription>
                  Send a credential request to an employee for them to accept
                  and issue via AIR Kit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="employeeWallet">
                        Employee Wallet/Email *
                      </Label>
                      <Input
                        id="employeeWallet"
                        placeholder="0x... or employee@company.com"
                        value={issuanceForm.candidateWallet}
                        onChange={(e) =>
                          setIssuanceForm({
                            ...issuanceForm,
                            candidateWallet: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="credentialType">Credential Type *</Label>
                      <Select
                        value={issuanceForm.credentialType}
                        onValueChange={(value) =>
                          setIssuanceForm({
                            ...issuanceForm,
                            credentialType: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select credential type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Employment Verification">
                            Employment Verification
                          </SelectItem>
                          <SelectItem value="Role Certificate">
                            Role Certificate
                          </SelectItem>
                          <SelectItem value="Performance Review">
                            Performance Review
                          </SelectItem>
                          <SelectItem value="Training Completion">
                            Training Completion
                          </SelectItem>
                          <SelectItem value="Promotion Certificate">
                            Promotion Certificate
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employeeName">Employee Name *</Label>
                      <Input
                        id="employeeName"
                        placeholder="e.g., John Smith"
                        value={issuanceForm.metadata.employeeName || ""}
                        onChange={(e) =>
                          setIssuanceForm({
                            ...issuanceForm,
                            metadata: {
                              ...issuanceForm.metadata,
                              employeeName: e.target.value,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role/Position *</Label>
                      <Input
                        id="role"
                        placeholder="e.g., Senior Software Engineer"
                        value={issuanceForm.metadata.role}
                        onChange={(e) =>
                          setIssuanceForm({
                            ...issuanceForm,
                            metadata: {
                              ...issuanceForm.metadata,
                              role: e.target.value,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Input
                        id="department"
                        placeholder="e.g., Engineering"
                        value={issuanceForm.metadata.department}
                        onChange={(e) =>
                          setIssuanceForm({
                            ...issuanceForm,
                            metadata: {
                              ...issuanceForm.metadata,
                              department: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={issuanceForm.metadata.startDate}
                          onChange={(e) =>
                            setIssuanceForm({
                              ...issuanceForm,
                              metadata: {
                                ...issuanceForm.metadata,
                                startDate: e.target.value,
                              },
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
                              metadata: {
                                ...issuanceForm.metadata,
                                endDate: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary Range (Optional)</Label>
                      <Input
                        id="salary"
                        placeholder="e.g., $80,000 - $120,000"
                        value={issuanceForm.metadata.salary || ""}
                        onChange={(e) =>
                          setIssuanceForm({
                            ...issuanceForm,
                            metadata: {
                              ...issuanceForm.metadata,
                              salary: e.target.value,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="achievements">
                        Key Achievements (Optional)
                      </Label>
                      <textarea
                        id="achievements"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={3}
                        placeholder="e.g., Led team of 5 engineers, Increased system performance by 40%"
                        value={issuanceForm.metadata.achievements || ""}
                        onChange={(e) =>
                          setIssuanceForm({
                            ...issuanceForm,
                            metadata: {
                              ...issuanceForm.metadata,
                              achievements: e.target.value,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">
                            Include Performance Rating
                          </Label>
                          <p className="text-sm text-gray-500">
                            Add performance evaluation to credential
                          </p>
                        </div>
                        <Switch
                          checked={
                            issuanceForm.metadata.includePerformance || false
                          }
                          onCheckedChange={(checked) =>
                            setIssuanceForm({
                              ...issuanceForm,
                              metadata: {
                                ...issuanceForm.metadata,
                                includePerformance: checked,
                              },
                            })
                          }
                        />
                      </div>

                      {issuanceForm.metadata.includePerformance && (
                        <div className="space-y-2">
                          <Label htmlFor="performanceRating">
                            Performance Rating
                          </Label>
                          <Select
                            value={
                              issuanceForm.metadata.performanceRating || ""
                            }
                            onValueChange={(value) =>
                              setIssuanceForm({
                                ...issuanceForm,
                                metadata: {
                                  ...issuanceForm.metadata,
                                  performanceRating: value,
                                },
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select rating" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="outstanding">
                                Outstanding (5/5)
                              </SelectItem>
                              <SelectItem value="exceeds">
                                Exceeds Expectations (4/5)
                              </SelectItem>
                              <SelectItem value="meets">
                                Meets Expectations (3/5)
                              </SelectItem>
                              <SelectItem value="below">
                                Below Expectations (2/5)
                              </SelectItem>
                              <SelectItem value="unsatisfactory">
                                Unsatisfactory (1/5)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleIssueCredential}
                      disabled={
                        isIssuing ||
                        !issuanceForm.candidateWallet ||
                        !issuanceForm.credentialType
                      }
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      {isIssuing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending Request...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Send Credential Request
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    How it works with AIR Kit:
                  </h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>
                      1. Fill in the employee details and credential information
                    </li>
                    <li>2. Send the request to the employee's wallet/email</li>
                    <li>
                      3. Employee reviews and accepts/rejects the credential
                      request
                    </li>
                    <li>
                      4. Once accepted, AIR Kit issuance widget launches
                      automatically
                    </li>
                    <li>
                      5. Credential is issued directly to their wallet via AIR
                      Kit
                    </li>
                    <li>
                      6. Future employers can verify the credential through AIR
                      Kit
                    </li>
                  </ol>
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
                      <p className="text-sm font-medium text-gray-600">
                        VCs Issued
                      </p>
                      <p className="text-3xl font-bold text-blue-600">
                        {analyticsData.totalIssued}
                      </p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        VCs Verified
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        {analyticsData.totalVerified}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        VCs Revoked
                      </p>
                      <p className="text-3xl font-bold text-red-600">
                        {analyticsData.totalRevoked}
                      </p>
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
                      <div className="w-12 text-sm font-medium text-gray-600">
                        {day.day}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(day.count / 50) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-8 text-sm font-medium text-gray-900">
                        {day.count}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
