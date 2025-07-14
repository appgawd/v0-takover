"use client"

import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Loader2,
  AlertCircle,
  Layers,
  MapIcon,
  Plus,
  Minus,
  Navigation,
  Building,
  MapPin,
  RouteIcon as Road,
  AlertTriangle,
  Gauge,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react"

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
}

interface SearchResult {
  id: string
  place_name: string
  center: [number, number]
  place_type: string[]
}

// ────────────────────────────────────────────────────────────────────────────────
// Utility helpers – safely interact with a layer if it exists
const safeSetPaint = (mp: any, layerId: string, prop: string, value: any) => {
  if (mp?.getLayer(layerId)) {
    mp.setPaintProperty(layerId, prop, value)
  }
}

const safeSetFilter = (mp: any, layerId: string, filter: any) => {
  if (mp?.getLayer(layerId)) {
    mp.setFilter(layerId, filter)
  }
}

const safeAddLayer = (mp: any, layer: any) => {
  if (mp && !mp.getLayer(layer.id)) {
    mp.addLayer(layer)
  }
}

export function MapboxMap({ events, userLocation, onEventSelect }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const clickTimeout = useRef<NodeJS.Timeout | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [mapStyle, setMapStyle] = useState<"2d" | "3d">("2d")
  const [mapView, setMapView] = useState<"streets" | "satellite" | "hybrid">("streets")
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [buildingsVisible, setBuildingsVisible] = useState(true)
  const [selectedBuildings, setSelectedBuildings] = useState<Set<string>>(new Set())
  const [hoveredFeature, setHoveredFeature] = useState<any>(null)
  const [mapboxToken, setMapboxToken] = useState<string>("")
  const [mapboxgl, setMapboxgl] = useState<any>(null)

  // Fetch token from server
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("/api/mapbox-token")
        const { token } = (await res.json()) as { token: string }

        // NEW: validate token -------------------------------------------------
        if (!token || token.trim() === "") {
          setLoadError("Missing Mapbox access token. Define NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your environment.")
          setIsLoading(false)
          return
        }
        // --------------------------------------------------------------------

        setMapboxToken(token)
      } catch (e) {
        console.error("Could not fetch Mapbox token:", e)
        setLoadError("Failed to load map (token fetch error).")
        setIsLoading(false)
      }
    }
    fetchToken()
  }, [])

  const getMapStyle = () => {
    switch (mapView) {
      case "satellite":
        return "mapbox://styles/mapbox/satellite-v9"
      case "hybrid":
        return "mapbox://styles/mapbox/satellite-streets-v12"
      case "streets":
      default:
        return mapView === "streets" ? tronDarkStyle : "mapbox://styles/mapbox/light-v11"
    }
  }

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
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": "#0a0a0f",
        },
      },
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
      {
        id: "land",
        type: "fill",
        source: "mapbox-streets",
        "source-layer": "landuse",
        paint: {
          "fill-color": "#0f0f1a",
        },
      },
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
      {
        id: "building",
        type: "fill-extrusion",
        source: "mapbox-streets",
        "source-layer": "building",
        paint: {
          "fill-extrusion-color": "#1a1a2e",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "min_height"],
          "fill-extrusion-opacity": buildingsVisible ? 0.8 : 0,
          "fill-extrusion-vertical-gradient": true,
        },
      },
      {
        id: "building-hover",
        type: "fill-extrusion",
        source: "mapbox-streets",
        "source-layer": "building",
        filter: ["==", ["get", "id"], ""],
        paint: {
          "fill-extrusion-color": "#ffff00",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "min_height"],
          "fill-extrusion-opacity": 0.7,
        },
      },
      {
        id: "building-selected",
        type: "fill-extrusion",
        source: "mapbox-streets",
        "source-layer": "building",
        filter: ["in", ["get", "id"], ["literal", []]], // Corrected filter
        paint: {
          "fill-extrusion-color": "#00ffff",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "min_height"],
          "fill-extrusion-opacity": 0.9,
        },
      },
      {
        id: "road-hover",
        type: "line",
        source: "mapbox-streets",
        "source-layer": "road",
        filter: ["==", ["get", "id"], ""],
        paint: {
          "line-color": "#ffff00",
          "line-width": {
            base: 1.2,
            stops: [
              [6, 2],
              [20, 40],
            ],
          },
          "line-opacity": 0.8,
        },
      },
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
      {
        id: "poi-labels",
        type: "symbol",
        source: "mapbox-streets",
        "source-layer": "poi_label",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
          "text-size": 10,
          "icon-image": ["get", "maki"],
          "icon-size": 0.8,
          "text-anchor": "top",
          "text-offset": [0, 0.8],
        },
        paint: {
          "text-color": "#00ccff",
          "text-halo-color": "#0a0a0f",
          "text-halo-width": 1,
          "icon-opacity": 0.8,
        },
      },
    ],
  }

  const addInteractionLayers = () => {
    if (!map.current) return

    // Only add interaction layers if the current map style supports them (i.e., has vector building/road data)
    // The 'streets' (tronDarkStyle) already defines these layers.
    // 'hybrid' (satellite-streets-v12) uses 'composite' source for vector data.
    // 'satellite' (satellite-v9) does NOT have vector building/road data.
    if (mapView === "streets") {
      // Tron style already has the layers defined, ensure their visibility is correct
      safeSetPaint(map.current, "building", "fill-extrusion-opacity", buildingsVisible ? 0.8 : 0)
      updateSelectedBuildingsFilter() // Ensure selected buildings filter is applied
      return
    }

    if (mapView === "satellite") {
      // No vector layers for interaction in satellite view
      return
    }

    // For hybrid view, add interaction layers using 'composite' source
    const buildingHoverLayer = {
      id: "building-hover",
      type: "fill-extrusion",
      source: "composite",
      "source-layer": "building",
      filter: ["==", ["get", "id"], ""],
      paint: {
        "fill-extrusion-color": "#ffff00",
        "fill-extrusion-height": ["case", ["has", "height"], ["get", "height"], 10],
        "fill-extrusion-base": ["case", ["has", "min_height"], ["get", "min_height"], 0],
        "fill-extrusion-opacity": 0.7,
      },
    }

    const buildingSelectedLayer = {
      id: "building-selected",
      type: "fill-extrusion",
      source: "composite",
      "source-layer": "building",
      filter: ["in", ["get", "id"], ["literal", []]], // Corrected initial filter
      paint: {
        "fill-extrusion-color": "#00ffff",
        "fill-extrusion-height": ["case", ["has", "height"], ["get", "height"], 10],
        "fill-extrusion-base": ["case", ["has", "min_height"], ["get", "min_height"], 0],
        "fill-extrusion-opacity": 0.9,
      },
    }

    const roadHoverLayer = {
      id: "road-hover",
      type: "line",
      source: "composite",
      "source-layer": "road",
      filter: ["==", ["get", "id"], ""],
      paint: {
        "line-color": "#ffff00",
        "line-width": {
          base: 1.2,
          stops: [
            [6, 2],
            [20, 40],
          ],
        },
        "line-opacity": 0.8,
      },
    }

    safeAddLayer(map.current, buildingHoverLayer)
    safeAddLayer(map.current, buildingSelectedLayer)
    safeAddLayer(map.current, roadHoverLayer)

    // Also ensure the building visibility and selected filter are applied for hybrid view
    safeSetPaint(map.current, "building", "fill-extrusion-opacity", buildingsVisible ? 0.8 : 0)
    updateSelectedBuildingsFilter()
  }

  const updateSelectedBuildingsFilter = () => {
    if (!map.current) return

    const selectedArray = Array.from(selectedBuildings)
    if (selectedArray.length > 0) {
      safeSetFilter(map.current, "building-selected", ["in", ["get", "id"], ["literal", selectedArray]])
    } else {
      safeSetFilter(map.current, "building-selected", ["in", ["get", "id"], ["literal", []]]) // Ensure filter is always valid
    }
  }

  // Initialise map when token is available
  useEffect(() => {
    if (!mapboxToken || loadError) return //  <-- added loadError check
    if (map.current) return
    if (!mapContainer.current) return

    const initializeMap = async () => {
      try {
        const { default: mapboxglLib } = await import("mapbox-gl")
        setMapboxgl(mapboxglLib)

        if (!document.querySelector('link[href*="mapbox-gl.css"]')) {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css"
          document.head.appendChild(link)
        }

        mapboxglLib.accessToken = mapboxToken

        const initialCenter: [number, number] = userLocation || [-118.2437, 34.0522]

        map.current = new mapboxglLib.Map({
          container: mapContainer.current,
          style: getMapStyle(),
          center: initialCenter,
          zoom: userLocation ? 13 : 11,
          pitch: mapStyle === "3d" ? 45 : 0,
          bearing: mapStyle === "3d" ? -17.6 : 0,
          antialias: true,
        })

        map.current.on("load", () => {
          addInteractionLayers()

          // Add user location marker
          if (userLocation) {
            const userMarker = new mapboxglLib.Marker({
              color: "#00ffff",
              scale: 1.2,
            })
              .setLngLat(userLocation)
              .setPopup(
                new mapboxglLib.Popup().setHTML(`
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

            const marker = new mapboxglLib.Marker({
              color: color,
              scale: 1.5,
            })
              .setLngLat(event.coordinates)
              .setPopup(
                new mapboxglLib.Popup().setHTML(`
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

          // Building hover effects
          map.current.on("mouseenter", "building", (e: any) => {
            map.current.getCanvas().style.cursor = "pointer"
            const feature = e.features[0]
            const featureId = feature.id || feature.properties.id || `${feature.properties.osm_id || Math.random()}`

            setHoveredFeature(feature)
            safeSetFilter(map.current, "building-hover", ["==", ["get", "id"], featureId])
          })

          map.current.on("mouseleave", "building", () => {
            map.current.getCanvas().style.cursor = ""
            setHoveredFeature(null)
            safeSetFilter(map.current, "building-hover", ["==", ["get", "id"], ""])
          })

          // Road hover effects
          map.current.on("mouseenter", "road", (e: any) => {
            map.current.getCanvas().style.cursor = "pointer"
            const feature = e.features[0]
            const featureId = feature.id || feature.properties.id || `${feature.properties.osm_id || Math.random()}`

            setHoveredFeature(feature)
            safeSetFilter(map.current, "road-hover", ["==", ["get", "id"], featureId])
          })

          map.current.on("mouseleave", "road", () => {
            map.current.getCanvas().style.cursor = ""
            setHoveredFeature(null)
            safeSetFilter(map.current, "road-hover", ["==", ["get", "id"], ""])
          })

          // POI hover effects
          map.current.on("mouseenter", "poi-labels", (e: any) => {
            map.current.getCanvas().style.cursor = "pointer"
            setHoveredFeature(e.features[0])
          })

          map.current.on("mouseleave", "poi-labels", () => {
            map.current.getCanvas().style.cursor = ""
            setHoveredFeature(null)
          })

          // Building click handlers
          map.current.on("click", "building", (e: any) => {
            const feature = e.features[0]
            const featureId = feature.id || feature.properties.id || `${feature.properties.osm_id || Math.random()}`

            if (clickTimeout.current) {
              clearTimeout(clickTimeout.current)
              clickTimeout.current = null

              // Double click - show detailed info
              new mapboxglLib.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`
                <div style="color: #00ffff; background: #0a0a0f; padding: 15px; border-radius: 8px; max-width: 300px;">
                  <h3 style="margin: 0 0 8px 0; color: #00ffff;">🏢 Building Details</h3>
                  <div style="margin-bottom: 8px;">
                    <strong>Height:</strong> ${feature.properties.height || "Unknown"}
                  </div>
                  <div style="margin-bottom: 8px;">
                    <strong>Type:</strong> ${feature.properties.type || "Building"}
                  </div>
                  <div style="margin-bottom: 8px;">
                    <strong>Levels:</strong> ${feature.properties.levels || "Unknown"}
                  </div>
                  <div style="margin-bottom: 8px;">
                    <strong>Address:</strong> ${feature.properties.address || "Not available"}
                  </div>
                  <div style="margin-bottom: 8px;">
                    <strong>ID:</strong> ${featureId}
                  </div>
                  <div style="font-size: 12px; color: #888; margin-top: 10px;">
                    Double-click to view details • Single-click to toggle selection
                  </div>
                </div>
              `)
                .addTo(map.current)
            } else {
              // Single click - toggle selection
              clickTimeout.current = setTimeout(() => {
                setSelectedBuildings((prev) => {
                  const newSet = new Set(prev)
                  if (newSet.has(featureId)) {
                    newSet.delete(featureId)
                  } else {
                    newSet.add(featureId)
                  }
                  return newSet
                })
                clickTimeout.current = null
              }, 300)
            }
          })

          // Road click handlers
          map.current.on("click", "road", (e: any) => {
            const feature = e.features[0]

            if (clickTimeout.current) {
              clearTimeout(clickTimeout.current)
              clickTimeout.current = null

              // Double click - show detailed info
              new mapboxglLib.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`
                <div style="color: #00ffff; background: #0a0a0f; padding: 15px; border-radius: 8px; max-width: 300px;">
                  <h3 style="margin: 0 0 8px 0; color: #00ffff;">🛣️ Road Details</h3>
                  <div style="margin-bottom: 8px;">
                    <strong>Name:</strong> ${feature.properties.name || "Unnamed Road"}
                  </div>
                  <div style="margin-bottom: 8px;">
                    <strong>Class:</strong> ${feature.properties.class || "Unknown"}
                  </div>
                  <div style="margin-bottom: 8px;">
                    <strong>Type:</strong> ${feature.properties.type || "Road"}
                  </div>
                  <div style="margin-bottom: 8px;">
                    <strong>Surface:</strong> ${feature.properties.surface || "Unknown"}
                  </div>
                  <div style="margin-bottom: 8px;">
                    <strong>Max Speed:</strong> ${feature.properties.maxspeed || "Unknown"}
                  </div>
                  <div style="font-size: 12px; color: #888; margin-top: 10px;">
                    Double-click to view details • Hover to highlight
                  </div>
                </div>
              `)
                .addTo(map.current)
            } else {
              clickTimeout.current = setTimeout(() => {
                clickTimeout.current = null
              }, 300)
            }
          })

          // POI click handlers
          map.current.on("click", "poi-labels", (e: any) => {
            const feature = e.features[0]

            new mapboxglLib.Popup()
              .setLngLat(e.lngLat)
              .setHTML(`
              <div style="color: #00ffff; background: #0a0a0f; padding: 15px; border-radius: 8px; max-width: 300px;">
                <h3 style="margin: 0 0 8px 0; color: #00ffff;">📍 ${feature.properties.name || "Point of Interest"}</h3>
                <div style="margin-bottom: 8px;">
                  <strong>Category:</strong> ${feature.properties.class || "Unknown"}
                </div>
                <div style="margin-bottom: 8px;">
                  <strong>Type:</strong> ${feature.properties.type || "POI"}
                </div>
                ${feature.properties.address ? `<div style="margin-bottom: 8px;"><strong>Address:</strong> ${feature.properties.address}</div>` : ""}
                ${feature.properties.phone ? `<div style="margin-bottom: 8px;"><strong>Phone:</strong> ${feature.properties.phone}</div>` : ""}
                <div style="font-size: 12px; color: #888; margin-top: 10px;">
                  Point of Interest
                </div>
              </div>
            `)
              .addTo(map.current)
          })

          setIsLoading(false)
        })

        map.current.on("error", (e: any) => {
          const msg = e?.error?.message ?? "Unknown Mapbox error. Check the console for details."
          console.error("Mapbox error:", e.error ?? e)
          setLoadError(
            msg.includes("access token") ? "Invalid Mapbox token. Double-check NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN." : msg,
          )
          setIsLoading(false)
        })
      } catch (error) {
        console.error("Failed to load Mapbox:", error)
        setLoadError("Failed to load map. Please refresh the page.")
        setIsLoading(false)
      }
    }

    initializeMap()

    return () => {
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current)
      }
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [mapboxToken, userLocation, events, onEventSelect, mapStyle, mapView, buildingsVisible, selectedTool])

  // Update selected buildings filter when selection changes
  useEffect(() => {
    updateSelectedBuildingsFilter()
  }, [selectedBuildings])

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

  // Update map style when view changes
  useEffect(() => {
    if (!map.current || !mapboxgl) return

    const styleUrl = getMapStyle()
    map.current.setStyle(styleUrl)

    map.current.once("style.load", () => {
      addInteractionLayers()
      updateSelectedBuildingsFilter()
    })
  }, [mapView, mapboxgl, buildingsVisible, selectedBuildings]) // Added buildingsVisible and selectedBuildings to dependencies

  const runSearch = useCallback(
    async (query: string) => {
      if (!mapboxToken) return
      setIsSearching(true)
      setSearchError(null)

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=5`,
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
    },
    [mapboxToken],
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      runSearch(searchQuery.trim())
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setSearchError(null)
  }

  const zoomIn = () => {
    if (map.current) {
      map.current.zoomIn()
    }
  }

  const zoomOut = () => {
    if (map.current) {
      map.current.zoomOut()
    }
  }

  const resetBearing = () => {
    if (map.current) {
      map.current.easeTo({ bearing: 0, pitch: mapStyle === "3d" ? 45 : 0 })
    }
  }

  const toggleBuildings = () => {
    setBuildingsVisible((prev) => {
      const next = !prev
      safeSetPaint(map.current, "building", "fill-extrusion-opacity", next ? 0.8 : 0)
      return next
    })
  }

  const selectTool = (tool: string) => {
    setSelectedTool(selectedTool === tool ? null : tool)
  }

  const clearSelectedBuildings = () => {
    setSelectedBuildings(new Set())
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

            {/* Map View Controls */}
            <div className="flex gap-2 flex-wrap">
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant={mapView === "streets" ? "default" : "outline"}
                  onClick={() => setMapView("streets")}
                  className={
                    mapView === "streets"
                      ? "bg-cyan-600 hover:bg-cyan-500 text-gray-900"
                      : "border-cyan-500/30 bg-transparent text-cyan-300 hover:bg-cyan-500/10"
                  }
                >
                  Streets
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={mapView === "satellite" ? "default" : "outline"}
                  onClick={() => setMapView("satellite")}
                  className={
                    mapView === "satellite"
                      ? "bg-cyan-600 hover:bg-cyan-500 text-gray-900"
                      : "border-cyan-500/30 bg-transparent text-cyan-300 hover:bg-cyan-500/10"
                  }
                >
                  Satellite
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={mapView === "hybrid" ? "default" : "outline"}
                  onClick={() => setMapView("hybrid")}
                  className={
                    mapView === "hybrid"
                      ? "bg-cyan-600 hover:bg-cyan-500 text-gray-900"
                      : "border-cyan-500/30 bg-transparent text-cyan-300 hover:bg-cyan-500/10"
                  }
                >
                  Hybrid
                </Button>
              </div>

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

              {selectedBuildings.size > 0 && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={clearSelectedBuildings}
                  className="border-red-500/30 text-red-300 bg-transparent hover:bg-red-500/10"
                >
                  Clear Selected ({selectedBuildings.size})
                </Button>
              )}
            </div>

            {/* Interaction Tools */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              <Button
                type="button"
                size="sm"
                variant={selectedTool === "address" ? "default" : "outline"}
                onClick={() => selectTool("address")}
                className={`flex flex-col items-center p-3 h-auto ${
                  selectedTool === "address"
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "border-cyan-500/30 bg-transparent text-cyan-300 hover:bg-cyan-500/10"
                }`}
              >
                <MapPin className="w-5 h-5 mb-1" />
                <span className="text-xs">Address</span>
              </Button>

              <Button
                type="button"
                size="sm"
                variant={selectedTool === "building" ? "default" : "outline"}
                onClick={() => selectTool("building")}
                className={`flex flex-col items-center p-3 h-auto ${
                  selectedTool === "building"
                    ? "bg-green-600 hover:bg-green-500 text-white"
                    : "border-cyan-500/30 bg-transparent text-cyan-300 hover:bg-cyan-500/10"
                }`}
              >
                <Building className="w-5 h-5 mb-1" />
                <span className="text-xs">Building</span>
              </Button>

              <Button
                type="button"
                size="sm"
                variant={selectedTool === "road" ? "default" : "outline"}
                onClick={() => selectTool("road")}
                className={`flex flex-col items-center p-3 h-auto ${
                  selectedTool === "road"
                    ? "bg-orange-600 hover:bg-orange-500 text-white"
                    : "border-cyan-500/30 bg-transparent text-cyan-300 hover:bg-cyan-500/10"
                }`}
              >
                <Road className="w-5 h-5 mb-1" />
                <span className="text-xs">Road</span>
              </Button>

              <Button
                type="button"
                size="sm"
                variant={selectedTool === "speed" ? "default" : "outline"}
                onClick={() => selectTool("speed")}
                className={`flex flex-col items-center p-3 h-auto ${
                  selectedTool === "speed"
                    ? "bg-red-600 hover:bg-red-500 text-white"
                    : "border-cyan-500/30 bg-transparent text-cyan-300 hover:bg-cyan-500/10"
                }`}
              >
                <Gauge className="w-5 h-5 mb-1" />
                <span className="text-xs">Speed</span>
              </Button>

              <Button
                type="button"
                size="sm"
                variant={selectedTool === "incident" ? "default" : "outline"}
                onClick={() => selectTool("incident")}
                className={`flex flex-col items-center p-3 h-auto ${
                  selectedTool === "incident"
                    ? "bg-yellow-600 hover:bg-yellow-500 text-white"
                    : "border-cyan-500/30 bg-transparent text-cyan-300 hover:bg-cyan-500/10"
                }`}
              >
                <AlertTriangle className="w-5 h-5 mb-1" />
                <span className="text-xs">Incident</span>
              </Button>

              <Button
                type="button"
                size="sm"
                variant={selectedTool === "clearance" ? "default" : "outline"}
                onClick={() => selectTool("clearance")}
                className={`flex flex-col items-center p-3 h-auto ${
                  selectedTool === "clearance"
                    ? "bg-purple-600 hover:bg-purple-500 text-white"
                    : "border-cyan-500/30 bg-transparent text-cyan-300 hover:bg-cyan-500/10"
                }`}
              >
                <Shield className="w-5 h-5 mb-1" />
                <span className="text-xs">Clearance</span>
              </Button>
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

            {/* Hover Info */}
            {hoveredFeature && (
              <div className="text-sm text-yellow-400 bg-yellow-500/10 p-2 rounded">
                <strong>Hovering:</strong>{" "}
                {hoveredFeature.properties.name ||
                  hoveredFeature.properties.class ||
                  hoveredFeature.properties.type ||
                  "Feature"}
                {hoveredFeature.source === "building" && " (Building)"}
                {hoveredFeature.source === "road" && " (Road)"}
              </div>
            )}

            {/* Selected Tool Info */}
            {selectedTool && (
              <div className="text-sm text-cyan-400 bg-cyan-500/10 p-2 rounded">
                <strong>{selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1)} Tool Active:</strong>{" "}
                {selectedTool === "building" && "Hover to highlight • Click to select • Double-click for details"}
                {selectedTool === "address" && "Click on the map to get address information"}
                {selectedTool === "road" && "Hover to highlight • Double-click for road details"}
                {selectedTool === "speed" && "Click to view speed limit information"}
                {selectedTool === "incident" && "Click to report or view incidents"}
                {selectedTool === "clearance" && "Click to view clearance information"}
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
                <p className="text-cyan-300">Loading enhanced map interface...</p>
              </div>
            </div>
          )}

          {/* Map Controls - Right Side */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              onClick={resetBearing}
              size="sm"
              className="bg-gray-900/90 hover:bg-gray-800 text-cyan-300 border border-cyan-500/30 backdrop-blur-sm"
            >
              <Navigation className="w-4 h-4" />
            </Button>
            <Button
              onClick={zoomIn}
              size="sm"
              className="bg-gray-900/90 hover:bg-gray-800 text-cyan-300 border border-cyan-500/30 backdrop-blur-sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              onClick={zoomOut}
              size="sm"
              className="bg-gray-900/90 hover:bg-gray-800 text-cyan-300 border border-cyan-500/30 backdrop-blur-sm"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              onClick={toggleBuildings}
              size="sm"
              className="bg-gray-900/90 hover:bg-gray-800 text-cyan-300 border border-cyan-500/30 backdrop-blur-sm"
            >
              {buildingsVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>

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
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded shadow-lg shadow-yellow-400/50"></div>
                <span className="text-yellow-300">Hover Highlight</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-cyan-400 rounded shadow-lg shadow-cyan-400/50"></div>
                <span className="text-cyan-300">Selected ({selectedBuildings.size})</span>
              </div>
            </div>
          </div>

          {/* Interaction Instructions */}
          <div className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/30 max-w-xs">
            <div className="text-xs font-semibold mb-2 text-cyan-400 uppercase tracking-wider">Interactions</div>
            <div className="space-y-1 text-xs text-cyan-300">
              <div>• Hover: Highlight buildings/roads</div>
              <div>• Single Click: Toggle building selection</div>
              <div>• Double Click: View detailed info</div>
              <div>• POI Click: Show point details</div>
            </div>
          </div>

          {/* Tron-style corner decorations */}
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400/60 pointer-events-none"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400/60 pointer-events-none"></div>
        </div>
      </Card>
    </div>
  )
}
