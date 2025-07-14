"use client"

import { ArrowLeft, MapPin, Navigation, Filter, Users, Clock, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEffect, useState } from "react"
import { MapboxMap } from "@/components/mapbox-map"

// Mock event data with real LA coordinates
const mockEvents = [
  {
    id: 1,
    name: "Downtown Takeover",
    location: "Downtown LA",
    coordinates: [-118.2437, 34.0522] as [number, number],
    time: "Live now",
    attendees: 47,
    type: "public",
    status: "live",
  },
  {
    id: 2,
    name: "Midnight Cruise",
    location: "Santa Monica Pier",
    coordinates: [-118.4912, 34.0195] as [number, number],
    time: "Starting in 2h",
    attendees: 23,
    type: "invite-only",
    status: "upcoming",
  },
  {
    id: 3,
    name: "Street Racing Meet",
    location: "Industrial District",
    coordinates: [-118.2089, 34.0224] as [number, number],
    time: "Tomorrow 10:30 PM",
    attendees: 89,
    type: "public",
    status: "scheduled",
  },
  {
    id: 4,
    name: "Sunset Canyon Run",
    location: "Malibu Canyon",
    coordinates: [-118.6919, 34.0259] as [number, number],
    time: "Saturday 6:00 PM",
    attendees: 15,
    type: "members-only",
    status: "scheduled",
  },
]

