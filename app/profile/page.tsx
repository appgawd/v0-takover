import { ArrowLeft, Settings, Edit, Share, Trophy, Calendar, Car, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
        <Button size="sm" variant="outline" className="border-gray-600 bg-transparent">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Profile Header */}
      <div className="px-4 mb-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">JD</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">John Doe</h2>
                <p className="text-gray-400">@johndoe_rides</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-yellow-600 text-white text-xs">
                    Pro Member
                  </Badge>
                  <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                    Verified
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-gray-600 bg-transparent">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 bg-transparent">
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Car enthusiast from LA. Love street racing and car meets. Always down for a good cruise! 🏎️
            </p>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-green-400">47</div>
                <div className="text-xs text-gray-400">Events</div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-400">3</div>
                <div className="text-xs text-gray-400">Cars</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-400">2</div>
                <div className="text-xs text-gray-400">Clubs</div>
              </div>
              <div>
                <div className="text-xl font-bold text-orange-400">156</div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Achievements</h2>
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
              <div className="text-xs font-medium">Event Host</div>
              <div className="text-xs text-gray-400">10+ events</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <div className="text-xs font-medium">Social</div>
              <div className="text-xs text-gray-400">100+ followers</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3 text-center">
              <Car className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-xs font-medium">Collector</div>
              <div className="text-xs text-gray-400">3+ cars</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 mb-20">
        <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
        <div className="space-y-3">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    Joined <span className="font-semibold">Downtown Takeover</span>
                  </p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Car className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    Added <span className="font-semibold">2023 BMW M3</span> to garage
                  </p>
                  <p className="text-xs text-gray-400">1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    Joined <span className="font-semibold">LA Street Kings</span> club
                  </p>
                  <p className="text-xs text-gray-400">3 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
