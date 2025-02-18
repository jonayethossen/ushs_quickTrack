import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import type { LatLngTuple, LatLngBounds } from 'leaflet'
import leaf from 'leaflet'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import polyline from 'polyline' // Import polyline library
import { endIcon, startIcon } from '@/constants'
import { Card } from './ui/card'

export interface Location {
  name: string
  coords: [number, number]
}

export interface LocationMapProps {
  startLocation: Location
  endLocation: Location
}

// Helper component to fit bounds dynamically
function ChangeView({ bounds }: { bounds: LatLngBounds }) {
  const map = useMap()
  map.fitBounds(bounds, { padding: [50, 50] })
  return null
}

export default function LocationMap({ startLocation, endLocation }: LocationMapProps) {
  const [route, setRoute] = useState<LatLngTuple[]>([])
  const [distance, setDistance] = useState<string>('')
  const [duration, setDuration] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchRoute = async () => {
      setIsLoading(true)
      setError('')

      const start = `${startLocation.coords[0]},${startLocation.coords[1]}` // lat, lng
      const end = `${endLocation.coords[0]},${endLocation.coords[1]}` // lat, lng

      try {
        const apiKey = import.meta.env.VITE_GRAPH_HOPPER_API_KEY
        if (!apiKey) return alert('GraphHopper API key not found!')

        const url = `https://graphhopper.com/api/1/route?point=${start}&point=${end}&vehicle=foot&locale=en&key=${apiKey}&instructions=false`

        const { data } = await axios.get(url)

        if (!data.paths || data.paths.length === 0) {
          setError('No route found!')
          return
        }

        const path = data.paths[0]

        // Decode the polyline points
        const decodedPoints = polyline.decode(path.points)

        const coordinates: LatLngTuple[] = decodedPoints.map((coord) => [coord[0], coord[1]])

        const distanceKm = (path.distance / 1000).toFixed(2)
        const durationMin = Math.round(path.time / 60000) // Convert ms to minutes

        setRoute(coordinates)
        setDistance(distanceKm)
        setDuration(durationMin.toString())
      } catch (err) {
        setError('Unable to calculate route. Please try again.')
        console.error('Error fetching route:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoute()
  }, [startLocation, endLocation])

  const bounds = leaf.latLngBounds([startLocation.coords, endLocation.coords])

  return (
    <div className="relative h-full">
      <MapContainer
        bounds={bounds}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView bounds={bounds} />
        <Marker position={startLocation.coords} icon={startIcon}>
          <Popup>{startLocation.name}</Popup>
        </Marker>
        <Marker position={endLocation.coords} icon={endIcon}>
          <Popup>{endLocation.name}</Popup>
        </Marker>
        {route.length > 0 && <Polyline positions={route} color="blue" weight={4} opacity={0.6} />}
      </MapContainer>

      {/* Route Info Overlay */}
      <Card className="absolute top-4 right-4 p-4 z-[1000] bg-white/90 backdrop-blur-sm">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Calculating route...</span>
          </div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : (
          <div className="space-y-1">
            <p className="font-medium text-lg text-zinc-700">Walking Details:</p>
            <p className="text-sm text-muted-foreground">Distance: {distance} km</p>
            <p className="text-sm text-muted-foreground">Est. Time: {duration} minutes</p>
          </div>
        )}
      </Card>
    </div>
  )
}
