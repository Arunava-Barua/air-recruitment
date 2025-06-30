"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
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
} from "lucide-react";
import { RecruiterHeader } from "@/components/recruiter-header";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// AIR Credential SDK imports
import {
  AirCredentialWidget,
  type QueryRequest,
  type VerificationResults,
  type Language,
} from "@mocanetwork/air-credential-sdk";
import "@mocanetwork/air-credential-sdk/dist/style.css";
import { type AirService, BUILD_ENV } from "@mocanetwork/airkit";
import type { BUILD_ENV_TYPE } from "@mocanetwork/airkit";
import {
  getEnvironmentConfig,
  type EnvironmentConfig,
} from "../../config/environments";

// Environment configuration
const environmentConfig: EnvironmentConfig = getEnvironmentConfig("SANDBOX");
const LOCALE = "en";

// AIR Verification Configuration
const AIR_CONFIG = {
  apiKey: "RTAaMFKMto9zF094yPTeXEgmm2KQvlHQoCxjcgm0",
  verifierDid:
    "did:key:Xwp8EVHZ3UQgtZ7LZp6FbAe1sRAKNCbM16692sqAjqQx6b31GJkXcMGoveRNQLXekw28xmCBUA9b7GtcNcV7cxkf6Vv",
  programId: "c21hi031dmpll0012916hZ",
  partnerId: "67264f2e-99a9-4ee0-b23b-6a0f96bb573a",
  // redirectUrlForIssuer: "http://localhost:3000/issue",
};

