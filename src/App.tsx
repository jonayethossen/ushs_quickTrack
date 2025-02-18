import { useEffect, useState } from 'react'
import LocationMap, { Location } from './components/location-map'
import { locations } from './constants'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { Skeleton } from './components/ui/skeleton'

function App() {
  const [myLocation, setMyLocation] = useState<Location>()
  const [selectedLocation, setSelectedLocation] = useState<Location>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return alert('window is undefined')

    const nav = window.navigator
    if (nav) {
      nav.geolocation.getCurrentPosition(
        (position) => {
          if (position) {
            setMyLocation({
              name: 'My Location',
              coords: [position.coords.latitude, position.coords.longitude]
            })
          }
        },
        (error) => {
          alert('Geolocation not working...')
          console.error(error)
        }
      )
    } else {
      console.error('navigator not supported in this browser')
    }
  }, []) // Empty dependency array ensures this runs once on the client side

  const handleLocationSelect = async (location: Location) => {
    setIsLoading(true)
    setSelectedLocation(location)
    setTimeout(() => setIsLoading(false), 500)
  }

  return (
    <div className="bg-[url(/bg.jpg)] bg-cover bg-center bg-no-repeat w-full h-screen relative">
      <div className="absolute inset-0 backdrop-blur-[4px]"></div>
      <div className="max-w-4xl mx-auto p-6 z-50 relative">
        <h1 className="text-6xl font-extrabold bg-gradient-to-bl from-blue-500 to-blue-800 bg-clip-text text-transparent leading-normal mb-6 text-center stroke-current text-white">
          Find Near Location - Quickly
        </h1>
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {locations.map((location, index: number) => (
            <Button
              key={index}
              variant={selectedLocation?.name === location.name ? 'default' : 'outline'}
              onClick={() => handleLocationSelect(location)}
            >
              {location.name}
            </Button>
          ))}
        </div>

        <Card className="p-4">
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <div className="h-[400px] w-full">
              {selectedLocation && myLocation ? (
                <LocationMap startLocation={myLocation} endLocation={selectedLocation} />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground bg-[url(/map.jpg)] bg-center bg-no-repeat bg-cover relative">
                  <div className="absolute inset-0 backdrop-blur-[5px] flex justify-center items-center bg-opacity-50 bg-black">
                    <h1 className="text-2xl">Select a location to view on the map</h1>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default App
