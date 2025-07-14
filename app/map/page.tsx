"use client"

import { useState } from "react"
import { MapboxMap } from "@/components/mapbox-map"
import { LocationService } from "@/components/location-service"

interface Event {
  id: number
  name: string
  location: string
  coordinates: [number, number]
  time: string
  attendees: number
  type: string
  status: string
}

const mockEvents: Event[] = [
  {
    id: 1,
    name: "Downtown Drift Night",
    location: "Downtown LA",
    coordinates: [-118.2437, 34.0522],
    time: "Tonight 9:00 PM",
    attendees: 127,
    type: "drift",
    status: "live",
  },
  {
    id: 2,
    name: "Sunset Strip Cruise",
    location: "West Hollywood",
    coordinates: [-118.385, 34.09],
    time: "Tomorrow 7:00 PM",
    attendees: 89,
    type: "cruise",
    status: "upcoming",
  },
  {
    id: 3,
    name: "Beach Parking Lot Meet",
    location: "Santa Monica",
    coordinates: [-118.4912, 34.0195],
    time: "Saturday 6:00 PM",
    attendees: 156,
    type: "meet",
    status: "scheduled",
  },
  {
    id: 4,
    name: "Canyon Run",
    location: "Malibu Canyon",
    coordinates: [-118.6919, 34.0259],
    time: "Sunday 8:00 AM",
    attendees: 43,
    type: "run",
    status: "scheduled",
  },
  {
    id: 5,
    name: "Import Face Off",
    location: "Long Beach",
    coordinates: [-118.1937, 33.7701],
    time: "Friday 10:00 PM",
    attendees: 203,
    type: "show",
    status: "upcoming",
  },
]

export default function MapPage() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)

  const handleLocationUpdate = (location: [number, number] | null) => {
    setUserLocation(location)
  }

  const handleLocationError = (error: string) => {
    setLocationError(error)
  }

  const handleEventSelect = (event: Event | null) => {
    setSelectedEvent(event)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Takeover Map
          </h1>
          <p className="text-gray-400">Discover car meets and events near you with our interactive tron-style map</p>
        </div>

        {/* Location Service */}
        <LocationService onLocationUpdate={handleLocationUpdate} onLocationError={handleLocationError} />

        {/* Location Error */}
        {locationError && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-200">
            <p className="font-semibold">Location Error</p>
            <p className="text-sm">{locationError}</p>
          </div>
        )}

        {/* Map */}
        <MapboxMap events={mockEvents} userLocation={userLocation} onEventSelect={handleEventSelect} />

        {/* Selected Event Details */}
        {selectedEvent && (
          <div className="bg-gray-900/90 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-cyan-300">{selectedEvent.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      selectedEvent.status === "live"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : selectedEvent.status === "upcoming"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    }`}
                  >
                    {selectedEvent.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-cyan-400">📍</span>
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-cyan-400">⏰</span>
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-cyan-400">👥</span>
                    <span>{selectedEvent.attendees} attending</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Type:</span>
                  <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-sm font-medium">
                    {selectedEvent.type.toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {mockEvents.filter((e) => e.status === "live").length}
            </div>
            <div className="text-sm text-gray-400">Live Events</div>
          </div>
          <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {mockEvents.filter((e) => e.status === "upcoming").length}
            </div>
            <div className="text-sm text-gray-400">Upcoming</div>
          </div>
          <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">
              {mockEvents.filter((e) => e.status === "scheduled").length}
            </div>
            <div className="text-sm text-gray-400">Scheduled</div>
          </div>
          <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {mockEvents.reduce((sum, e) => sum + e.attendees, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Attendees</div>
          </div>
        </div>
      </div>
    </div>
  )
}
