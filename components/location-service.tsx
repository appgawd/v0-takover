"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LocationState {
  coordinates: [number, number] | null
  accuracy: number | null
  timestamp: number | null
  error: string | null
  status: "idle" | "requesting" | "granted" | "denied"
}

interface LocationServiceProps {
  onLocationUpdate: (location: [number, number] | null) => void
  onLocationError: (error: string) => void
}

export function LocationService({ onLocationUpdate, onLocationError }: LocationServiceProps) {
  const [locationState, setLocationState] = useState<LocationState>({
    coordinates: null,
    accuracy: null,
    timestamp: null,
    error: null,
    status: "idle",
  })

  useEffect(() => {
    if (locationState.status === "granted" && locationState.coordinates) {
      onLocationUpdate(locationState.coordinates)
    } else if (locationState.status === "denied" && locationState.error) {
      onLocationError(locationState.error)
    }
  }, [locationState, onLocationUpdate, onLocationError])

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationState((prev) => ({
        ...prev,
        status: "denied",
        error: "Geolocation is not supported by your browser",
      }))
      return
    }

    setLocationState((prev) => ({
      ...prev,
      status: "requesting",
      error: null,
    }))

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 300000, // 5 minutes
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationState({
          coordinates: [position.coords.longitude, position.coords.latitude],
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          error: null,
          status: "granted",
        })
      },
      (error) => {
        let errorMessage = "An error occurred while getting your location."
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Your location is currently unavailable."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out."
            break
        }

        setLocationState((prev) => ({
          ...prev,
          status: "denied",
          error: errorMessage,
        }))
      },
      options,
    )
  }

  return (
    <div>
      <Button onClick={requestLocation} disabled={locationState.status === "requesting"}>
        {locationState.status === "requesting" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Getting Location
          </>
        ) : (
          "Get My Location"
        )}
      </Button>
    </div>
  )
}
