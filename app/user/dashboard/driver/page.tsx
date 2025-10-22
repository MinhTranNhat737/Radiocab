"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, TrendingUp, Briefcase, DollarSign, Star, FileText } from "lucide-react"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"

export default function DriverDashboard() {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== 'driver') {
      router.push('/login')
    }
  }, [router])

  const user = getCurrentUser()

  return (
    <div className="space-y-8 p-6">
      {}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400 mb-2">
          Chào mừng, {user?.fullName || 'Tài xế'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {user?.driverLicense && `Bằng lái: ${user.driverLicense}`}
        </p>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-400">
              Lượt xem hồ sơ
            </CardTitle>
            <Car className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-400">856</div>
            <p className="text-xs text-blue-700 dark:text-blue-500 mt-1">+15% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-400">
              Đơn ứng tuyển
            </CardTitle>
            <Briefcase className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-400">12</div>
            <p className="text-xs text-green-700 dark:text-green-500 mt-1">3 đang chờ xử lý</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/10 border-yellow-200 dark:border-yellow-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900 dark:text-yellow-400">
              Đánh giá
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-400">4.8</div>
            <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1">Từ 24 đánh giá</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-400">
              Chuyến đi
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-400">145</div>
            <p className="text-xs text-purple-700 dark:text-purple-500 mt-1">Tổng số chuyến</p>
          </CardContent>
        </Card>
      </div>

      {}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-4">
          Truy cập nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/user/dashboard/driver/profile">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <Car className="h-8 w-8 text-yellow-500 mb-2" />
                <CardTitle className="text-gray-900 dark:text-yellow-400">Hồ sơ tài xế</CardTitle>
                <CardDescription>Cập nhật thông tin cá nhân</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/user/dashboard/driver/applications">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <Briefcase className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle className="text-gray-900 dark:text-yellow-400">Ứng tuyển</CardTitle>
                <CardDescription>Quản lý đơn ứng tuyển</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/user/dashboard/driver/subscriptions">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <FileText className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle className="text-gray-900 dark:text-yellow-400">Gói dịch vụ</CardTitle>
                <CardDescription>Quản lý subscription</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-yellow-400">Thống kê tháng này</CardTitle>
            <CardDescription>Hiệu suất làm việc</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Chuyến đi hoàn thành</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">28</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Giờ làm việc</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">156h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Quãng đường</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">1,245 km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Doanh thu</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">8,500,000 VNĐ</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-yellow-400">Hoạt động gần đây</CardTitle>
            <CardDescription>Các hoạt động mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Đơn ứng tuyển được chấp nhận</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">3 giờ trước</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Nhận đánh giá 5 sao</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">1 ngày trước</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Car className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Hoàn thành chuyến đi</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 ngày trước</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



