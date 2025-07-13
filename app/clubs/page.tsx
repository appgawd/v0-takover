import { ArrowLeft, Users, Crown, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function ClubsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">Clubs</h1>
        </div>
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Club
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <Input placeholder="Search clubs..." className="pl-10 bg-gray-800 border-gray-700 text-white" />
        </div>
      </div>

      {/* My Clubs */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">My Clubs</h2>
        <div className="space-y-3">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">LA Street Kings</h3>
                    <Badge variant="secondary" className="bg-yellow-600 text-white text-xs">
                      Admin
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>247 members</span>
                    </div>
                    <span>•</span>
                    <span>Founded 2019</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">JDM</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">JDM Legends</h3>
                    <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                      Member
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>89 members</span>
                    </div>
                    <span>•</span>
                    <span>Founded 2021</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommended Clubs */}
      <div className="px-4 mb-20">
        <h2 className="text-lg font-semibold mb-3">Recommended</h2>
        <div className="space-y-3">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">BMW</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">BMW M Club</h3>
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                      Join
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>156 members</span>
                    </div>
                    <span>•</span>
                    <span>Founded 2020</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">SC</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">SoCal Drifters</h3>
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                      Join
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>203 members</span>
                    </div>
                    <span>•</span>
                    <span>Founded 2018</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">VW</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">VW Enthusiasts</h3>
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                      Join
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>78 members</span>
                    </div>
                    <span>•</span>
                    <span>Founded 2022</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
