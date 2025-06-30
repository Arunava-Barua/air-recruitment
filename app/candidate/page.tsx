"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Shield,
  GraduationCap,
  Briefcase,
  Wallet,
  Plus,
  Download,
  Send,
  Github,
  Linkedin,
  Copy,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
} from "lucide-react"
import { CandidateHeader } from "@/components/candidate-header"

// AIR Credential SDK imports
import {
  AirCredentialWidget,
  type ClaimRequest,
  type JsonDocumentObject,
  type Language,
} from "@mocanetwork/air-credential-sdk"
import "@mocanetwork/air-credential-sdk/dist/style.css"
import { AirService, BUILD_ENV } from "@mocanetwork/airkit"
import type { BUILD_ENV_TYPE } from "@mocanetwork/airkit"
import {
  getEnvironmentConfig,
  type EnvironmentConfig,
} from "../../config/environments"

// Environment configuration
const environmentConfig: EnvironmentConfig = getEnvironmentConfig("SANDBOX")
const LOCALE = "en"

// AIR Configuration with actual credentials
const AIR_CONFIG = {
  apiKey: "13tJvofniBDVdRkF9MPkRfliqFz27ysqwOY8vBjr",
  issuerDid: "did:air:id:test:4P6SFHkZJafvP3CALQwADe5HdX8CaeRWuUGNU5SKtp",
  partnerId: "67264f2e-99a9-4ee0-b23b-6a0f96bb573a",
  credentialId: "c21hi0g1dl74b0035439vX", // You may need to update this with your actual credential ID
}

// Function to get issuer auth token (from CredentialIssuance.tsx)
const getIssuerAuthToken = async (
  issuerDid: string,
  apiKey: string,
  apiUrl: string
): Promise<string | null> => {
  try {
    const response = await fetch(`${apiUrl}/issuer/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
        "X-Test": "true",
      },
      body: JSON.stringify({
        issuerDid: issuerDid,
        authToken: apiKey,
      }),
    })

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`)
    }

    const data = await response.json()

    if (data.code === 80000000 && data.data && data.data.token) {
      return data.data.token
    } else {
      console.error(
        "Failed to get issuer auth token from API:",
        data.msg || "Unknown error"
      )
      return null
    }
  } catch (error) {
    console.error("Error fetching issuer auth token:", error)
    return null
  }
}

// Mock data
const candidateData = {
  name: "Sarah Johnson",
  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  walletAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
  linkedin: "linkedin.com/in/sarahjohnson",
  github: "github.com/sarahjohnson",
}

const educationCredentials = [
  {
    id: 1,
    institution: "Stanford University",
    degree: "Master of Computer Science",
    issueDate: "2022-06-15",
    expiry: "2027-06-15",
    status: "verified",
    issuer: "Stanford University (DID: did:web:stanford.edu)",
    privacy: "public",
  },
  {
    id: 2,
    institution: "UC Berkeley",
    degree: "Bachelor of Science in Computer Science",
    issueDate: "2020-05-20",
    expiry: "2025-05-20",
    status: "verified",
    issuer: "UC Berkeley (DID: did:web:berkeley.edu)",
    privacy: "recruiters",
  },
]

const workCredentials = [
  {
    id: 1,
    employer: "Google",
    role: "Senior Software Engineer",
    duration: "2022-07 to 2024-01",
    status: "verified",
    issuer: "Google Inc. (DID: did:web:google.com)",
    privacy: "public",
  },
  {
    id: 2,
    employer: "Meta",
    role: "Software Engineer",
    duration: "2020-08 to 2022-06",
    status: "pending",
    issuer: "Meta Platforms (DID: did:web:meta.com)",
    privacy: "recruiters",
  },
]

const walletCredentials = [
  {
    id: 1,
    type: "Education",
    title: "Master of Computer Science",
    issuer: "Stanford University",
    status: "verified",
    issueDate: "2022-06-15",
  },
  {
    id: 2,
    type: "Employment",
    title: "Senior Software Engineer",
    issuer: "Google",
    status: "verified",
    issueDate: "2022-07-01",
  },
  {
    id: 3,
    type: "Certification",
    title: "AWS Solutions Architect",
    issuer: "Amazon Web Services",
    status: "verified",
    issueDate: "2023-03-15",
  },
]

