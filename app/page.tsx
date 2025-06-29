import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Building2, Search, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Credify</h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">Verifiable Credential Hiring Platform</p>
          <p className="text-gray-500">Powered by AIR Kit for trusted, transparent recruitment</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Candidate Portal</CardTitle>
              <CardDescription>Manage your verifiable credentials and showcase verified skills</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/candidate">Access Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Employer Dashboard</CardTitle>
              <CardDescription>Issue and manage verifiable credentials for your organization</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/employer">Manage Credentials</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Recruiter Explorer</CardTitle>
              <CardDescription>Discover and verify candidate credentials with confidence</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild size="lg" className="w-full bg-purple-600 hover:bg-purple-700">
                <Link href="/recruiter">Explore Talent</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm border">
            <Shield className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm text-gray-600">Secured by AIR Kit Verifiable Credentials</span>
          </div>
        </div>
      </div>
    </div>
  )
}
