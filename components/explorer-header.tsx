import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Globe, Filter, MapPin, CreditCard } from "lucide-react"

export function ExplorerHeader() {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/explorer" className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">Global Health Explorer</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/explorer" className="text-white hover:text-blue-400 transition-colors">
                Explore
              </Link>
              <button className="text-gray-300 hover:text-white transition-colors flex items-center">
                <Filter className="mr-1 h-4 w-4" />
                Disease Filters
              </button>
              <button className="text-gray-300 hover:text-white transition-colors flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                Region Filter
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" className="bg-transparent border-gray-600 text-white hover:bg-gray-700">
              <CreditCard className="mr-2 h-4 w-4" />
              Subscribe
            </Button>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
