"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  Search, 
  Eye, 
  Download, 
  Building2, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Car,
  PieChart
} from "lucide-react"
import Header from "@/components/Header"
import { getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function AdminReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedCompany, setSelectedCompany] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== 'admin') {
      router.push('/login')
      return
    }
  }, [router])

  // Mock data for reports
  const mockReports = [
    {
      id: 1,
      company: "Vinasun Taxi",
      period: "Tháng 3/2024",
      revenue: 2500000000,
      orders: 1250,
      drivers: 120,
      vehicles: 150,
      growth: 15.5,
      status: "completed"
    },
    {
      id: 2,
      company: "Mai Linh Taxi",
      period: "Tháng 3/2024",
      revenue: 3200000000,
      orders: 1600,
      drivers: 180,
      vehicles: 200,
      growth: 22.3,
      status: "completed"
    },
    {
      id: 3,
      company: "Saigon Taxi",
      period: "Tháng 3/2024",
      revenue: 1800000000,
      orders: 900,
      drivers: 80,
      vehicles: 100,
      growth: 8.7,
      status: "completed"
    },
    {
      id: 4,
      company: "Vina Taxi Group",
      period: "Tháng 3/2024",
      revenue: 1500000000,
      orders: 750,
      drivers: 70,
      vehicles: 80,
      growth: 5.2,
      status: "completed"
    },
    {
      id: 5,
      company: "Green Taxi",
      period: "Tháng 3/2024",
      revenue: 1200000000,
      orders: 600,
      drivers: 50,
      vehicles: 60,
      growth: -2.1,
      status: "completed"
    }
  ]

  const companies = [...new Set(mockReports.map(report => report.company))]

  const getGrowthBadge = (growth: number) => {
    if (growth > 0) {
      return <Badge className="bg-green-500 text-white">+{growth}%</Badge>
    } else {
      return <Badge className="bg-red-500 text-white">{growth}%</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 text-white">Hoàn thành</Badge>
      case "pending":
        return <Badge className="bg-yellow-500 text-white">Chờ xử lý</Badge>
      case "processing":
        return <Badge className="bg-blue-500 text-white">Đang xử lý</Badge>
      default:
        return <Badge className="bg-gray-500 text-white">Không xác định</Badge>
    }
  }

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        report.period.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCompany = selectedCompany === "all" || report.company === selectedCompany
    
    return matchesSearch && matchesCompany
  })

  const totalRevenue = mockReports.reduce((sum, report) => sum + report.revenue, 0)
  const totalOrders = mockReports.reduce((sum, report) => sum + report.orders, 0)
  const totalDrivers = mockReports.reduce((sum, report) => sum + report.drivers, 0)
  const totalVehicles = mockReports.reduce((sum, report) => sum + report.vehicles, 0)
  const avgGrowth = mockReports.reduce((sum, report) => sum + report.growth, 0) / mockReports.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400 mb-2">
              Báo cáo hệ thống
            </h1>
            <p className="text-gray-600 dark:text-yellow-200">
              Xem báo cáo tổng hợp toàn hệ thống (chỉ đọc)
            </p>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-200/80 to-blue-300/80 dark:from-blue-900/20 dark:to-black border-blue-500/30 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-blue-200">Tổng doanh thu</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-blue-400">
                      {(totalRevenue / 1000000000).toFixed(1)}B VND
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-200/80 to-green-300/80 dark:from-green-900/20 dark:to-black border-green-500/30 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-green-200">Tổng đơn hàng</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-green-400">
                      {totalOrders.toLocaleString()}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-200/80 to-purple-300/80 dark:from-purple-900/20 dark:to-black border-purple-500/30 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-purple-200">Tổng tài xế</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-purple-400">
                      {totalDrivers}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-200/80 to-orange-300/80 dark:from-orange-900/20 dark:to-black border-orange-500/30 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-orange-200">Tăng trưởng TB</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-orange-400">
                      {avgGrowth > 0 ? '+' : ''}{avgGrowth.toFixed(1)}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm báo cáo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="month">Tháng</option>
                <option value="quarter">Quý</option>
                <option value="year">Năm</option>
              </select>
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
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400">
                          {report.company}
                        </h3>
                        <Badge className="bg-gray-500 text-white">{report.period}</Badge>
                        {getGrowthBadge(report.growth)}
                        {getStatusBadge(report.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-yellow-300">Doanh thu</p>
                          <p className="font-medium text-gray-900 dark:text-yellow-400">
                            {(report.revenue / 1000000000).toFixed(1)}B VND
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-yellow-300">Đơn hàng</p>
                          <p className="font-medium text-gray-900 dark:text-yellow-400">
                            {report.orders.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-yellow-300">Tài xế</p>
                          <p className="font-medium text-gray-900 dark:text-yellow-400">
                            {report.drivers}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-yellow-300">Xe</p>
                          <p className="font-medium text-gray-900 dark:text-yellow-400">
                            {report.vehicles}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600 dark:text-yellow-300">
                            Tăng trưởng: {report.growth > 0 ? '+' : ''}{report.growth}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-yellow-300">
                            Kỳ báo cáo: {report.period}
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

          {filteredReports.length === 0 && (
            <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
              <CardContent className="p-12 text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-yellow-400 mb-2">
                  Không tìm thấy báo cáo
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
