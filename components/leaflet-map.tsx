"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2, AlertCircle, Layers, MapIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

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

interface SearchResult {
  lat: string
  lon: string
  display_name: string
  place_id: string
}

interface LeafletMapProps {
  events: Event[]
  userLocation: [number, number] | null
  onEventSelect: (event: Event | null) => void
  selectedEvent: Event | null
}

// Custom map component that handles Leaflet initialization
function MapComponent({ events, userLocation, onEventSelect, selectedEvent }: LeafletMapProps) {
  const [map, setMap] = useState<any>(null)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [mapStyle, setMapStyle] = useState<"2d" | "3d">("2d")
  const [mapTheme, setMapTheme] = useState<"dark" | "light">("dark")
  const mapRef = useRef<any>(null)
  const [LRef, setLRef] = useState<any>(null)

  // Default location (Bellevue, WA)
  const defaultLocation: [number, number] = [-122.2015, 47.6101]
  const mapCenter = userLocation || defaultLocation

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const loadLeaflet = async () => {
      if (typeof window !== "undefined") {
        const L = await import("leaflet")

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        })

        // NEW – keep a reference so we can create icons later
        setLRef(L)

        setLeafletLoaded(true)
      }
    }

    loadLeaflet()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchError(null)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch search results")
      }

      const data: SearchResult[] = await response.json()
      setSearchResults(data)

      if (data.length > 0 && map) {
        const { lat, lon } = data[0]
        const newCenter: [number, number] = [Number.parseFloat(lat), Number.parseFloat(lon)]
        map.setView(newCenter, 13)
      } else if (data.length === 0) {
        setSearchError("No results found. Try a different search term.")
      }
    } catch (error) {
      console.error("Search error:", error)
      setSearchError("Search failed. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setSearchError(null)
  }

  const getEventMarkerColor = (status: string) => {
    switch (status) {
      case "live":
        return "#10b981" // green
      case "upcoming":
        return "#3b82f6" // blue
      default:
        return "#f59e0b" // orange
    }
  }

  const getUserLocationIcon = () =>
    LRef
      ? LRef.icon({
          iconUrl: `data:image/svg+xml;base64,${btoa(`
          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="8" fill="#3b82f6" stroke="#ffffff" strokeWidth="2"/>
            <circle cx="10" cy="10" r="3" fill="#ffffff"/>
          </svg>`)}`,
        })
      : undefined

  const getEventIcon = (event: Event) =>
    LRef
      ? LRef.icon({
          iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 12.5 41 12.5 41S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="${getEventMarkerColor(event.status)}" stroke="#ffffff" strokeWidth="2"/>
          <circle cx="12.5" cy="12.5" r="6" fill="#ffffff"/>
        </svg>`)}`,
        })
      : undefined

  const getSearchIcon = () =>
    LRef
      ? LRef.icon({
          iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 12.5 41 12.5 41S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="#ef4444" stroke="#ffffff" strokeWidth="2"/>
          <circle cx="12.5" cy="12.5" r="6" fill="#ffffff"/>
        </svg>`)}`,
        })
      : undefined

  const getTileLayerUrl = () => {
    if (mapStyle === "3d") {
      // MapTiler 3D tiles (requires API key in production)
      return mapTheme === "dark"
        ? "https://api.maptiler.com/maps/streets-v2-dark/{z}/{x}/{y}.png?key=demo"
        : "https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=demo"
    } else {
      // OpenStreetMap tiles with custom dark theme
      return mapTheme === "dark"
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    }
  }

  const getTileLayerAttribution = () => {
    if (mapStyle === "3d") {
      return '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    } else {
      return mapTheme === "dark"
        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  }

  if (!leafletLoaded) {
    return (
      <Card className="h-96 bg-gray-800 border-gray-700 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-2 text-gray-400 animate-spin" />
          <p className="text-gray-400">Loading map...</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search Form */}
      <Card className="bg-gray-800 border-gray-700">
        <div className="p-4">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for locations..."
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  disabled={isSearching}
                />
              </div>
              <Button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
              </Button>
              {(searchQuery || searchResults.length > 0) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearSearch}
                  className="border-gray-600 text-gray-300 bg-transparent"
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Map Controls */}
            <div className="flex gap-2 flex-wrap">
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant={mapStyle === "2d" ? "default" : "outline"}
                  onClick={() => setMapStyle("2d")}
                  className={mapStyle === "2d" ? "bg-green-600 hover:bg-green-700" : "border-gray-600 bg-transparent"}
                >
                  <MapIcon className="w-4 h-4 mr-1" />
                  2D
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={mapStyle === "3d" ? "default" : "outline"}
                  onClick={() => setMapStyle("3d")}
                  className={mapStyle === "3d" ? "bg-green-600 hover:bg-green-700" : "border-gray-600 bg-transparent"}
                >
                  <Layers className="w-4 h-4 mr-1" />
                  3D
                </Button>
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant={mapTheme === "dark" ? "default" : "outline"}
                  onClick={() => setMapTheme("dark")}
                  className={mapTheme === "dark" ? "bg-gray-600 hover:bg-gray-700" : "border-gray-600 bg-transparent"}
                >
                  Dark
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={mapTheme === "light" ? "default" : "outline"}
                  onClick={() => setMapTheme("light")}
                  className={mapTheme === "light" ? "bg-gray-600 hover:bg-gray-700" : "border-gray-600 bg-transparent"}
                >
                  Light
                </Button>
              </div>
            </div>

            {/* Search Error */}
            {searchError && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{searchError}</span>
              </div>
            )}

            {/* Search Results Count */}
            {searchResults.length > 0 && (
              <div className="text-sm text-gray-400">
                Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
              </div>
            )}
          </form>
        </div>
      </Card>

      {/* Map */}
      <Card className="bg-gray-800 border-gray-700 overflow-hidden">
        <div className="h-96 relative">
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
            whenCreated={setMap}
            className={mapTheme === "dark" ? "dark-map" : ""}
          >
            <TileLayer
              attribution={getTileLayerAttribution()}
              url={getTileLayerUrl()}
              className={mapTheme === "dark" ? "dark-tiles" : ""}
            />

            {/* User Location Marker */}
            {userLocation && (
              <Marker position={userLocation} icon={getUserLocationIcon()}>
                <Popup>
                  <div className="text-center">
                    <strong>Your Location</strong>
                    <br />
                    <small>
                      {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                    </small>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Event Markers */}
            {events.map((event) => (
              <Marker
                key={event.id}
                position={event.coordinates}
                icon={getEventIcon(event)}
                eventHandlers={{
                  click: () => onEventSelect(event),
                }}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <h3 className="font-semibold text-gray-900 mb-1">{event.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{event.location}</p>
                    <div className="flex justify-between items-center mb-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs text-white ${
                          event.type === "public"
                            ? "bg-green-600"
                            : event.type === "invite-only"
                              ? "bg-orange-600"
                              : "bg-blue-600"
                        }`}
                      >
                        {event.type}
                      </Badge>
                      <span
                        className={`text-xs ${
                          event.status === "live"
                            ? "text-green-600"
                            : event.status === "upcoming"
                              ? "text-blue-600"
                              : "text-orange-600"
                        }`}
                      >
                        {event.time}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{event.attendees} attending</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Search Result Markers */}
            {searchResults.map((result, index) => (
              <Marker
                key={`search-${result.place_id || index}`}
                position={[Number.parseFloat(result.lat), Number.parseFloat(result.lon)]}
                icon={getSearchIcon()}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <h3 className="font-semibold text-gray-900 mb-1">Search Result</h3>
                    <p className="text-sm text-gray-600">{result.display_name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {Number.parseFloat(result.lat).toFixed(4)}, {Number.parseFloat(result.lon).toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-90 rounded-lg p-3 text-xs text-white">
            <h4 className="font-semibold mb-2">Legend</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Your Location</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Live Events</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span>Upcoming Events</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Scheduled Events</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Search Results</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export function LeafletMap(props: LeafletMapProps) {
  return <MapComponent {...props} />
}
