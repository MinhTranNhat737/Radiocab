"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, TrendingUp, Users, DollarSign, Eye, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"

export default function CompanyDashboard() {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== 'company') {
      router.push('/login')
    }
  }, [router])

  const user = getCurrentUser()

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400 mb-2">
          Chào mừng, {user?.fullName || 'Công ty'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {user?.companyName && `Quản lý ${user.companyName}`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-400">
              Lượt xem
            </CardTitle>
            <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-400">1,234</div>
            <p className="text-xs text-blue-700 dark:text-blue-500 mt-1">+20% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-400">
              Leads mới
            </CardTitle>
            <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-400">45</div>
            <p className="text-xs text-green-700 dark:text-green-500 mt-1">+12 trong tuần này</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/10 border-yellow-200 dark:border-yellow-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900 dark:text-yellow-400">
              Quảng cáo
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-400">8</div>
            <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1">3 đang hoạt động</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-400">
              Doanh thu
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-400">12.5M</div>
            <p className="text-xs text-purple-700 dark:text-purple-500 mt-1">VNĐ trong tháng</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-4">
          Truy cập nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/user/dashboard/company/profile">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <Building2 className="h-8 w-8 text-yellow-500 mb-2" />
                <CardTitle className="text-gray-900 dark:text-yellow-400">Hồ sơ công ty</CardTitle>
                <CardDescription>Cập nhật thông tin công ty</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/user/dashboard/company/leads">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <Users className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle className="text-gray-900 dark:text-yellow-400">Quản lý Leads</CardTitle>
                <CardDescription>Xem khách hàng tiềm năng</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/user/dashboard/company/ads">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle className="text-gray-900 dark:text-yellow-400">Quảng cáo</CardTitle>
                <CardDescription>Quản lý chiến dịch quảng cáo</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/user/dashboard/company/subscriptions">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <FileText className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle className="text-gray-900 dark:text-yellow-400">Gói dịch vụ</CardTitle>
                <CardDescription>Quản lý subscription</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/user/dashboard/company/payments">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <DollarSign className="h-8 w-8 text-orange-500 mb-2" />
                <CardTitle className="text-gray-900 dark:text-yellow-400">Thanh toán</CardTitle>
                <CardDescription>Lịch sử thanh toán</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-yellow-400">Hoạt động gần đây</CardTitle>
          <CardDescription>Các hoạt động mới nhất của công ty</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Lead mới từ Nguyễn Văn A</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 giờ trước</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Quảng cáo đã được duyệt</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">5 giờ trước</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Thanh toán thành công</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">1 ngày trước</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


