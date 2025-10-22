"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Car,
  Download,
  Calendar,
  PieChart
} from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { useEffect, useState } from "react"

// Mock reports data
const mockReports = {
  revenue: {
    total: 25000000,
    thisMonth: 5000000,
    lastMonth: 4500000,
    growth: 11.1
  },
  orders: {
    total: 1250,
    completed: 1100,
    cancelled: 50,
    pending: 100
  },
  vehicles: {
    total: 25,
    active: 20,
    inactive: 5,
    maintenance: 2
  },
  drivers: {
    total: 45,
    active: 40,
    inactive: 5
  }
}

export default function ReportsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
            <BarChart3 className="w-8 h-8" />
            Báo cáo & Thống kê
          </h1>
          <p className="text-gray-600 dark:text-yellow-200 mt-2">
            Báo cáo tổng quan về hoạt động công ty
          </p>
        </div>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
          <Download className="w-4 h-4 mr-2" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-200/80 to-green-300/80 dark:from-green-900/20 dark:to-black border-green-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-green-300">
              Tổng doanh thu
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-green-400">
              {mockReports.revenue.total.toLocaleString()} VNĐ
            </div>
            <p className="text-xs text-gray-600 dark:text-green-300">
              +{mockReports.revenue.growth}% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-200/80 to-blue-300/80 dark:from-blue-900/20 dark:to-black border-blue-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-blue-300">
              Đơn hàng
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-blue-400">
              {mockReports.orders.total}
            </div>
            <p className="text-xs text-gray-600 dark:text-blue-300">
              {mockReports.orders.completed} hoàn thành
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-200/80 to-purple-300/80 dark:from-purple-900/20 dark:to-black border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-purple-300">
              Xe
            </CardTitle>
            <Car className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-purple-400">
              {mockReports.vehicles.total}
            </div>
            <p className="text-xs text-gray-600 dark:text-purple-300">
              {mockReports.vehicles.active} đang hoạt động
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-200/80 to-orange-300/80 dark:from-orange-900/20 dark:to-black border-orange-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-orange-300">
              Tài xế
            </CardTitle>
            <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-orange-400">
              {mockReports.drivers.total}
            </div>
            <p className="text-xs text-gray-600 dark:text-orange-300">
              {mockReports.drivers.active} đang hoạt động
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Report */}
        <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-yellow-400 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Báo cáo doanh thu
            </CardTitle>
            <CardDescription className="text-yellow-200">
              Thống kê doanh thu theo tháng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-yellow-300">Tháng này</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-yellow-400">
                  {mockReports.revenue.thisMonth.toLocaleString()} VNĐ
                </p>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-yellow-300">Tháng trước</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-yellow-400">
                  {mockReports.revenue.lastMonth.toLocaleString()} VNĐ
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-yellow-300">Tăng trưởng</span>
              <Badge className="bg-green-100 text-green-800">
                +{mockReports.revenue.growth}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Orders Report */}
        <Card className="bg-gradient-to-br from-blue-200/80 to-blue-300/80 dark:from-blue-900/20 dark:to-black border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-blue-400 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Thống kê đơn hàng
            </CardTitle>
            <CardDescription className="text-blue-200">
              Phân tích trạng thái đơn hàng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-blue-300">Hoàn thành</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: `${(mockReports.orders.completed / mockReports.orders.total) * 100}%`}}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-blue-400">
                    {mockReports.orders.completed}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-blue-300">Đang chờ</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${(mockReports.orders.pending / mockReports.orders.total) * 100}%`}}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-blue-400">
                    {mockReports.orders.pending}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-blue-300">Đã hủy</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{width: `${(mockReports.orders.cancelled / mockReports.orders.total) * 100}%`}}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-blue-400">
                    {mockReports.orders.cancelled}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button variant="outline" className="border-yellow-500/30 text-yellow-700 hover:bg-yellow-50 dark:text-yellow-300 dark:hover:bg-yellow-900/20">
          <Calendar className="w-4 h-4 mr-2" />
          Báo cáo theo ngày
        </Button>
        <Button variant="outline" className="border-blue-500/30 text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-900/20">
          <BarChart3 className="w-4 h-4 mr-2" />
          Báo cáo theo tháng
        </Button>
        <Button variant="outline" className="border-green-500/30 text-green-700 hover:bg-green-50 dark:text-green-300 dark:hover:bg-green-900/20">
          <TrendingUp className="w-4 h-4 mr-2" />
          Báo cáo theo năm
        </Button>
      </div>
    </div>
  )
}
