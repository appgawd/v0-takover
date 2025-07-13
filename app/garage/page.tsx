import { ArrowLeft, Plus, Edit, Share, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function GaragePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">My Garage</h1>
        </div>
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Car
        </Button>
      </div>

      {/* Cars */}
      <div className="px-4 space-y-4 mb-20">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏎️</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">2023 BMW M3</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="p-1">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="p-1">
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-400">
                  <p>Competition Package</p>
                  <p>Manual • RWD</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
                      Featured
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚗</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">2021 Honda Civic Type R</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="p-1">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="p-1">
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-400">
                  <p>Limited Edition</p>
                  <p>Manual • FWD</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">4.6</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏁</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">1995 Nissan 240SX</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="p-1">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="p-1">
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-400">
                  <p>SR20DET Swap</p>
                  <p>Manual • RWD</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="bg-purple-600 text-white text-xs">
                      Project
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">4.9</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
