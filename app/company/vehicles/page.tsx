"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Car, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Gauge,
  Fuel
} from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { useEffect, useState } from "react"

// Mock vehicles data
const mockVehicles = [
  {
    id: 1,
    plateNumber: "51A-12345",
    brand: "Toyota",
    model: "Vios",
    color: "Trắng",
    year: 2020,
    odometer: 50000,
    status: "ACTIVE",
    fuelType: "GASOLINE",
    seats: 5
  },
  {
    id: 2,
    plateNumber: "51A-67890",
    brand: "Honda",
    model: "City",
    color: "Xanh",
    year: 2021,
    odometer: 30000,
    status: "ACTIVE",
    fuelType: "GASOLINE",
    seats: 5
  },
  {
    id: 3,
    plateNumber: "51B-11111",
    brand: "Toyota",
    model: "Innova",
    color: "Đỏ",
    year: 2019,
    odometer: 80000,
    status: "INACTIVE",
    fuelType: "DIESEL",
    seats: 7
  }
]

export default function VehiclesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [vehicles, setVehicles] = useState(mockVehicles)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.color.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    return status === "ACTIVE" ? (
      <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Không hoạt động</Badge>
    )
  }

  const getFuelTypeIcon = (fuelType: string) => {
    return <Fuel className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
            <Car className="w-8 h-8" />
            Quản lý xe
          </h1>
          <p className="text-gray-600 dark:text-yellow-200 mt-2">
            Quản lý thông tin xe trong công ty
          </p>
        </div>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
          <Plus className="w-4 h-4 mr-2" />
          Thêm xe
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-gradient-to-r from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm xe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-yellow-300">
              {filteredVehicles.length} xe
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900 dark:text-yellow-400">
                      {vehicle.plateNumber}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-yellow-300">
                      {vehicle.brand} {vehicle.model}
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(vehicle.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-yellow-300">Màu sắc</p>
                  <p className="font-medium text-gray-900 dark:text-yellow-400">{vehicle.color}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-yellow-300">Năm sản xuất</p>
                  <p className="font-medium text-gray-900 dark:text-yellow-400">{vehicle.year}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-yellow-300">Số ghế</p>
                  <p className="font-medium text-gray-900 dark:text-yellow-400">{vehicle.seats} chỗ</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-yellow-300">Nhiên liệu</p>
                  <p className="font-medium text-gray-900 dark:text-yellow-400">{vehicle.fuelType}</p>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                <Gauge className="w-4 h-4 mr-2" />
                Km: {vehicle.odometer.toLocaleString()}
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  Xem
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  Sửa
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Xóa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
