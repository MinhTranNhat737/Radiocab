"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Car, 
  Search, 
  Eye, 
  Download, 
  Building2, 
  User,
  Phone,
  Mail,
  Calendar,
  Filter,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Clock,
  Wrench,
  Fuel
} from "lucide-react"
import Header from "@/components/Header"
import { getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function AdminVehiclesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== 'admin') {
      router.push('/login')
      return
    }
  }, [router])

  // Mock data for vehicles
  const mockVehicles = [
    {
      id: 1,
      licensePlate: "51A-12345",
      brand: "Toyota Vios",
      year: 2023,
      color: "Trắng",
      company: "Vinasun Taxi",
      driver: "Nguyễn Minh F",
      status: "active",
      joinDate: "15/01/2024",
      lastService: "2024-03-01T00:00:00Z",
      mileage: 25000,
      fuelType: "Xăng"
    },
    {
      id: 2,
      licensePlate: "51B-67890",
      brand: "Honda City",
      year: 2022,
      color: "Xanh",
      company: "Mai Linh Taxi",
      driver: "Trần Văn G",
      status: "active",
      joinDate: "20/01/2024",
      lastService: "2024-02-28T00:00:00Z",
      mileage: 32000,
      fuelType: "Xăng"
    },
    {
      id: 3,
      licensePlate: "51C-11111",
      brand: "Hyundai Accent",
      year: 2023,
      color: "Đỏ",
      company: "Saigon Taxi",
      driver: "Lê Thị H",
      status: "maintenance",
      joinDate: "01/02/2024",
      lastService: "2024-03-10T00:00:00Z",
      mileage: 18000,
      fuelType: "Xăng"
    },
    {
      id: 4,
      licensePlate: "51D-22222",
      brand: "Kia Cerato",
      year: 2022,
      color: "Đen",
      company: "Vina Taxi Group",
      driver: "Phạm Văn I",
      status: "active",
      joinDate: "10/02/2024",
      lastService: "2024-02-25T00:00:00Z",
      mileage: 28000,
      fuelType: "Xăng"
    },
    {
      id: 5,
      licensePlate: "51E-33333",
      brand: "Mazda 3",
      year: 2023,
      color: "Bạc",
      company: "Green Taxi",
      driver: "Võ Thị K",
      status: "inactive",
      joinDate: "15/02/2024",
      lastService: "2024-02-20T00:00:00Z",
      mileage: 15000,
      fuelType: "Xăng"
    },
    {
      id: 6,
      licensePlate: "51F-44444",
      brand: "Toyota Camry",
      year: 2021,
      color: "Trắng",
      company: "Vinasun Taxi",
      driver: "Đặng Văn L",
      status: "active",
      joinDate: "25/02/2024",
      lastService: "2024-03-05T00:00:00Z",
      mileage: 45000,
      fuelType: "Xăng"
    }
  ]

  const companies = [...new Set(mockVehicles.map(vehicle => vehicle.company))]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 text-white">Hoạt động</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-500 text-white">Bảo trì</Badge>
      case "inactive":
        return <Badge className="bg-red-500 text-white">Không hoạt động</Badge>
      default:
        return <Badge className="bg-gray-500 text-white">Không xác định</Badge>
    }
  }

  const filteredVehicles = mockVehicles.filter(vehicle => {
    const matchesSearch = vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        vehicle.driver.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCompany = selectedCompany === "all" || vehicle.company === selectedCompany
    const matchesStatus = selectedStatus === "all" || vehicle.status === selectedStatus
    
    return matchesSearch && matchesCompany && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400 mb-2">
              Quản lý xe
            </h1>
            <p className="text-gray-600 dark:text-yellow-200">
              Xem thông tin tất cả xe trong hệ thống (chỉ đọc)
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-200/80 to-blue-300/80 dark:from-blue-900/20 dark:to-black border-blue-500/30 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-blue-200">Tổng xe</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-blue-400">
                      {mockVehicles.length}
                    </p>
                  </div>
                  <Car className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-200/80 to-green-300/80 dark:from-green-900/20 dark:to-black border-green-500/30 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-green-200">Đang hoạt động</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-green-400">
                      {mockVehicles.filter(v => v.status === 'active').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-yellow-200">Bảo trì</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-yellow-400">
                      {mockVehicles.filter(v => v.status === 'maintenance').length}
                    </p>
                  </div>
                  <Wrench className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-200/80 to-purple-300/80 dark:from-purple-900/20 dark:to-black border-purple-500/30 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-purple-200">Tổng km</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-purple-400">
                      {(mockVehicles.reduce((sum, v) => sum + v.mileage, 0) / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <Fuel className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm xe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="all">Tất cả công ty</option>
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="maintenance">Bảo trì</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
          </div>

          {/* Vehicles List */}
          <div className="space-y-4">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400">
                          {vehicle.brand}
                        </h3>
                        <Badge className="bg-gray-500 text-white">{vehicle.licensePlate}</Badge>
                        {getStatusBadge(vehicle.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-yellow-300">Tài xế</p>
                          <p className="font-medium text-gray-900 dark:text-yellow-400">{vehicle.driver}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-yellow-300">Công ty</p>
                          <p className="font-medium text-gray-900 dark:text-yellow-400">{vehicle.company}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-yellow-300">Năm sản xuất</p>
                          <p className="font-medium text-gray-900 dark:text-yellow-400">{vehicle.year}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-yellow-300">Màu sắc</p>
                          <p className="font-medium text-gray-900 dark:text-yellow-400">{vehicle.color}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Fuel className="w-4 h-4 text-primary" />
                          <span className="text-sm text-gray-600 dark:text-yellow-300">
                            {vehicle.fuelType}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-primary" />
                          <span className="text-sm text-gray-600 dark:text-yellow-300">
                            {vehicle.mileage.toLocaleString()} km
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-sm text-gray-600 dark:text-yellow-300">
                            Bảo trì: {new Date(vehicle.lastService).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" className="border-yellow-500/50 text-primary hover:bg-yellow-500/10">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-yellow-500/50 text-primary hover:bg-yellow-500/10">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
              <CardContent className="p-12 text-center">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-yellow-400 mb-2">
                  Không tìm thấy xe
                </h3>
                <p className="text-gray-600 dark:text-yellow-200">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
