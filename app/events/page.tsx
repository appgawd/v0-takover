import { ArrowLeft, MapPin, Users, Clock, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 pt-8">
        <Link href="/">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold">Find Events</h1>
      </div>

      {/* Search and Filter */}
      <div className="px-4 mb-6">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input placeholder="Search events..." className="pl-10 bg-gray-800 border-gray-700 text-white" />
          </div>
          <Button variant="outline" size="icon" className="border-gray-700 bg-transparent">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Events List */}
      <div className="px-4 space-y-4 mb-20">
        {/* Today's Events */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Today</h2>
          <div className="space-y-3">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">Downtown Takeover</h3>
                  <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                    public
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-400 mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Downtown LA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>11:00 PM</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>47 attending</span>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tomorrow's Events */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Tomorrow</h2>
          <div className="space-y-3">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">Midnight Cruise</h3>
                  <Badge variant="secondary" className="bg-orange-600 text-white text-xs">
                    invite-only
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-400 mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Santa Monica Pier</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>12:00 AM</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>23 attending</span>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* This Week */}
        <div>
          <h2 className="text-lg font-semibold mb-3">This Week</h2>
          <div className="space-y-3">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">Street Racing Meet</h3>
                  <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                    public
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-400 mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Industrial District</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Friday 10:30 PM</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>89 attending</span>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">Sunset Canyon Run</h3>
                  <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
                    members-only
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-400 mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Malibu Canyon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Saturday 6:00 PM</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>15 attending</span>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
