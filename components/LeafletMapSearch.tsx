"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { Icon } from "leaflet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Leaflet CSS
import "leaflet/dist/leaflet.css"

// Custom marker icon
const customIcon = new Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

// Component to update map view
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  map.setView(center, zoom)
  return null
}

interface SearchResult {
  lat: string
  lon: string
  display_name: string
}

export function LeafletMapSearch() {
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09])
  const [mapZoom, setMapZoom] = useState(13)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
      )
      if (!response.ok) {
        throw new Error("Failed to fetch search results")
      }
      const data: SearchResult[] = await response.json()
      setSearchResults(data)
      if (data.length > 0) {
        const { lat, lon } = data[0]
        setMapCenter([Number.parseFloat(lat), Number.parseFloat(lon)])
        setMapZoom(13)
      }
    } catch (err) {
      setError("An error occurred while searching. Please try again.")
      console.error("Search error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSearch} className="mb-4 flex gap-2">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location..."
            className="flex-grow"
            aria-label="Search for a location"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </form>

        {error && (
          <p className="text-red-500 mb-2" role="alert">
            {error}
          </p>
        )}

        <div className="h-[400px] w-full">
          <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: "100%", width: "100%" }}>
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {searchResults.map((result, index) => (
              <Marker
                key={index}
                position={[Number.parseFloat(result.lat), Number.parseFloat(result.lon)]}
                icon={customIcon}
              >
                <Popup>{result.display_name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}