// Function to get verifier auth token
const getVerifierAuthToken = async (
  verifierDid: string,
  apiKey: string,
  apiUrl: string
): Promise<string | null> => {
  try {
    const response = await fetch(`${apiUrl}/verifier/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
        "X-Test": "true",
      },
      body: JSON.stringify({
        verifierDid: verifierDid,
        authToken: apiKey,
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.code === 80000000 && data.data && data.data.token) {
      return data.data.token;
    } else {
      console.error(
        "Failed to get verifier auth token from API:",
        data.msg || "Unknown error"
      );
      return null;
    }
  } catch (error) {
    console.error("Error fetching verifier auth token:", error);
    return null;
  }
};

// Mock data
const candidates = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
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
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
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
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
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
];

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
];
const roleTypes = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "DevOps Engineer",
];

export default function RecruiterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [hasVerifiedDegree, setHasVerifiedDegree] = useState(false);
  const [hasVerifiedExperience, setHasVerifiedExperience] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<
    (typeof candidates)[0] | null
  >(null);
  const { toast } = useToast();

  // Job listing state
  const [jobListings, setJobListings] = useState([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    description: "",
    experience: "",
    salary: "",
    cryptoExperience: false,
    verifierId: "",
  });

  // AIR Verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResults | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const widgetRef = useRef<AirCredentialWidget | null>(null);
  const [airService, setAirService] = useState<AirService | null>(null);

  // Initialize AIR Service
  useEffect(() => {
    const initAirService = async () => {
      try {
        // You'll need to initialize your AIR service here
        // This is a placeholder - replace with actual AIR service initialization
        const service = null; // Initialize your AIR service
        setAirService(service);
      } catch (error) {
        console.error("Failed to initialize AIR service:", error);
      }
    };

    initAirService();
  }, []);

  // Cleanup widget on unmount
  useEffect(() => {
    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
      }
    };
  }, []);

  // Verifier mapping
  const verifierMapping = {
    "1+": {
      salary: "< $20,000",
      verifier: "CredifyVerifier_1=c21hi031dmpll0012916hZ",
    },
    "2+": {
      salary: "< $30,000",
      verifier: "CredifyVerifier_2=c21hi031do5xf0002916Fm",
    },
    "3+": {
      salary: "< $40,000",
      verifier: "CredifyVerifier_3=c21hi031dpn9l0012916FD",
    },
  };

  // AIR Credential Verification Implementation
  const handleAIRVerifyCredential = async (): Promise<boolean> => {
    setIsVerifying(true);
    setVerificationError(null);
    setVerificationResult(null);

    try {
      // Step 1: Fetch the verifier auth token
      const fetchedVerifierAuthToken = await getVerifierAuthToken(
        AIR_CONFIG.verifierDid,
        AIR_CONFIG.apiKey,
        environmentConfig.apiUrl
      );

      if (!fetchedVerifierAuthToken) {
        setVerificationError(
          "Failed to fetch verifier authentication token. Please check your API Key."
        );
        setIsVerifying(false);
        return false;
      }

      // Step 2: Create the query request
      const queryRequest: QueryRequest = {
        process: "Verify",
        verifierAuth: fetchedVerifierAuthToken,
        programId: AIR_CONFIG.programId,
      };

      // Step 3: Get URL with token (if airService is available)
      let urlWithToken = environmentConfig.widgetUrl;
      if (airService) {
        try {
          const rp = await airService.goToPartner(environmentConfig.widgetUrl);
          if (rp?.urlWithToken) {
            urlWithToken = rp.urlWithToken;
          }
        } catch (err) {
          console.warn("Failed to get URL with token, using default:", err);
        }
      }

      // Step 4: Create and configure the widget
      widgetRef.current = new AirCredentialWidget(
        queryRequest,
        AIR_CONFIG.partnerId,
        {
          endpoint: urlWithToken,
          airKitBuildEnv: BUILD_ENV.SANDBOX,
          theme: "light",
          locale: LOCALE as Language,
          redirectUrlForIssuer: AIR_CONFIG.redirectUrlForIssuer,
        }
      );

      // Step 5: Set up event listeners
      return new Promise((resolve) => {
        if (!widgetRef.current) {
          resolve(false);
          return;
        }

        widgetRef.current.on(
          "verifyCompleted",
          (results: VerificationResults) => {
            console.log("Verification completed:", results);
            setVerificationResult(results);
            setIsVerifying(false);

            if (results.status === "Compliant") {
              toast({
                title: "Verification Successful!",
                description:
                  "Candidate meets job requirements. Application submitted.",
              });
              resolve(true);
            } else {
              toast({
                title: "Verification Failed",
                description:
                  "Candidate doesn't meet the verification requirements for this position.",
                variant: "destructive",
              });
              resolve(false);
            }
          }
        );

        widgetRef.current.on("close", () => {
          console.log("Widget closed");
          setIsVerifying(false);
          resolve(false);
        });

        widgetRef.current.on("error", (error: any) => {
          console.error("Widget error:", error);
          setVerificationError("Verification widget encountered an error");
          setIsVerifying(false);
          toast({
            title: "Verification Error",
            description:
              "An error occurred during verification. Please try again.",
            variant: "destructive",
          });
          resolve(false);
        });

        // Step 6: Launch the widget
        try {
          widgetRef.current.launch();
        } catch (error) {
          console.error("Failed to launch widget:", error);
          setVerificationError("Failed to launch verification widget");
          setIsVerifying(false);
          resolve(false);
        }
      });
    } catch (err) {
      console.error("Verification error:", err);
      setVerificationError(
        err instanceof Error
          ? err.message
          : "An error occurred during verification"
      );
      setIsVerifying(false);
      toast({
        title: "Verification Error",
        description: "Failed to start verification process. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Job creation handler
  const handleCreateJob = () => {
    if (!jobForm.title || !jobForm.company || !jobForm.experience) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const mapping = verifierMapping[jobForm.experience];
    const newJob = {
      id: Date.now(),
      ...jobForm,
      salary: mapping.salary,
      verifierId: mapping.verifier,
      createdAt: new Date().toISOString(),
      applications: [],
    };

    setJobListings([...jobListings, newJob]);
    setJobForm({
      title: "",
      company: "",
      description: "",
      experience: "",
      salary: "",
      cryptoExperience: false,
      verifierId: "",
    });
    setShowJobForm(false);

    toast({
      title: "Job listing created!",
      description: `Job posted with ${
        mapping.verifier.split("=")[0]
      } verification`,
    });
  };

  // Apply to job handler with AIR verification
  const handleApplyToJob = async (jobId: number, verifierId: string) => {
    console.log("Applying to job:", jobId);

    // Reset previous verification state
    setVerificationResult(null);
    setVerificationError(null);

    // Start AIR verification process
    const success = await handleAIRVerifyCredential();

    if (success) {
      // Update job applications
      setJobListings((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? { ...job, applications: [...job.applications, "current-user"] }
            : job
        )
      );
    }
  };

  const handleSkillChange = (skill: string, checked: boolean) => {
    if (checked) {
      setSelectedSkills([...selectedSkills, skill]);
    } else {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    }
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    if (checked) {
      setSelectedRoles([...selectedRoles, role]);
    } else {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    }
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) => candidate.tags.includes(skill));

    const matchesDegree = !hasVerifiedDegree || candidate.hasVerifiedDegree;
    const matchesExperience =
      !hasVerifiedExperience || candidate.hasVerifiedExperience;

    return matchesSearch && matchesSkills && matchesDegree && matchesExperience;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "expired":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Shield className="w-3 h-3 mr-1" />
            Verified via AIR Kit
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Expired
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleVerifyCredential = (credentialId: string) => {
    toast({
      title: "Credential verified",
      description: "Verification completed via AIR Kit",
    });
  };

  const handleScanQR = () => {
    toast({
      title: "QR Scanner opened",
      description: "Scan candidate's credential QR code",
    });
  };

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

        {/* Verification Status Display */}
        {(isVerifying || verificationResult || verificationError) && (
          <Card className="mb-8 shadow-sm border-0">
            <CardContent className="p-6">
              {isVerifying && (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
                  <span className="text-purple-600 font-medium">
                    Verifying credentials via AIR Kit...
                  </span>
                </div>
              )}

              {verificationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">Verification Error</p>
                  <p className="text-red-600 text-sm">{verificationError}</p>
                </div>
              )}

              {verificationResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    Verification Status: {verificationResult.status}
                  </p>
                  <details className="mt-2">
                    <summary className="text-sm text-green-700 cursor-pointer">
                      View Details
                    </summary>
                    <pre className="text-xs text-green-600 mt-2 whitespace-pre-wrap">
                      {JSON.stringify(verificationResult, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Find Verified Talent
          </h2>
          <Button
            onClick={() => setShowJobForm(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Job Listing
          </Button>
        </div>

        {/* Job Creation Modal */}
        {showJobForm && (
          <Card className="mb-8 shadow-sm border-0 bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
                Create New Job Listing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g., Senior Frontend Developer"
                    value={jobForm.title}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    placeholder="e.g., TechCorp Inc."
                    value={jobForm.company}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, company: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and requirements..."
                  value={jobForm.description}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level *</Label>
                  <Select
                    value={jobForm.experience}
                    onValueChange={(value) =>
                      setJobForm({ ...jobForm, experience: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1+">
                        1+ Years (Salary: &lt; $20,000)
                      </SelectItem>
                      <SelectItem value="2+">
                        2+ Years (Salary: &lt; $30,000)
                      </SelectItem>
                      <SelectItem value="3+">
                        3+ Years (Salary: &lt; $40,000)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="cryptoExp"
                    checked={jobForm.cryptoExperience}
                    onCheckedChange={(checked) =>
                      setJobForm({ ...jobForm, cryptoExperience: checked })
                    }
                  />
                  <Label htmlFor="cryptoExp" className="text-sm">
                    Requires Prior Crypto Experience
                  </Label>
                </div>
              </div>

              {jobForm.experience && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Verification:</strong>{" "}
                    {
                      verifierMapping[jobForm.experience]?.verifier.split(
                        "="
                      )[0]
                    }
                  </p>
                  <p className="text-sm text-blue-600">
                    Salary Range: {verifierMapping[jobForm.experience]?.salary}
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  onClick={handleCreateJob}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Create Job Listing
                </Button>
                <Button variant="outline" onClick={() => setShowJobForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Job Listings Display */}
        {jobListings.length > 0 && (
          <Card className="mb-8 shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                Available Job Listings ({jobListings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobListings.map((job) => (
                  <Card
                    key={job.id}
                    className="border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-xl text-gray-900">
                            {job.title}
                          </h3>
                          <p className="text-lg text-gray-700 font-medium">
                            {job.company}
                          </p>
                          {job.description && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                              {job.description}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {job.experience} Years Experience
                          </Badge>
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            {job.salary}
                          </Badge>
                          {job.cryptoExperience && (
                            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                              Crypto Experience Required
                            </Badge>
                          )}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600">
                            <strong>Verification System:</strong>{" "}
                            {job.verifierId.split("=")[0]}
                          </p>
                          <p className="text-xs text-gray-500">
                            Applications will be verified using AIR Kit
                            credentials
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="text-sm text-gray-500">
                            {job.applications.length} application
                            {job.applications.length !== 1 ? "s" : ""}
                          </div>
                          <Button
                            onClick={() =>
                              handleApplyToJob(job.id, job.verifierId)
                            }
                            disabled={isVerifying}
                            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                          >
                            {isVerifying ? (
                              <span className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Verifying...
                              </span>
                            ) : (
                              "Apply Now"
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Skillsets
                  </Label>
                  <div className="space-y-2">
                    {skillsets.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={(checked) =>
                            handleSkillChange(skill, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={skill}
                          className="text-sm text-gray-600"
                        >
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Role Types */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Role Types
                  </Label>
                  <div className="space-y-2">
                    {roleTypes.map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={role}
                          checked={selectedRoles.includes(role)}
                          onCheckedChange={(checked) =>
                            handleRoleChange(role, checked as boolean)
                          }
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
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Verification Status
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="verifiedDegree"
                        checked={hasVerifiedDegree}
                        onCheckedChange={setHasVerifiedDegree}
                      />
                      <Label
                        htmlFor="verifiedDegree"
                        className="text-sm text-gray-600 flex items-center"
                      >
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
                      <Label
                        htmlFor="verifiedExperience"
                        className="text-sm text-gray-600 flex items-center"
                      >
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
                <Card
                  key={candidate.id}
                  className="shadow-sm border-0 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage
                          src={candidate.avatar || "/placeholder.svg"}
                          alt={candidate.name}
                        />
                        <AvatarFallback>
                          {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {candidate.name}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {candidate.location}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {candidate.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCandidate(candidate)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <User className="w-5 h-5 mr-2" />
                              {candidate.name} - Credential Verification
                            </DialogTitle>
                            <DialogDescription>
                              Verify employee-issued credentials. These
                              credentials were accepted and issued by the
                              employee from their previous employers.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {candidate.credentials.map((credential, index) => (
                              <Card
                                key={index}
                                className="border border-gray-200"
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-gray-900">
                                        {credential.title}
                                      </h4>
                                      <p className="text-gray-600">
                                        Issued by: {credential.issuer}
                                      </p>
                                      <p className="text-sm text-green-600 font-medium">
                                        ✅ Employee-verified and self-issued
                                      </p>
                                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                        <span className="flex items-center">
                                          <Calendar className="w-4 h-4 mr-1" />
                                          Accepted: {credential.issueDate}
                                        </span>
                                        <span>
                                          Valid until: {credential.expiry}
                                        </span>
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
                                        onClick={() =>
                                          handleVerifyCredential(
                                            credential.title
                                          )
                                        }
                                      >
                                        <Shield className="w-4 h-4 mr-1" />
                                        Verify via AIR Kit
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleScanQR}
                                      >
                                        <QrCode className="w-4 h-4 mr-1" />
                                        Scan QR
                                      </Button>
                                    </div>
                                  </div>
                                  {/* Credential Metadata */}
                                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                                      Employee-Verified Details
                                    </h5>
                                    <div className="text-xs text-gray-600 space-y-1">
                                      <div>
                                        <strong>Original Employer:</strong>{" "}
                                        {credential.issuer}
                                      </div>
                                      <div>
                                        <strong>Employee Acceptance:</strong>{" "}
                                        {credential.issueDate}
                                      </div>
                                      <div>
                                        <strong>Verification Status:</strong>{" "}
                                        Self-issued and cryptographically signed
                                      </div>
                                    </div>
                                    <details className="mt-2">
                                      <summary className="text-xs font-medium text-gray-700 cursor-pointer">
                                        View Full Metadata
                                      </summary>
                                      <pre className="text-xs text-gray-600 whitespace-pre-wrap mt-2">
                                        {JSON.stringify(
                                          credential.metadata,
                                          null,
                                          2
                                        )}
                                      </pre>
                                    </details>
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No candidates found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or filters
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
