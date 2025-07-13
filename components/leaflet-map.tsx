"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

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

interface LeafletMapProps {
  events: Event[]
  userLocation?: [number, number] | null
  onEventSelect: (event: Event) => void
  selectedEvent?: Event | null
}

export function LeafletMap({ events, userLocation, onEventSelect, selectedEvent }: LeafletMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string>("")
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    let isMounted = true

    const loadLeaflet = async () => {
      try {
        // Dynamically import Leaflet
        const L = await import("leaflet")

        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          document.head.appendChild(link)
        }

        if (!isMounted || !mapContainer.current || map.current) return

        // Initialize map
        const initialCenter: [number, number] = userLocation || [34.0522, -118.2437] // Default to LA
        map.current = L.map(mapContainer.current).setView(initialCenter, userLocation ? 13 : 11)

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map.current)

        // Custom marker icons
        const createCustomIcon = (color: string, isUser = false) => {
          const size = isUser ? 12 : 20
          return L.divIcon({
            className: "custom-marker",
            html: `<div style="
              width: ${size}px;
              height: ${size}px;
              background-color: ${color};
              border: 2px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              ${isUser ? "animation: pulse 2s infinite;" : ""}
            "></div>`,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          })
        }

        // Add user location marker
        if (userLocation) {
          const userMarker = L.marker(userLocation, {
            icon: createCustomIcon("#3b82f6", true),
          }).addTo(map.current)

          userMarker.bindPopup(`
            <div style="color: black; font-weight: bold;">
              📍 Your Location
            </div>
          `)
        }

        // Add event markers
        markersRef.current = events.map((event) => {
          const color = event.status === "live" ? "#10b981" : event.status === "upcoming" ? "#3b82f6" : "#f59e0b"

          const marker = L.marker(event.coordinates, {
            icon: createCustomIcon(color),
          }).addTo(map.current)

          marker.bindPopup(`
            <div style="color: black; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">${event.name}</h3>
              <p style="margin: 0 0 4px 0; color: #666;">📍 ${event.location}</p>
              <p style="margin: 0 0 4px 0; color: #666;">⏰ ${event.time}</p>
              <p style="margin: 0 0 8px 0; color: #666;">👥 ${event.attendees} attending</p>
              <div style="
                background: ${color};
                color: white;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                display: inline-block;
              ">${event.type}</div>
            </div>
          `)

          marker.on("click", () => {
            onEventSelect(event)
          })

          return { marker, event }
        })

        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load Leaflet:", error)
        setLoadError("Failed to load map. Please refresh the page.")
        setIsLoading(false)
      }
    }

    loadLeaflet()

    return () => {
      isMounted = false
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [userLocation])

  // Update map when user location changes
  useEffect(() => {
    if (map.current && userLocation) {
      map.current.setView(userLocation, 13)
    }
  }, [userLocation])

  // Highlight selected event
  useEffect(() => {
    if (map.current && selectedEvent) {
      const selectedMarker = markersRef.current.find((m) => m.event.id === selectedEvent.id)
      if (selectedMarker) {
        map.current.setView(selectedEvent.coordinates, 15)
        selectedMarker.marker.openPopup()
      }
    }
  }, [selectedEvent])

  if (loadError) {
    return (
      <Card className="bg-red-900 border-red-700">
        <CardContent className="p-4 text-center">
          <p className="text-red-200">{loadError}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative">
      <div
        ref={mapContainer}
        className="h-96 rounded-lg border border-gray-700 bg-gray-800"
        style={{ minHeight: "384px" }}
      />

      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-green-400" />
            <p className="text-gray-400">Loading interactive map...</p>
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-90 rounded-lg p-3 z-[1000]">
        <div className="text-xs font-semibold mb-2 text-white">Legend</div>
        <div className="space-y-1 text-xs text-white">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Live Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Upcoming</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Scheduled</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Your Location</span>
            </div>
          )}
        </div>
      </div>

      {/* Map Attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-gray-900 bg-opacity-75 px-2 py-1 rounded">
        OpenStreetMap
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
        .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  )
}
