"use client"

import { useState } from "react"

interface LocationState {
  coordinates: [number, number] | null
  accuracy: number | null
  timestamp: number | null
  error: string | null
  status: "idle" | "requesting" | "granted" | "denied"
}

export function useLocationService() {
  const [locationState, setLocationState] = useState<LocationState>({
    coordinates: null,
    accuracy: null,
    timestamp: null,
    error: null,
    status: "idle",
  })

  const requestLocation = (options?: PositionOptions) => {
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

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 300000, // 5 minutes
      ...options,
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
      defaultOptions,
    )
  }

  const watchLocation = (options?: PositionOptions) => {
    if (!navigator.geolocation) {
      setLocationState((prev) => ({
        ...prev,
        status: "denied",
        error: "Geolocation is not supported by your browser",
      }))
      return null
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000, // 1 minute for watch
      ...options,
    }

    const watchId = navigator.geolocation.watchPosition(
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
        let errorMessage = "An error occurred while watching your location."
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
      defaultOptions,
    )

    return watchId
  }

  const clearWatch = (watchId: number) => {
    navigator.geolocation.clearWatch(watchId)
  }

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

  return {
    ...locationState,
    requestLocation,
    watchLocation,
    clearWatch,
    calculateDistance,
  }
}
