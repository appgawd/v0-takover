import { ArrowLeft, Search, Filter, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">Shop</h1>
        </div>
        <Button size="sm" variant="outline" className="border-gray-600 bg-transparent">
          <ShoppingCart className="w-4 h-4" />
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="px-4 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input placeholder="Search products..." className="pl-10 bg-gray-800 border-gray-700 text-white" />
          </div>
          <Button variant="outline" size="icon" className="border-gray-700 bg-transparent">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Badge variant="secondary" className="bg-green-600 text-white whitespace-nowrap">
            All
          </Badge>
          <Badge variant="outline" className="border-gray-600 text-gray-300 whitespace-nowrap">
            Performance
          </Badge>
          <Badge variant="outline" className="border-gray-600 text-gray-300 whitespace-nowrap">
            Exterior
          </Badge>
          <Badge variant="outline" className="border-gray-600 text-gray-300 whitespace-nowrap">
            Interior
          </Badge>
          <Badge variant="outline" className="border-gray-600 text-gray-300 whitespace-nowrap">
            Wheels
          </Badge>
          <Badge variant="outline" className="border-gray-600 text-gray-300 whitespace-nowrap">
            Apparel
          </Badge>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 mb-20">
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="aspect-square bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">Cold Air Intake</h3>
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-400">4.8 (124)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-400">$299</span>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="aspect-square bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">Turbo Kit</h3>
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-400">4.9 (89)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-400">$2,499</span>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="aspect-square bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-2xl">🛞</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">Racing Wheels</h3>
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-400">4.7 (156)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-400">$1,299</span>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="aspect-square bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-2xl">👕</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">Club T-Shirt</h3>
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-400">4.6 (67)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-400">$29</span>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="aspect-square bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-2xl">🔊</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">Exhaust System</h3>
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-400">4.8 (203)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-400">$899</span>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="aspect-square bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">LED Headlights</h3>
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-400">4.5 (91)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-400">$399</span>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