export default function MapPage() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [locationStatus, setLocationStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle")
  const [locationError, setLocationError] = useState<string>("")

  const requestLocation = () => {
    console.log("🔍 Starting location request...")

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.log("❌ Geolocation not supported")
      setLocationStatus("denied")
      setLocationError(
        "Geolocation is not supported by your browser. Please use a modern browser like Chrome, Firefox, or Safari.",
      )
      return
    }

    // Check if we're on HTTPS (required for location access)
    if (location.protocol !== "https:" && location.hostname !== "localhost") {
      console.log("❌ Not on HTTPS")
      setLocationStatus("denied")
      setLocationError("Location access requires HTTPS. Please use a secure connection.")
      return
    }

    console.log("✅ Geolocation supported, requesting permission...")
    setLocationStatus("requesting")
    setLocationError("")

    // Check current permission state if available
    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          console.log("🔐 Current permission state:", result.state)
          if (result.state === "denied") {
            setLocationStatus("denied")
            setLocationError(
              "Location access was previously denied. Please enable location access in your browser settings and refresh the page.",
            )
            return
          }
        })
        .catch((err) => {
          console.log("⚠️ Could not check permission state:", err)
        })
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 20000, // Increased timeout
      maximumAge: 300000, // 5 minutes
    }

    console.log("📍 Calling getCurrentPosition with options:", options)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("✅ Location success:", position)
        const userLng = position.coords.longitude
        const userLat = position.coords.latitude
        const accuracy = position.coords.accuracy

        console.log(`📍 Location: ${userLat}, ${userLng} (accuracy: ${accuracy}m)`)

        setUserLocation([userLng, userLat])
        setLocationStatus("granted")
      },
      (error) => {
        console.log("❌ Location error:", error)
        setLocationStatus("denied")

        let errorMessage = ""
        let helpText = ""

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied"
            helpText =
              "To enable location access:\n• Click the location icon in your browser's address bar\n• Select 'Allow' for location access\n• Refresh the page"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Your location is currently unavailable"
            helpText =
              "This might be due to:\n• Poor GPS signal\n• Location services disabled on your device\n• Network connectivity issues"
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out"
            helpText =
              "Try:\n• Moving to an area with better GPS signal\n• Enabling high accuracy location on your device\n• Refreshing the page"
            break
          default:
            errorMessage = "An unknown error occurred while getting your location"
            helpText = "Please try refreshing the page or check your browser settings"
            break
        }

        setLocationError(`${errorMessage}. ${helpText}`)
      },
      options,
    )
  }

  const setManualLocation = (city: string) => {
    const locations = {
      "los-angeles": [-118.2437, 34.0522],
      "san-francisco": [-122.4194, 37.7749],
      "new-york": [-74.006, 40.7128],
      chicago: [-87.6298, 41.8781],
      miami: [-80.1918, 25.7617],
    }

    const coords = locations[city as keyof typeof locations]
    if (coords) {
      setUserLocation(coords as [number, number])
      setLocationStatus("granted")
      setLocationError("")
      console.log(`📍 Manual location set to ${city}:`, coords)
    }
  }

  // Auto-request location on component mount
  useEffect(() => {
    requestLocation()
  }, [])

  const calculateDistance = (coord1: [number, number], coord2: [number, number]) => {
    const R = 3959 // Earth's radius in miles
    const dLat = ((coord2[1] - coord1[1]) * Math.PI) / 180
    const dLon = ((coord2[0] - coord1[0]) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1[1] * Math.PI) / 180) *
        Math.cos((coord2[1] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "text-green-400"
      case "upcoming":
        return "text-blue-400"
      default:
        return "text-orange-400"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "public":
        return "bg-green-600"
      case "invite-only":
        return "bg-orange-600"
      case "members-only":
        return "bg-blue-600"
      default:
        return "bg-gray-600"
    }
  }

  // Sort events by distance if user location is available
  const sortedEvents = userLocation
    ? [...mockEvents].sort(
        (a, b) => calculateDistance(userLocation, a.coordinates) - calculateDistance(userLocation, b.coordinates),
      )
    : mockEvents

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Header with Tron styling */}
      <div className="flex items-center justify-between p-4 pt-8 border-b border-cyan-500/20">
        <div className="flex items-center gap-4">
          <Link href="/">
            <ArrowLeft className="w-6 h-6 text-cyan-400 hover:text-cyan-300 transition-colors" />
          </Link>
          <h1 className="text-xl font-bold text-cyan-300 uppercase tracking-wider">Map Interface</h1>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-cyan-500/30 bg-transparent text-cyan-300 hover:bg-cyan-500/10"
          >
            <Filter className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-cyan-500/30 bg-transparent text-cyan-300 hover:bg-cyan-500/10"
            onClick={requestLocation}
            disabled={locationStatus === "requesting"}
          >
            {locationStatus === "requesting" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Location Status */}
      {locationStatus === "requesting" && (
        <div className="px-4 mb-4">
          <Card className="bg-blue-900/50 border-blue-400/30 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                <div>
                  <h3 className="font-semibold text-blue-100">Acquiring Location Signal</h3>
                  <p className="text-sm text-blue-200">Please allow location access when prompted</p>
                  <p className="text-xs text-blue-300 mt-1">Scanning for GPS coordinates...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {locationStatus === "granted" && userLocation && (
        <div className="px-4 mb-4">
          <Card className="bg-green-900/50 border-green-400/30 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-400" />
                <div>
                  <h3 className="font-semibold text-green-100">Location Lock Acquired</h3>
                  <p className="text-sm text-green-200 font-mono">
                    LAT: {userLocation[1].toFixed(4)} | LNG: {userLocation[0].toFixed(4)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {locationStatus === "denied" && (
        <div className="px-4 mb-4">
          <Card className="bg-orange-900/50 border-orange-400/30 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-400" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-100">Location Access Denied</h3>
                  <p className="text-sm text-orange-200 mb-3 whitespace-pre-line">{locationError}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={requestLocation} className="bg-orange-600 hover:bg-orange-700">
                      <MapPin className="w-4 h-4 mr-2" />
                      Retry Scan
                    </Button>
                    <select
                      className="bg-gray-800 text-cyan-300 text-sm px-3 py-1 rounded border border-cyan-500/30"
                      onChange={(e) => e.target.value && setManualLocation(e.target.value)}
                      defaultValue=""
                    >
                      <option value="">Manual Override</option>
                      <option value="los-angeles">Los Angeles</option>
                      <option value="san-francisco">San Francisco</option>
                      <option value="new-york">New York</option>
                      <option value="chicago">Chicago</option>
                      <option value="miami">Miami</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Interactive Map */}
      <div className="px-4 mb-4">
        <MapboxMap
          events={mockEvents}
          userLocation={userLocation}
          onEventSelect={setSelectedEvent}
          selectedEvent={selectedEvent}
        />
      </div>

      {/* Selected Event Details */}
      {selectedEvent && (
        <div className="px-4 mb-4">
          <Card className="bg-gray-800/90 border-cyan-500/30 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-cyan-300">{selectedEvent.name}</h3>
                <div className="flex gap-2">
                  <Badge variant="secondary" className={`${getTypeColor(selectedEvent.type)} text-white text-xs`}>
                    {selectedEvent.type}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-1 h-6 w-6 text-cyan-400 hover:text-cyan-300"
                    onClick={() => setSelectedEvent(null)}
                  >
                    ×
                  </Button>
                </div>
              </div>
              <div className="space-y-1 text-sm text-gray-400 mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>{selectedEvent.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className={getStatusColor(selectedEvent.status)}>{selectedEvent.time}</span>
                </div>
                {userLocation && (
                  <div className="text-xs text-blue-400 font-mono">
                    DISTANCE: {calculateDistance(userLocation, selectedEvent.coordinates).toFixed(1)} MI
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>{selectedEvent.attendees} attending</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-cyan-500/30 text-cyan-300 bg-transparent hover:bg-cyan-500/10"
                  >
                    Navigate
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Join Event
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Nearby Events List */}
      <div className="px-4 mb-20">
        <h2 className="text-lg font-semibold mb-3 text-cyan-300 uppercase tracking-wider">
          {userLocation ? "Events Near You" : "All Events"}
        </h2>
        <div className="space-y-3">
          {sortedEvents.map((event) => (
            <Card
              key={event.id}
              className={`bg-gray-800/90 border-cyan-500/30 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10 ${
                selectedEvent?.id === event.id ? "ring-2 ring-green-500 border-green-500/50" : ""
              }`}
              onClick={() => setSelectedEvent(event)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-cyan-300">{event.name}</h3>
                  <div className="flex items-center gap-2">
                    {userLocation && (
                      <span className="text-xs text-blue-400 font-medium font-mono">
                        {calculateDistance(userLocation, event.coordinates).toFixed(1)} MI
                      </span>
                    )}
                    <Badge variant="secondary" className={`${getTypeColor(event.type)} text-white text-xs`}>
                      {event.type}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${getStatusColor(event.status)}`}>{event.time}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-cyan-500/30 text-cyan-300 bg-transparent hover:bg-cyan-500/10"
                    >
                      Navigate
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Join
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
