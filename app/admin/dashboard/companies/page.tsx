"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Search, 
  Eye, 
  Download, 
  Users, 
  Car, 
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  MoreHorizontal
} from "lucide-react"
import Header from "@/components/Header"
import { getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function AdminCompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [companies, setCompanies] = useState([])
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== 'admin') {
      router.push('/login')
      return
    }
  }, [router])

  // Mock data for companies
  const mockCompanies = [
    {
      id: 1,
      name: "Vinasun Taxi",
      code: "VNS001",
      contact: "Nguyễn Văn A",
      phone: "0902345678",
      email: "info@vinasun.vn",
      status: "active",
      joinDate: "15/01/2024",
      vehicles: 150,
      drivers: 120,
      revenue: 2500000000,
      membershipType: "premium"
    },
    {
      id: 2,
      name: "Mai Linh Taxi",
      code: "ML001",
      contact: "Trần Thị B",
      phone: "0903456789",
      email: "contact@mailinh.vn",
      status: "active",
      joinDate: "20/01/2024",
      vehicles: 200,
      drivers: 180,
      revenue: 3200000000,
      membershipType: "premium"
    },
    {
      id: 3,
      name: "Saigon Taxi",
      code: "SGT001",
      contact: "Lê Văn C",
      phone: "0904567890",
      email: "info@saigontaxi.vn",
      status: "pending",
      joinDate: "01/02/2024",
      vehicles: 100,
      drivers: 80,
      revenue: 1800000000,
      membershipType: "basic"
    },
    {
      id: 4,
      name: "Vina Taxi Group",
      code: "VTG001",
      contact: "Phạm Thị D",
      phone: "0905678901",
      email: "contact@vinataxigroup.vn",
      status: "active",
      joinDate: "10/02/2024",
      vehicles: 80,
      drivers: 70,
      revenue: 1500000000,
      membershipType: "basic"
    },
    {
      id: 5,
      name: "Green Taxi",
      code: "GT001",
      contact: "Hoàng Văn E",
      phone: "0906789012",
      email: "hello@greentaxi.vn",
      status: "suspended",
      joinDate: "15/02/2024",
      vehicles: 60,
      drivers: 50,
      revenue: 1200000000,
      membershipType: "basic"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 text-white">Hoạt động</Badge>
      case "pending":
        return <Badge className="bg-yellow-500 text-white">Chờ duyệt</Badge>
      case "suspended":
        return <Badge className="bg-red-500 text-white">Tạm dừng</Badge>
      default:
        return <Badge className="bg-gray-500 text-white">Không xác định</Badge>
    }
  }

  const getMembershipBadge = (type: string) => {
    switch (type) {
      case "premium":
        return <Badge className="bg-purple-500 text-white">Premium</Badge>
      case "basic":
        return <Badge className="bg-blue-500 text-white">Basic</Badge>
      default:
        return <Badge className="bg-gray-500 text-white">Standard</Badge>
    }
  }

  const filteredCompanies = mockCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        company.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        company.code.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || company.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400 mb-2">
              Quản lý công ty
            </h1>
            <p className="text-gray-600 dark:text-yellow-200">
              Xem thông tin tất cả các công ty trong hệ thống (chỉ đọc)
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-200/80 to-blue-300/80 dark:from-blue-900/20 dark:to-black border-blue-500/30 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-blue-200">Tổng công ty</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-blue-400">
                      {mockCompanies.length}
                    </p>
                  </div>
                  <Building2 className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-200/80 to-green-300/80 dark:from-green-900/20 dark:to-black border-green-500/30 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-green-200">Đang hoạt động</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-green-400">
                      {mockCompanies.filter(c => c.status === 'active').length}
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
                    <p className="text-sm text-gray-600 dark:text-yellow-200">Chờ duyệt</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-yellow-400">
                      {mockCompanies.filter(c => c.status === 'pending').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-200/80 to-purple-300/80 dark:from-purple-900/20 dark:to-black border-purple-500/30 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-purple-200">Tổng doanh thu</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-purple-400">
                      {(mockCompanies.reduce((sum, c) => sum + c.revenue, 0) / 1000000000).toFixed(1)}B
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm công ty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedStatus === "all" ? "default" : "outline"}
                onClick={() => setSelectedStatus("all")}
                className="whitespace-nowrap"
              >
                Tất cả
              </Button>
              <Button
                variant={selectedStatus === "active" ? "default" : "outline"}
                onClick={() => setSelectedStatus("active")}
                className="whitespace-nowrap"
              >
                Hoạt động
              </Button>
              <Button
                variant={selectedStatus === "pending" ? "default" : "outline"}
                onClick={() => setSelectedStatus("pending")}
                className="whitespace-nowrap"
              >
                Chờ duyệt
              </Button>
              <Button
                variant={selectedStatus === "suspended" ? "default" : "outline"}
                onClick={() => setSelectedStatus("suspended")}
                className="whitespace-nowrap"
              >
                Tạm dừng
              </Button>
            </div>
          </div>

          {/* Companies List */}
          <div className="space-y-4">
            {filteredCompanies.map((company) => (
              <Card key={company.id} className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400">
                          {company.name}
                        </h3>
                        {getStatusBadge(company.status)}
                        {getMembershipBadge(company.membershipType)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-yellow-300">Mã công ty</p>
                          <p className="font-medium text-gray-900 dark:text-yellow-400">{company.code}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-yellow-300">Người liên hệ</p>
                          <p className="font-medium text-gray-900 dark:text-yellow-400">{company.contact}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-yellow-300">Điện thoại</p>
                          <p className="font-medium text-gray-900 dark:text-yellow-400">{company.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-yellow-300">Tham gia</p>
                          <p className="font-medium text-gray-900 dark:text-yellow-400">{company.joinDate}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-primary" />
                          <span className="text-sm text-gray-600 dark:text-yellow-300">
                            {company.vehicles} xe
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-sm text-gray-600 dark:text-yellow-300">
                            {company.drivers} tài xế
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="text-sm text-gray-600 dark:text-yellow-300">
                            {company.revenue.toLocaleString()} VND
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

          {filteredCompanies.length === 0 && (
            <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
              <CardContent className="p-12 text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-yellow-400 mb-2">
                  Không tìm thấy công ty
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
