import { MapPin, Users, Clock, Plus, Car, Calendar, Map, Users2, ShoppingBag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 pt-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back! 🏎️</h1>
        <p className="text-gray-400 text-sm">Discover takeovers and car meets happening near you</p>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/create-takeover">
            <Card className="bg-green-600 hover:bg-green-700 border-0 cursor-pointer transition-colors">
              <CardContent className="p-4 text-center">
                <Plus className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Create Takeover</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/events">
            <Card className="bg-blue-600 hover:bg-blue-700 border-0 cursor-pointer transition-colors">
              <CardContent className="p-4 text-center">
                <MapPin className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Find Events</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/garage">
            <Card className="bg-purple-600 hover:bg-purple-700 border-0 cursor-pointer transition-colors">
              <CardContent className="p-4 text-center">
                <Car className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">My Garage</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/clubs">
            <Card className="bg-orange-600 hover:bg-orange-700 border-0 cursor-pointer transition-colors">
              <CardContent className="p-4 text-center">
                <Users2 className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Join Club</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Featured Takeovers */}
      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Featured Takeovers</h2>
          <Link href="/events" className="text-green-400 text-sm hover:underline">
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {/* Downtown Takeover */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white">Downtown Takeover</h3>
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
                  <span>Tonight 11:00 PM</span>
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

          {/* Midnight Cruise */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white">Midnight Cruise</h3>
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
                  <span>Tomorrow 12:00 AM</span>
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

          {/* Street Racing Meet */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white">Street Racing Meet</h3>
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
        </div>
      </div>

      {/* Live Activity */}
      <div className="px-4 mb-20">
        <h2 className="text-lg font-semibold mb-4">Live Activity</h2>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <div>
            <span className="text-white">3 takeovers happening now</span>
            <div className="text-gray-400">Within 5 miles of you</div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-around py-2">
          <Link href="/" className="flex flex-col items-center py-2 px-3">
            <div className="w-6 h-6 mb-1 text-green-400">🏠</div>
            <span className="text-xs text-green-400">Home</span>
          </Link>
          <Link href="/events" className="flex flex-col items-center py-2 px-3">
            <Calendar className="w-6 h-6 mb-1 text-gray-400" />
            <span className="text-xs text-gray-400">Events</span>
          </Link>
          <Link href="/map" className="flex flex-col items-center py-2 px-3">
            <Map className="w-6 h-6 mb-1 text-gray-400" />
            <span className="text-xs text-gray-400">Map</span>
          </Link>
          <Link href="/clubs" className="flex flex-col items-center py-2 px-3">
            <Users2 className="w-6 h-6 mb-1 text-gray-400" />
            <span className="text-xs text-gray-400">Clubs</span>
          </Link>
          <Link href="/shop" className="flex flex-col items-center py-2 px-3">
            <ShoppingBag className="w-6 h-6 mb-1 text-gray-400" />
            <span className="text-xs text-gray-400">Shop</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center py-2 px-3">
            <User className="w-6 h-6 mb-1 text-gray-400" />
            <span className="text-xs text-gray-400">Profile</span>
          </Link>
        </div>
        <div className="text-center py-1">
          <span className="text-xs text-gray-500">🔧 Made at your mothers house :)</span>
        </div>
      </div>
    </div>
  )
}