const organizations = [
  { id: 1, name: "Stanford University", type: "education" },
  { id: 2, name: "Google", type: "employment" },
  { id: 3, name: "Meta", type: "employment" },
  { id: 4, name: "Amazon", type: "employment" },
]

const credentialTypes = {
  education: ["Degree Certificate", "Course Completion", "Academic Transcript"],
  employment: ["Employment Verification", "Role Certificate", "Performance Review"],
}

export default function CandidatePage() {
  const [selectedOrg, setSelectedOrg] = useState("")
  const [selectedCredType, setSelectedCredType] = useState("")
  const [privacySettings, setPrivacySettings] = useState<Record<string, string>>({})
  const { toast } = useToast()

  // AIR Issuance state
  const [isIssuing, setIsIssuing] = useState(false)
  const [issuanceSuccess, setIssuanceSuccess] = useState(false)
  const [issuanceError, setIssuanceError] = useState<string | null>(null)
  const [airService, setAirService] = useState<AirService | null>(null)
  const widgetRef = useRef<AirCredentialWidget | null>(null)

  // Incoming requests state
  const [incomingRequests, setIncomingRequests] = useState([])

  // Load incoming credential requests
  useEffect(() => {
    const loadIncomingRequests = () => {
      try {
        const requests = JSON.parse(localStorage.getItem('credentialRequests') || '[]')
        setIncomingRequests(requests)
      } catch (error) {
        console.error("Error loading credential requests:", error)
      }
    }

    loadIncomingRequests()
    
    // Set up an interval to check for new requests (in a real app, you'd use websockets or push notifications)
    const interval = setInterval(loadIncomingRequests, 5000)
    
    return () => clearInterval(interval)
  }, [])

  // Initialize AIR Service
  useEffect(() => {
    const initAirService = async () => {
      try {
        // You'll need to initialize your AIR service here
        // This is a placeholder - replace with actual AIR service initialization
        const service = null // Initialize your AIR service
        setAirService(service)
      } catch (error) {
        console.error("Failed to initialize AIR service:", error)
      }
    }

    initAirService()
  }, [])

  // Cleanup widget on unmount
  useEffect(() => {
    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy()
      }
    }
  }, [])

  // AIR Credential Issuance Implementation
  const handleAIRCredentialIssuance = async (requestData: any): Promise<boolean> => {
    setIsIssuing(true)
    setIssuanceError(null)
    setIssuanceSuccess(false)

    try {
      // Create credential subject matching the CredifyJobs schema
      const credentialSubject = {
        id: candidateData.walletAddress, // Use wallet address as the subject ID
        Salary: parseInt(requestData.details.salary?.replace(/[^0-9]/g, '') || '50000'), // Extract number from salary range
        Experience: parseInt(requestData.details.startDate ? 
          Math.floor((new Date().getTime() - new Date(requestData.details.startDate).getTime()) / (1000 * 60 * 60 * 24 * 365)).toString() : '2'), // Calculate years of experience
        isCryptoUser: 1, // Assuming candidate is a crypto user since they have a wallet
      }

      console.log("Generated credential subject:", credentialSubject)

      // Step 1: Fetch the issuer auth token
      const fetchedIssuerAuthToken = await getIssuerAuthToken(
        AIR_CONFIG.issuerDid,
        AIR_CONFIG.apiKey,
        environmentConfig.apiUrl
      )

      if (!fetchedIssuerAuthToken) {
        setIssuanceError(
          "Failed to fetch issuer authentication token. Please check configuration."
        )
        setIsIssuing(false)
        return false
      }

      // Step 2: Create the claim request
      const claimRequest: ClaimRequest = {
        process: "Issue",
        issuerDid: AIR_CONFIG.issuerDid,
        issuerAuth: fetchedIssuerAuthToken,
        credentialId: AIR_CONFIG.credentialId,
        credentialSubject: credentialSubject as JsonDocumentObject,
      }

      // Step 3: Get URL with token and append theme parameters
      let urlWithToken = environmentConfig.widgetUrl
      if (airService) {
        try {
          const rp = await airService.goToPartner(environmentConfig.widgetUrl)
          if (rp?.urlWithToken) {
            urlWithToken = rp.urlWithToken
          }
        } catch (err) {
          console.warn("Failed to get URL with token, using default:", err)
        }
      }

      // Append theme parameters to URL if supported
      const url = new URL(urlWithToken)
      url.searchParams.append('theme', 'light')
      url.searchParams.append('color-scheme', 'light')
      url.searchParams.append('mode', 'light')
      urlWithToken = url.toString()

      console.log("AIR Widget URL with theme params:", urlWithToken)

      // Step 4: Create and configure the widget
      widgetRef.current = new AirCredentialWidget(claimRequest, AIR_CONFIG.partnerId, {
        endpoint: urlWithToken,
        airKitBuildEnv: BUILD_ENV.SANDBOX,
        theme: "light",
        locale: LOCALE as Language,
      })

      // Step 5: Set up event listeners
      return new Promise((resolve) => {
        if (!widgetRef.current) {
          resolve(false)
          return
        }

        widgetRef.current.on("issueCompleted", () => {
          console.log("Credential issuance completed successfully!")
          setIssuanceSuccess(true)
          setIsIssuing(false)
          toast({
            title: "Credential Issued Successfully!",
            description: "Credential has been issued to your wallet via AIR Kit",
          })
          resolve(true)
        })

        widgetRef.current.on("close", () => {
          console.log("Widget closed")
          setIsIssuing(false)
          resolve(false)
        })

        widgetRef.current.on("error", (error: any) => {
          console.error("Widget error:", error)
          setIssuanceError("Credential issuance widget encountered an error")
          setIsIssuing(false)
          toast({
            title: "Issuance Error",
            description: "An error occurred during credential issuance. Please try again.",
            variant: "destructive",
          })
          resolve(false)
        })

        // Step 6: Launch the widget and fix iframe styling
        try {
          widgetRef.current.launch()
          
          // Monitor for iframe creation and fix styling
          setTimeout(() => {
            const iframes = document.querySelectorAll('iframe[src*="air"], iframe[src*="credential"]')
            iframes.forEach(iframe => {
              // Force light color scheme on iframe
              iframe.style.colorScheme = 'light'
              iframe.style.backgroundColor = 'white'
              
              // Add data attributes
              iframe.setAttribute('data-theme', 'light')
              iframe.setAttribute('color-scheme', 'light')
              
              // Try to access iframe document if same-origin (unlikely but worth trying)
              try {
                if (iframe.contentDocument) {
                  const iframeDoc = iframe.contentDocument
                  const metaColorScheme = iframeDoc.createElement('meta')
                  metaColorScheme.name = 'color-scheme'
                  metaColorScheme.content = 'light'
                  iframeDoc.head?.appendChild(metaColorScheme)
                }
              } catch (e) {
                // Cross-origin iframe, can't access content
                console.log('Cross-origin iframe detected, using external styling approach')
              }
            })
          }, 1000) // Give time for iframe to load
          
        } catch (error) {
          console.error("Failed to launch widget:", error)
          setIssuanceError("Failed to launch credential issuance widget")
          setIsIssuing(false)
          resolve(false)
        }
      })

    } catch (err) {
      console.error("Credential issuance error:", err)
      setIssuanceError(err instanceof Error ? err.message : "An error occurred during credential issuance")
      setIsIssuing(false)
      toast({
        title: "Issuance Error",
        description: "Failed to start credential issuance process. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const handleAcceptRequest = async (requestId: number) => {
    const request = incomingRequests.find(req => req.id === requestId)
    if (!request) return

    try {
      // Trigger AIR credential issuance
      const success = await handleAIRCredentialIssuance(request)

      if (success) {
        // Update request status to accepted
        const updatedRequests = incomingRequests.map(req =>
          req.id === requestId ? { ...req, status: 'accepted' } : req
        )
        setIncomingRequests(updatedRequests)
        localStorage.setItem('credentialRequests', JSON.stringify(updatedRequests))

        toast({
          title: "Credential request accepted!",
          description: "Credential has been issued to your wallet via AIR Kit",
        })
      }
    } catch (error) {
      toast({
        title: "Error processing request",
        description: "Failed to process credential request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRejectRequest = (requestId: number) => {
    const updatedRequests = incomingRequests.map(req =>
      req.id === requestId ? { ...req, status: 'rejected' } : req
    )
    setIncomingRequests(updatedRequests)
    localStorage.setItem('credentialRequests', JSON.stringify(updatedRequests))

    toast({
      title: "Credential request rejected",
      description: "The employer has been notified of your decision",
      variant: "destructive",
    })
  }

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

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case "public":
        return <Eye className="w-4 h-4 text-blue-600" />
      case "recruiters":
        return <EyeOff className="w-4 h-4 text-yellow-600" />
      case "private":
        return <EyeOff className="w-4 h-4 text-red-600" />
      default:
        return <Eye className="w-4 h-4 text-gray-400" />
    }
  }

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(candidateData.walletAddress)
    toast({
      title: "Wallet address copied",
      description: "Address copied to clipboard",
    })
  }

  const handleCredentialRequest = () => {
    if (!selectedOrg || !selectedCredType) {
      toast({
        title: "Missing information",
        description: "Please select both organization and credential type",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Credential request sent",
      description: `Request sent to ${organizations.find((org) => org.id.toString() === selectedOrg)?.name}`,
    })

    setSelectedOrg("")
    setSelectedCredType("")
  }

  const handlePresentCredential = (credentialId: number) => {
    toast({
      title: "Credential presented",
      description: "Verifiable credential shared successfully via AIR Kit",
    })
  }

  const handleDownloadCredential = (credentialId: number) => {
    toast({
      title: "Credential downloaded",
      description: "VC file downloaded to your device",
    })
  }

  return (
    <>
      {/* Custom CSS to fix AIR widget modal text color */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Override AIR widget modal text colors to be black */
          .air-credential-widget-modal,
          .air-credential-widget-modal *,
          .air-credential-widget-modal .modal-content,
          .air-credential-widget-modal .modal-content *,
          .air-credential-widget-modal p,
          .air-credential-widget-modal h1,
          .air-credential-widget-modal h2,
          .air-credential-widget-modal h3,
          .air-credential-widget-modal h4,
          .air-credential-widget-modal h5,
          .air-credential-widget-modal h6,
          .air-credential-widget-modal span,
          .air-credential-widget-modal div,
          .air-credential-widget-modal label,
          .air-credential-widget-modal .text,
          .air-modal *,
          .air-modal,
          [class*="air-"] *,
          [class*="air-"],
          iframe[src*="air"] *,
          iframe[src*="credential"] * {
            color: #1f2937 !important;
          }
          
          .air-credential-widget-modal button,
          .air-modal button,
          [class*="air-"] button {
            color: white !important;
          }
          
          .air-credential-widget-modal a,
          .air-modal a,
          [class*="air-"] a {
            color: #3b82f6 !important;
          }
          
          [data-testid*="modal"] *,
          [role="dialog"] *,
          [role="modal"] * {
            color: #1f2937 !important;
          }
        `
      }} />
      
      <div className="min-h-screen bg-gray-50">
        <CandidateHeader />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8 shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={candidateData.avatar || "/placeholder.svg"} alt={candidateData.name} />
                <AvatarFallback className="text-xl">SJ</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{candidateData.name}</h1>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {/* <Wallet className="w-4 h-4 text-gray-500" />
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                      {candidateData.walletAddress}
                    </code>
                    <Button variant="ghost" size="sm" onClick={copyWalletAddress}>
                      <Copy className="w-4 h-4" />
                    </Button> */}
                  </div>
                  <div className="flex items-center space-x-4">
                    <a
                      href={`https://${candidateData.linkedin}`}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span className="text-sm">LinkedIn</span>
                    </a>
                    <a
                      href={`https://${candidateData.github}`}
                      className="flex items-center space-x-1 text-gray-700 hover:text-gray-900"
                    >
                      <Github className="w-4 h-4" />
                      <span className="text-sm">GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AIR Issuance Status Display */}
        {(isIssuing || issuanceSuccess || issuanceError) && (
          <Card className="mb-8 shadow-sm border-0">
            <CardContent className="p-6">
              {isIssuing && (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mr-3"></div>
                  <span className="text-green-600 font-medium">
                    Issuing credential via AIR Kit...
                  </span>
                </div>
              )}
              
              {issuanceError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">Credential Issuance Error</p>
                  <p className="text-red-600 text-sm">{issuanceError}</p>
                </div>
              )}

              {issuanceSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    ✅ Credential issued successfully via AIR Kit!
                  </p>
                  <p className="text-green-600 text-sm">
                    The credential has been added to your wallet and is now available for verification.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* AIR Configuration Display */}
        <Card className="mb-8 shadow-sm border-0">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AIR Kit Configuration</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-700 space-y-1">
                <p><strong>Issuer DID:</strong> {AIR_CONFIG.issuerDid}</p>
                <p><strong>Partner ID:</strong> {AIR_CONFIG.partnerId}</p>
                <p><strong>Credential ID:</strong> {AIR_CONFIG.credentialId}</p>
                <p><strong>API Key:</strong> {AIR_CONFIG.apiKey.substring(0, 8)}...{AIR_CONFIG.apiKey.substring(AIR_CONFIG.apiKey.length - 4)}</p>
                <p><strong>Environment:</strong> {environmentConfig.apiUrl}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Incoming Credential Requests */}
        <Card className="mb-8 shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />📬 Incoming Credential Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {incomingRequests.filter(req => req.status === 'pending').map((request) => (
              <Card key={request.id} className="border border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{request.credentialType}</h3>
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending Review
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">
                        From: <strong>TechCorp Inc.</strong> {/* Replace with actual employer name */}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Role:</span> {request.details.role}
                        </div>
                        <div>
                          <span className="font-medium">Department:</span> {request.details.department}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span> {request.details.startDate} to{" "}
                          {request.details.endDate || "Present"}
                        </div>
                        {request.details.salary && (
                          <div>
                            <span className="font-medium">Salary:</span> {request.details.salary}
                          </div>
                        )}
                      </div>
                      {request.details.achievements && (
                        <div className="text-sm text-gray-600 mb-3">
                          <span className="font-medium">Achievements:</span> {request.details.achievements}
                        </div>
                      )}
                      {request.details.performanceRating && (
                        <div className="text-sm text-gray-600 mb-3">
                          <span className="font-medium">Performance Rating:</span> {request.details.performanceRating}
                        </div>
                      )}
                      <p className="text-xs text-gray-400">Requested on: {request.requestDate}</p>
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <Button 
                      onClick={() => handleAcceptRequest(request.id)} 
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isIssuing}
                    >
                      {isIssuing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                          Issuing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept & Issue
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRejectRequest(request.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      disabled={isIssuing}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {incomingRequests.filter(req => req.status === 'pending').length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p>No pending credential requests</p>
                <p className="text-sm mt-2">Refresh the page to check for new requests</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Education Credentials */}
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />📚 Education Credentials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {educationCredentials.map((credential) => (
                  <Card key={credential.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{credential.degree}</h3>
                          <p className="text-gray-600">{credential.institution}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Issued: {credential.issueDate}</span>
                            <span>Expires: {credential.expiry}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{credential.issuer}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getPrivacyIcon(credential.privacy)}
                          {getStatusIcon(credential.status)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        {getStatusBadge(credential.status)}
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handlePresentCredential(credential.id)}>
                            <Send className="w-4 h-4 mr-1" />
                            Present
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDownloadCredential(credential.id)}>
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Work Credentials */}
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-green-600" />💼 Work Credentials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workCredentials.map((credential) => (
                  <Card key={credential.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{credential.role}</h3>
                          <p className="text-gray-600">{credential.employer}</p>
                          <p className="text-sm text-gray-500 mt-1">{credential.duration}</p>
                          <p className="text-xs text-gray-400 mt-1">{credential.issuer}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getPrivacyIcon(credential.privacy)}
                          {getStatusIcon(credential.status)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        {getStatusBadge(credential.status)}
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePresentCredential(credential.id)}
                            disabled={credential.status !== "verified"}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Present
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadCredential(credential.id)}
                            disabled={credential.status !== "verified"}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* My Wallet Credentials */}
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="w-5 h-5 mr-2 text-purple-600" />🔐 My Wallet Credentials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {walletCredentials.map((credential) => (
                  <div key={credential.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900">{credential.title}</h4>
                        <p className="text-xs text-gray-600">{credential.issuer}</p>
                        <p className="text-xs text-gray-400">{credential.issueDate}</p>
                      </div>
                      {getStatusIcon(credential.status)}
                    </div>
                    <Badge className="mt-2 text-xs bg-gray-100 text-gray-700">{credential.type}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Request Credential */}
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-blue-600" />➕ Request Credential
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id.toString()}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedOrg && (
                  <div className="space-y-2">
                    <Label htmlFor="credentialType">Credential Type</Label>
                    <Select value={selectedCredType} onValueChange={setSelectedCredType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select credential type" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedOrg &&
                          credentialTypes[
                            organizations.find((org) => org.id.toString() === selectedOrg)
                              ?.type as keyof typeof credentialTypes
                          ]?.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button
                  onClick={handleCredentialRequest}
                  className="w-full"
                  disabled={!selectedOrg || !selectedCredType}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Request
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}