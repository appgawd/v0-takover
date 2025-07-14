import { useState } from "react"

interface SearchResult {
  lat: number
  lon: number
  display_name: string
}

export function useMapSearch() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchLocation = async (query: string) => {
    if (!query) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
      )
      if (!response.ok) {
        throw new Error("Failed to fetch search results")
      }
      const data: SearchResult[] = await response.json()
      setSearchResults(data)
    } catch (err) {
      setError("An error occurred while searching. Please try again.")
      console.error("Search error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return { searchLocation, searchResults, isLoading, error }
}
