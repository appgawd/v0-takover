"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2, AlertCircle, Layers, MapIcon } from "lucide-react"

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

interface MapboxMapProps {
  events: Event[]
  userLocation: [number, number] | null
  onEventSelect: (event: Event | null) => void
  selectedEvent: Event | null
}

interface SearchResult {
  id: string
  place_name: string
  center: [number, number]
  place_type: string[]
}

export function MapboxMap({ events, userLocation, onEventSelect, selectedEvent }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [mapStyle, setMapStyle] = useState<"2d" | "3d">("2d")
  const [mapTheme, setMapTheme] = useState<"dark" | "light">("dark")
  const [mapboxgl, setMapboxgl] = useState<any>(null)

  // Tron-like dark style configuration
  const tronDarkStyle = {
    version: 8,
    name: "Tron Dark",
    sprite: "mapbox://sprites/mapbox/dark-v11",
    glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
    sources: {
      "mapbox-streets": {
        type: "vector",
        url: "mapbox://mapbox.mapbox-streets-v8",
      },
    },
    layers: [
      // Background
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": "#0a0a0f",
        },
      },
      // Water
      {
        id: "water",
        type: "fill",
        source: "mapbox-streets",
        "source-layer": "water",
        paint: {
          "fill-color": "#001122",
          "fill-outline-color": "#00ffff",
        },
      },
      // Land
      {
        id: "land",
        type: "fill",
        source: "mapbox-streets",
        "source-layer": "landuse",
        paint: {
          "fill-color": "#0f0f1a",
        },
      },
      // Roads - Major highways
      {
        id: "road-highway",
        type: "line",
        source: "mapbox-streets",
        "source-layer": "road",
        filter: ["==", "class", "motorway"],
        paint: {
          "line-color": "#00ffff",
          "line-width": {
            base: 1.2,
            stops: [
              [6, 0.5],
              [20, 30],
            ],
          },
          "line-opacity": 0.8,
        },
      },
      // Roads - Primary
      {
        id: "road-primary",
        type: "line",
        source: "mapbox-streets",
        "source-layer": "road",
        filter: ["==", "class", "primary"],
        paint: {
          "line-color": "#0099ff",
          "line-width": {
            base: 1.2,
            stops: [
              [6, 0.5],
              [20, 20],
            ],
          },
          "line-opacity": 0.7,
        },
      },
      // Roads - Secondary
      {
        id: "road-secondary",
        type: "line",
        source: "mapbox-streets",
        "source-layer": "road",
        filter: ["in", "class", "secondary", "tertiary"],
        paint: {
          "line-color": "#0066cc",
          "line-width": {
            base: 1.2,
            stops: [
              [6, 0.5],
              [20, 15],
            ],
          },
          "line-opacity": 0.6,
        },
      },
      // Roads - Local
      {
        id: "road-local",
        type: "line",
        source: "mapbox-streets",
        "source-layer": "road",
        filter: ["in", "class", "street", "street_limited"],
        paint: {
          "line-color": "#003366",
          "line-width": {
            base: 1.2,
            stops: [
              [6, 0.5],
              [20, 10],
            ],
          },
          "line-opacity": 0.5,
        },
      },
      // Buildings
      {
        id: "building",
        type: "fill-extrusion",
        source: "mapbox-streets",
        "source-layer": "building",
        paint: {
          "fill-extrusion-color": "#1a1a2e",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "min_height"],
          "fill-extrusion-opacity": 0.8,
          "fill-extrusion-vertical-gradient": true,
        },
      },
      // Place labels
      {
        id: "place-labels",
        type: "symbol",
        source: "mapbox-streets",
        "source-layer": "place_label",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 12,
          "text-transform": "uppercase",
        },
        paint: {
          "text-color": "#00ffff",
          "text-halo-color": "#0a0a0f",
          "text-halo-width": 2,
        },
      },
    ],
  }

  const lightStyle = "mapbox://styles/mapbox/light-v11"

  useEffect(() => {
    const loadMapbox = async () => {
      try {
        const mapboxgl = await import("mapbox-gl")
        setMapboxgl(mapboxgl.default)

        // Load Mapbox CSS
        if (!document.querySelector('link[href*="mapbox-gl.css"]')) {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css"
          document.head.appendChild(link)
        }

        if (!mapContainer.current || map.current) return

        mapboxgl.default.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

        const initialCenter: [number, number] = userLocation || [-118.2437, 34.0522] // Default to LA

        map.current = new mapboxgl.default.Map({
          container: mapContainer.current,
          style: mapTheme === "dark" ? tronDarkStyle : lightStyle,
          center: initialCenter,
          zoom: userLocation ? 13 : 11,
          pitch: mapStyle === "3d" ? 45 : 0,
          bearing: mapStyle === "3d" ? -17.6 : 0,
          antialias: true,
        })

        map.current.on("load", () => {
          // Add user location marker
          if (userLocation) {
            const userMarker = new mapboxgl.default.Marker({
              color: "#00ffff",
              scale: 1.2,
            })
              .setLngLat(userLocation)
              .setPopup(
                new mapboxgl.default.Popup().setHTML(`
                <div style="color: #00ffff; background: #0a0a0f; padding: 10px; border-radius: 8px;">
                  <strong>📍 Your Location</strong><br>
                  <small>${userLocation[1].toFixed(4)}, ${userLocation[0].toFixed(4)}</small>
                </div>
              `),
              )
              .addTo(map.current)
          }

          // Add event markers
          events.forEach((event) => {
            const color = event.status === "live" ? "#00ff00" : event.status === "upcoming" ? "#0099ff" : "#ff6600"

            const marker = new mapboxgl.default.Marker({
              color: color,
              scale: 1.5,
            })
              .setLngLat(event.coordinates)
              .setPopup(
                new mapboxgl.default.Popup().setHTML(`
                <div style="color: #00ffff; background: #0a0a0f; padding: 15px; border-radius: 8px; min-width: 200px;">
                  <h3 style="margin: 0 0 8px 0; color: ${color};">${event.name}</h3>
                  <p style="margin: 0 0 4px 0;">📍 ${event.location}</p>
                  <p style="margin: 0 0 4px 0;">⏰ ${event.time}</p>
                  <p style="margin: 0 0 8px 0;">👥 ${event.attendees} attending</p>
                  <div style="
                    background: ${color};
                    color: #0a0a0f;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    display: inline-block;
                    font-weight: bold;
                  ">${event.type.toUpperCase()}</div>
                </div>
              `),
              )
              .addTo(map.current)

            marker.getElement().addEventListener("click", () => {
              onEventSelect(event)
            })
          })

          setIsLoading(false)
        })

        map.current.on("error", (e: any) => {
          console.error("Mapbox error:", e)
          setLoadError("Failed to load map. Please check your connection.")
          setIsLoading(false)
        })
      } catch (error) {
        console.error("Failed to load Mapbox:", error)
        setLoadError("Failed to load map. Please refresh the page.")
        setIsLoading(false)
      }
    }

    loadMapbox()

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [userLocation, events, onEventSelect])

  // Update map style when theme changes
  useEffect(() => {
    if (map.current) {
      const newStyle = mapTheme === "dark" ? tronDarkStyle : lightStyle
      map.current.setStyle(newStyle)
    }
  }, [mapTheme])

  // Update map pitch when 2D/3D changes
  useEffect(() => {
    if (map.current) {
      map.current.easeTo({
        pitch: mapStyle === "3d" ? 45 : 0,
        bearing: mapStyle === "3d" ? -17.6 : 0,
        duration: 1000,
      })
    }
  }, [mapStyle])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchError(null)

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&limit=5`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch search results")
      }

      const data = await response.json()
      setSearchResults(data.features || [])

      if (data.features && data.features.length > 0 && map.current) {
        const [lng, lat] = data.features[0].center
        map.current.flyTo({
          center: [lng, lat],
          zoom: 13,
          duration: 2000,
        })
      } else if (data.features && data.features.length === 0) {
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

  if (loadError) {
    return (
      <Card className="bg-red-900 border-red-700">
        <div className="p-4 text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
          <p className="text-red-200">{loadError}</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <Card className="bg-gray-900/90 border-cyan-500/30 backdrop-blur-sm">
        <div className="p-4">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search locations..."
                  className="pl-10 bg-gray-800/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-400/60 focus:border-cyan-400 focus:ring-cyan-400/20"
                  disabled={isSearching}
                />
              </div>
              <Button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="bg-cyan-600 hover:bg-cyan-500 text-gray-900 font-semibold"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
              </Button>
              {(searchQuery || searchResults.length > 0) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearSearch}
                  className="border-cyan-500/30 text-cyan-300 bg-transparent hover:bg-cyan-500/10"
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
                  className={
                    mapStyle === "2d"
                      ? "bg-cyan-600 hover:bg-cyan-500 text-gray-900"
                      : "border-cyan-500/30 bg-transparent text-cyan-300 hover:bg-cyan-500/10"
                  }
                >
                  <MapIcon className="w-4 h-4 mr-1" />
                  2D
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={mapStyle === "3d" ? "default" : "outline"}
                  onClick={() => setMapStyle("3d")}
                  className={
                    mapStyle === "3d"
                      ? "bg-cyan-600 hover:bg-cyan-500 text-gray-900"
                      : "border-cyan-500/30 bg-transparent text-cyan-300 hover:bg-cyan-500/10"
                  }
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
                  className={
                    mapTheme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600 text-cyan-300"
                      : "border-cyan-500/30 bg-transparent text-cyan-300 hover:bg-cyan-500/10"
                  }
                >
                  Dark
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={mapTheme === "light" ? "default" : "outline"}
                  onClick={() => setMapTheme("light")}
                  className={
                    mapTheme === "light"
                      ? "bg-gray-700 hover:bg-gray-600 text-cyan-300"
                      : "border-cyan-500/30 bg-transparent text-cyan-300 hover:bg-cyan-500/10"
                  }
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
              <div className="text-sm text-cyan-400">
                Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
              </div>
            )}
          </form>
        </div>
      </Card>

      {/* Map Container */}
      <Card className="bg-gray-900 border-cyan-500/30 overflow-hidden">
        <div className="relative h-96">
          <div ref={mapContainer} className="w-full h-full" style={{ minHeight: "384px" }} />

          {isLoading && (
            <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-cyan-400" />
                <p className="text-cyan-300">Loading tron map interface...</p>
              </div>
            </div>
          )}

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/30">
            <div className="text-xs font-semibold mb-2 text-cyan-400 uppercase tracking-wider">Legend</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
                <span className="text-green-300">Live Events</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                <span className="text-blue-300">Upcoming</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded-full shadow-lg shadow-orange-400/50"></div>
                <span className="text-orange-300">Scheduled</span>
              </div>
              {userLocation && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
                  <span className="text-cyan-300">Your Location</span>
                </div>
              )}
            </div>
          </div>

          {/* Tron-style corner decorations */}
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400/60"></div>
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400/60"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400/60"></div>
        </div>
      </Card>
    </div>
  )
}
