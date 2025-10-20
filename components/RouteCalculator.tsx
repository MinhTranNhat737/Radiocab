"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Route, Clock, DollarSign, Search, Navigation, Car, Crosshair } from "lucide-react"

interface Location {
  coords: [number, number]
  name: string
}

interface RouteInfo {
  distance: number
  duration: number
  price: number
  baseFare: number
  distanceFare: number
  timeFare: number
  trafficLevel: string
  trafficMultiplier: number
}

declare global {
  interface Window {
    mapboxgl: any
  }
}

export default function RouteCalculator() {
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null)
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null)
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [currentSelection, setCurrentSelection] = useState<'pickup' | 'dropoff' | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [showTraffic, setShowTraffic] = useState(false)
  
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const pickupMarker = useRef<any>(null)
  const dropoffMarker = useRef<any>(null)
  const routeLayer = useRef<any>(null)

  // Mapbox configuration
  const mapboxAccessToken = 'pk.eyJ1Ijoic3ViaGFtcHJlZXQiLCJhIjoiY2toY2IwejF1MDdodzJxbWRuZHAweDV6aiJ9.Ys8MP5kVTk5P9V2TDvnuDg'
  const tomtomApiKey = 'bQrbmvGHDhZA0DUXLOFxLRnYNNrbqgEq'

  useEffect(() => {
    if (typeof window !== 'undefined' && window.mapboxgl) {
      initializeMap()
    } else {
      // Load Mapbox GL JS dynamically
      const script = document.createElement('script')
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'
      script.onload = () => {
        const link = document.createElement('link')
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css'
        link.rel = 'stylesheet'
        document.head.appendChild(link)
        initializeMap()
      }
      document.head.appendChild(script)
    }
  }, [])

  const initializeMap = () => {
    if (!mapRef.current || mapInstance.current) return

    window.mapboxgl.accessToken = mapboxAccessToken
    
    mapInstance.current = new window.mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [105.8342, 21.0285], // Hanoi coordinates
      zoom: 12
    })

    mapInstance.current.addControl(new window.mapboxgl.NavigationControl())
    mapInstance.current.addControl(new window.mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }))

    mapInstance.current.on('click', (e: any) => {
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat]
      if (currentSelection === 'pickup') {
        setPickupLocation({ coords, name: 'Vị trí đã chọn' })
        setCurrentSelection(null)
      } else if (currentSelection === 'dropoff') {
        setDropoffLocation({ coords, name: 'Vị trí đã chọn' })
        setCurrentSelection(null)
      }
    })
  }

  const searchLocation = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([])
      return
    }

    try {
      const response = await fetch(
        `https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=${tomtomApiKey}&countrySet=VN&limit=5`
      )
      
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.results || [])
      }
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  const selectLocation = (result: any) => {
    const coords: [number, number] = [result.position.lon, result.position.lat]
    const name = result.poi?.name || result.address?.freeformAddress || 'Vị trí đã chọn'
    
    if (currentSelection === 'pickup') {
      setPickupLocation({ coords, name })
    } else if (currentSelection === 'dropoff') {
      setDropoffLocation({ coords, name })
    }
    
    setCurrentSelection(null)
    setSearchQuery("")
    setSearchResults([])
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt không hỗ trợ định vị GPS')
      return
    }

    setIsGettingLocation(true)
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.longitude, position.coords.latitude]
        const name = 'Vị trí hiện tại'
        
        if (currentSelection === 'pickup') {
          setPickupLocation({ coords, name })
        } else if (currentSelection === 'dropoff') {
          setDropoffLocation({ coords, name })
        } else {
          // Nếu không có selection mode, tự động chọn pickup
          setPickupLocation({ coords, name })
        }
        
        setCurrentSelection(null)
        setSearchQuery("")
        setSearchResults([])
        setIsGettingLocation(false)
        
        // Zoom to current location
        if (mapInstance.current) {
          mapInstance.current.flyTo({
            center: coords,
            zoom: 15,
            duration: 1000
          })
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        let message = 'Không thể lấy vị trí hiện tại'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Bạn cần cấp quyền truy cập vị trí để sử dụng tính năng này'
            break
          case error.POSITION_UNAVAILABLE:
            message = 'Vị trí hiện tại không khả dụng'
            break
          case error.TIMEOUT:
            message = 'Hết thời gian chờ lấy vị trí'
            break
        }
        
        alert(message)
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  const updateMarkers = () => {
    if (!mapInstance.current) return

    // Remove existing markers
    if (pickupMarker.current) {
      pickupMarker.current.remove()
    }
    if (dropoffMarker.current) {
      dropoffMarker.current.remove()
    }

    // Add pickup marker
    if (pickupLocation) {
      pickupMarker.current = new window.mapboxgl.Marker({ color: '#10b981' })
        .setLngLat(pickupLocation.coords)
        .setPopup(new window.mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-bold text-green-600">Điểm đón</h3>
            <p>${pickupLocation.name}</p>
          </div>
        `))
        .addTo(mapInstance.current)
    }

    // Add dropoff marker
    if (dropoffLocation) {
      dropoffMarker.current = new window.mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat(dropoffLocation.coords)
        .setPopup(new window.mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-bold text-red-600">Điểm đến</h3>
            <p>${dropoffLocation.name}</p>
          </div>
        `))
        .addTo(mapInstance.current)
    }
  }

  const getTrafficLevel = async (coords: [number, number]) => {
    try {
      const response = await fetch(
        `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${tomtomApiKey}&point=${coords[1]},${coords[0]}`
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data.flowSegmentData) {
          const flow = data.flowSegmentData
          const currentSpeed = flow.currentSpeed || 0
          const freeFlowSpeed = flow.freeFlowSpeed || 0
          
          if (freeFlowSpeed > 0) {
            const speedRatio = currentSpeed / freeFlowSpeed
            
            if (speedRatio >= 0.8) {
              return { level: 'Thông thoáng', multiplier: 1.0 }
            } else if (speedRatio >= 0.6) {
              return { level: 'Hơi chậm', multiplier: 1.1 }
            } else if (speedRatio >= 0.4) {
              return { level: 'Chậm', multiplier: 1.2 }
            } else if (speedRatio >= 0.2) {
              return { level: 'Rất chậm', multiplier: 1.3 }
            } else {
              return { level: 'Tắc đường', multiplier: 1.5 }
            }
          }
        }
      }
    } catch (error) {
      console.error('Traffic API error:', error)
    }
    
    // Fallback: random traffic level for demo
    const levels = [
      { level: 'Thông thoáng', multiplier: 1.0 },
      { level: 'Hơi chậm', multiplier: 1.1 },
      { level: 'Chậm', multiplier: 1.2 },
      { level: 'Rất chậm', multiplier: 1.3 },
      { level: 'Tắc đường', multiplier: 1.5 }
    ]
    return levels[Math.floor(Math.random() * levels.length)]
  }

  const calculateRoute = async () => {
    if (!pickupLocation || !dropoffLocation) return

    setIsCalculating(true)
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupLocation.coords[0]},${pickupLocation.coords[1]};${dropoffLocation.coords[0]},${dropoffLocation.coords[1]}?access_token=${mapboxAccessToken}&geometries=geojson&overview=full`
      )
      
      if (response.ok) {
        const data = await response.json()
        const route = data.routes[0]
        
        // Calculate pricing with proper rounding
        const distance = Math.round((route.distance / 1000) * 10) / 10 // Round to 1 decimal place
        const duration = Math.round((route.duration / 60) * 10) / 10 // Round to 1 decimal place
        
        const baseFare = 15000 // 15,000 VND
        const perKmRate = 12000 // 12,000 VND per km
        const perMinuteRate = 500 // 500 VND per minute
        
        const distanceFare = Math.round(distance * perKmRate)
        const timeFare = Math.round(duration * perMinuteRate)
        
        // Get traffic level
        const trafficInfo = await getTrafficLevel(pickupLocation.coords)
        const trafficMultiplier = trafficInfo.multiplier
        
        const subtotal = baseFare + distanceFare + timeFare
        const total = Math.round(subtotal * trafficMultiplier)
        
        // Ensure all prices are integers
        const finalBaseFare = Math.round(baseFare)
        const finalDistanceFare = Math.round(distanceFare)
        const finalTimeFare = Math.round(timeFare)
        const finalTotal = Math.round(total)
        
        setRouteInfo({
          distance,
          duration,
          price: finalTotal,
          baseFare: finalBaseFare,
          distanceFare: finalDistanceFare,
          timeFare: finalTimeFare,
          trafficLevel: trafficInfo.level,
          trafficMultiplier
        })

        // Display route on map
        displayRoute(route.geometry)
      }
    } catch (error) {
      console.error('Route calculation error:', error)
    } finally {
      setIsCalculating(false)
    }
  }

  const displayRoute = (geometry: any) => {
    if (!mapInstance.current) return

    // Remove existing route
    if (mapInstance.current.getSource('route')) {
      mapInstance.current.removeLayer('route')
      mapInstance.current.removeSource('route')
    }

    // Add route to map
    mapInstance.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: geometry
      }
    })

    mapInstance.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3b82f6',
        'line-width': 4
      }
    })

    // Fit map to route
    const coordinates = geometry.coordinates
    const bounds = coordinates.reduce((bounds: any, coord: any) => {
      return bounds.extend(coord)
    }, new window.mapboxgl.LngLatBounds(coordinates[0], coordinates[0]))

    mapInstance.current.fitBounds(bounds, { padding: 50 })
    
    // Add traffic layer after route is displayed
    addTrafficLayer()
  }

  const addTrafficLayer = async () => {
    if (!mapInstance.current || !tomtomApiKey) return

    try {
      // Get traffic incidents from TomTom
      const response = await fetch(
        `https://api.tomtom.com/traffic/services/4/incidentDetails/s3/21.0285,105.8342,21.1,105.9/json?key=${tomtomApiKey}&projection=EPSG4326&expandCluster=true`
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data.incidents) {
          displayTrafficIncidents(data.incidents)
        }
      }
    } catch (error) {
      console.error('Traffic API error:', error)
    }
  }

  const displayTrafficIncidents = (incidents: any[]) => {
    if (!mapInstance.current) return

    // Remove existing traffic layer
    if (mapInstance.current.getSource('traffic-incidents')) {
      mapInstance.current.removeLayer('traffic-incidents')
      mapInstance.current.removeSource('traffic-incidents')
    }

    // Create GeoJSON for traffic incidents
    const trafficFeatures = incidents.map(incident => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [incident.point.lon, incident.point.lat]
      },
      properties: {
        id: incident.id,
        type: incident.type,
        severity: incident.severity,
        description: incident.description,
        startTime: incident.startTime,
        endTime: incident.endTime
      }
    }))

    // Add traffic incidents source
    mapInstance.current.addSource('traffic-incidents', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: trafficFeatures
      }
    })

    // Add traffic incidents layer
    mapInstance.current.addLayer({
      id: 'traffic-incidents',
      type: 'circle',
      source: 'traffic-incidents',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'severity'],
          1, 6,  // Low severity - small circle
          2, 8,  // Medium severity - medium circle
          3, 12, // High severity - large circle
          4, 16  // Very high severity - very large circle
        ],
        'circle-color': [
          'case',
          ['==', ['get', 'severity'], 1], '#10b981', // Green for low severity
          ['==', ['get', 'severity'], 2], '#f59e0b', // Yellow for medium severity
          ['==', ['get', 'severity'], 3], '#f97316', // Orange for high severity
          ['==', ['get', 'severity'], 4], '#ef4444', // Red for very high severity
          '#6b7280' // Gray for unknown
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.8
      }
    })

    // Add click handler for traffic incidents
    mapInstance.current.on('click', 'traffic-incidents', (e: any) => {
      const feature = e.features[0]
      const coordinates = feature.geometry.coordinates.slice()
      const severity = feature.properties.severity
      const description = feature.properties.description
      const type = feature.properties.type

      // Create popup
      new window.mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`
          <div class="p-3">
            <h3 class="font-bold text-red-600 mb-2">⚠️ Sự cố giao thông</h3>
            <p class="text-sm mb-2"><strong>Loại:</strong> ${type}</p>
            <p class="text-sm mb-2"><strong>Mức độ:</strong> ${getSeverityText(severity)}</p>
            <p class="text-sm"><strong>Mô tả:</strong> ${description}</p>
          </div>
        `)
        .addTo(mapInstance.current)
    })

    // Change cursor on hover
    mapInstance.current.on('mouseenter', 'traffic-incidents', () => {
      mapInstance.current.getCanvas().style.cursor = 'pointer'
    })

    mapInstance.current.on('mouseleave', 'traffic-incidents', () => {
      mapInstance.current.getCanvas().style.cursor = ''
    })
  }

  const getSeverityText = (severity: number) => {
    switch (severity) {
      case 1: return 'Thấp'
      case 2: return 'Trung bình'
      case 3: return 'Cao'
      case 4: return 'Rất cao'
      default: return 'Không xác định'
    }
  }

  const toggleTrafficLayer = () => {
    if (!mapInstance.current) return

    if (showTraffic) {
      // Hide traffic layer
      if (mapInstance.current.getSource('traffic-incidents')) {
        mapInstance.current.removeLayer('traffic-incidents')
        mapInstance.current.removeSource('traffic-incidents')
      }
      setShowTraffic(false)
    } else {
      // Show traffic layer
      addTrafficLayer()
      setShowTraffic(true)
    }
  }

  useEffect(() => {
    updateMarkers()
  }, [pickupLocation, dropoffLocation])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocation(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-background/50 dark:to-background/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Tìm Lộ Trình & Tính Giá Taxi
          </h2>
          <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
            Chọn điểm đón và điểm đến để xem lộ trình tối ưu và giá tiền dự kiến
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Location Selection */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Chọn Địa Điểm
              </CardTitle>
              <CardDescription>
                Nhập địa chỉ hoặc click trên bản đồ để chọn điểm đón và điểm đến
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pickup Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Điểm đón
                </label>
                <div className="relative">
                  <Input
                    placeholder="Nhập địa chỉ điểm đón..."
                    value={currentSelection === 'pickup' ? searchQuery : (pickupLocation?.name || '')}
                    onChange={(e) => {
                      if (currentSelection === 'pickup') {
                        setSearchQuery(e.target.value)
                      }
                    }}
                    onFocus={() => setCurrentSelection('pickup')}
                    className="pl-10 pr-20"
                  />
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-primary" />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-1 h-8 w-8 p-0 hover:bg-primary/10"
                    onClick={() => {
                      setCurrentSelection('pickup')
                      getCurrentLocation()
                    }}
                    disabled={isGettingLocation}
                    title="Lấy vị trí hiện tại"
                  >
                    {isGettingLocation ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    ) : (
                      <Crosshair className="h-4 w-4 text-primary" />
                    )}
                  </Button>
                </div>
                {pickupLocation && (
                  <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-sm text-green-700 dark:text-green-300">
                      {pickupLocation.name}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPickupLocation(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                )}
              </div>

              {/* Dropoff Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Điểm đến
                </label>
                <div className="relative">
                  <Input
                    placeholder="Nhập địa chỉ điểm đến..."
                    value={currentSelection === 'dropoff' ? searchQuery : (dropoffLocation?.name || '')}
                    onChange={(e) => {
                      if (currentSelection === 'dropoff') {
                        setSearchQuery(e.target.value)
                      }
                    }}
                    onFocus={() => setCurrentSelection('dropoff')}
                    className="pl-10 pr-20"
                  />
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-primary" />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-1 h-8 w-8 p-0 hover:bg-primary/10"
                    onClick={() => {
                      setCurrentSelection('dropoff')
                      getCurrentLocation()
                    }}
                    disabled={isGettingLocation}
                    title="Lấy vị trí hiện tại"
                  >
                    {isGettingLocation ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    ) : (
                      <Crosshair className="h-4 w-4 text-primary" />
                    )}
                  </Button>
                </div>
                {dropoffLocation && (
                  <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="text-sm text-red-700 dark:text-red-300">
                      {dropoffLocation.name}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDropoffLocation(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="max-h-48 overflow-y-auto border rounded-lg bg-white dark:bg-gray-800">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0"
                      onClick={() => selectLocation(result)}
                    >
                      <div className="font-medium text-sm">
                        {result.poi?.name || result.address?.freeformAddress}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {result.address?.freeformAddress}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Calculate Button */}
              <Button
                onClick={calculateRoute}
                disabled={!pickupLocation || !dropoffLocation || isCalculating}
                className="w-full"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang tính toán...
                  </>
                ) : (
                  <>
                    <Route className="h-4 w-4 mr-2" />
                    Tính Lộ Trình & Giá
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-primary" />
                Bản Đồ
              </CardTitle>
              <CardDescription>
                Click trên bản đồ để chọn vị trí hoặc sử dụng tìm kiếm ở trên
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div 
                  ref={mapRef} 
                  className="w-full h-96 rounded-lg border border-gray-200 dark:border-gray-700"
                  style={{ minHeight: '384px' }}
                />
                {/* Current Location Button */}
                <Button
                  type="button"
                  size="sm"
                  className="absolute top-4 right-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg border border-gray-200 dark:border-gray-600"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  title="Lấy vị trí hiện tại"
                >
                  {isGettingLocation ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  ) : (
                    <Crosshair className="h-4 w-4" />
                  )}
                </Button>
                
                {/* Traffic Toggle Button */}
                <Button
                  type="button"
                  size="sm"
                  className={`absolute top-4 right-16 shadow-lg border ${
                    showTraffic 
                      ? 'bg-red-500 text-white border-red-600 hover:bg-red-600' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                  onClick={toggleTrafficLayer}
                  title={showTraffic ? 'Ẩn tình trạng giao thông' : 'Hiện tình trạng giao thông'}
                >
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Route Information */}
        {routeInfo && (
          <Card className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Thông Tin Chuyến Đi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {/* Distance */}
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="flex items-center justify-center mb-2">
                    <Route className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {routeInfo.distance.toFixed(1)} km
                  </div>
                  <div className="text-sm text-gray-500">Khoảng cách</div>
                </div>

                {/* Duration */}
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {routeInfo.duration.toFixed(1)} phút
                  </div>
                  <div className="text-sm text-gray-500">Thời gian dự kiến</div>
                </div>

                {/* Traffic Level */}
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="flex items-center justify-center mb-2">
                    <Navigation className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-lg font-bold text-orange-600">
                    {routeInfo.trafficLevel}
                  </div>
                  <div className="text-sm text-gray-500">Tình trạng giao thông</div>
                </div>

                {/* Price */}
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {routeInfo.price.toLocaleString()} VNĐ
                  </div>
                  <div className="text-sm text-gray-500">Giá ước tính</div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  Chi Tiết Giá Tiền
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Phí cơ bản:</span>
                    <span className="text-sm font-medium">{routeInfo.baseFare.toLocaleString()} VNĐ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Phí theo km ({routeInfo.distance.toFixed(1)} km):</span>
                    <span className="text-sm font-medium">{routeInfo.distanceFare.toLocaleString()} VNĐ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Phí theo thời gian ({routeInfo.duration.toFixed(1)} phút):</span>
                    <span className="text-sm font-medium">{routeInfo.timeFare.toLocaleString()} VNĐ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tình trạng giao thông ({routeInfo.trafficLevel}):</span>
                    <span className="text-sm font-medium">x{routeInfo.trafficMultiplier}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Tổng cộng:</span>
                    <span className="font-bold text-lg text-primary">{routeInfo.price.toLocaleString()} VNĐ</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
