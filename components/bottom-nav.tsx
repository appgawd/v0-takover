"use client"

import { Calendar, Map, Users2, ShoppingBag, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
      <div className="flex justify-around py-2">
        <Link href="/" className="flex flex-col items-center py-2 px-3">
          <div className="w-6 h-6 mb-1">
            {isActive("/") ? "🏠" : <div className="w-6 h-6 border-2 border-gray-400 rounded"></div>}
          </div>
          <span className={`text-xs ${isActive("/") ? "text-green-400" : "text-gray-400"}`}>Home</span>
        </Link>
        <Link href="/events" className="flex flex-col items-center py-2 px-3">
          <Calendar className={`w-6 h-6 mb-1 ${isActive("/events") ? "text-green-400" : "text-gray-400"}`} />
          <span className={`text-xs ${isActive("/events") ? "text-green-400" : "text-gray-400"}`}>Events</span>
        </Link>
        <Link href="/map" className="flex flex-col items-center py-2 px-3">
          <Map className={`w-6 h-6 mb-1 ${isActive("/map") ? "text-green-400" : "text-gray-400"}`} />
          <span className={`text-xs ${isActive("/map") ? "text-green-400" : "text-gray-400"}`}>Map</span>
        </Link>
        <Link href="/clubs" className="flex flex-col items-center py-2 px-3">
          <Users2 className={`w-6 h-6 mb-1 ${isActive("/clubs") ? "text-green-400" : "text-gray-400"}`} />
          <span className={`text-xs ${isActive("/clubs") ? "text-green-400" : "text-gray-400"}`}>Clubs</span>
        </Link>
        <Link href="/shop" className="flex flex-col items-center py-2 px-3">
          <ShoppingBag className={`w-6 h-6 mb-1 ${isActive("/shop") ? "text-green-400" : "text-gray-400"}`} />
          <span className={`text-xs ${isActive("/shop") ? "text-green-400" : "text-gray-400"}`}>Shop</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center py-2 px-3">
          <User className={`w-6 h-6 mb-1 ${isActive("/profile") ? "text-green-400" : "text-gray-400"}`} />
          <span className={`text-xs ${isActive("/profile") ? "text-green-400" : "text-gray-400"}`}>Profile</span>
        </Link>
      </div>
      <div className="text-center py-1">
        <span className="text-xs text-gray-500">🔧 Made with Manus</span>
      </div>
    </div>
  )
}
