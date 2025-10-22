"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Eye, Edit, Trash2, Car, Users, TrendingUp } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getCompaniesByRole, getVehiclesByRole, getOrdersByRole } from "@/lib/mockData"
import { useEffect, useState } from "react"

export default function CompanyDemoPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string>("")

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setCurrentUser(user)
      setUserRole(user.role)
      
      // Lấy dữ liệu theo role
      const userCompanies = getCompaniesByRole(user.role, user.companyId)
      const userVehicles = getVehiclesByRole(user.role, user.companyId, user.id)
      const userOrders = getOrdersByRole(user.role, user.companyId, user.id)
      
      setCompanies(userCompanies)
      setVehicles(userVehicles)
      setOrders(userOrders)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100/50 to-yellow-200/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-yellow-400 mb-4">
            Demo - Dữ liệu theo Role
          </h1>
          <p className="text-gray-600 dark:text-yellow-200">
            Hiển thị dữ liệu dựa trên role của user hiện tại
          </p>
        </div>

        {/* User Info */}
        <Card className="mb-8 bg-gradient-to-br from-blue-200/80 to-blue-300/80 dark:from-blue-900/20 dark:to-black border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900 dark:text-blue-400">
              Thông tin User hiện tại
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentUser ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-blue-300">Tên</p>
                  <p className="font-medium text-gray-900 dark:text-blue-400">{currentUser.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-blue-300">Role</p>
                  <p className="font-medium text-gray-900 dark:text-blue-400">{currentUser.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-blue-300">Công ty</p>
                  <p className="font-medium text-gray-900 dark:text-blue-400">{currentUser.companyName || "Không có"}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-blue-300">Chưa đăng nhập</p>
            )}
          </CardContent>
        </Card>

        {/* Companies */}
        <Card className="mb-8 bg-gradient-to-br from-green-200/80 to-green-300/80 dark:from-green-900/20 dark:to-black border-green-500/30">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900 dark:text-green-400 flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              Công ty ({companies.length})
            </CardTitle>
            <CardDescription className="text-green-200">
              Dữ liệu công ty theo quyền của {userRole}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map((company) => (
                <Card key={company.id} className="bg-white/50 dark:bg-gray-800/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <Badge variant={company.status === "ACTIVE" ? "default" : "secondary"}>
                        {company.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Hotline: {company.hotline}</p>
                      <p className="text-sm text-gray-600">Email: {company.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Địa chỉ:</p>
                      <p className="text-sm font-medium">{company.address}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vehicles */}
        <Card className="mb-8 bg-gradient-to-br from-purple-200/80 to-purple-300/80 dark:from-purple-900/20 dark:to-black border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900 dark:text-purple-400 flex items-center gap-2">
              <Car className="w-6 h-6" />
              Xe ({vehicles.length})
            </CardTitle>
            <CardDescription className="text-purple-200">
              Dữ liệu xe theo quyền của {userRole}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id} className="bg-white/50 dark:bg-gray-800/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{vehicle.plateNumber}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Màu: {vehicle.color}</p>
                      <p className="text-sm text-gray-600">Năm: {vehicle.yearManufactured}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Km: {vehicle.odometerKm.toLocaleString()}</p>
                      <Badge variant={vehicle.status === "ACTIVE" ? "default" : "secondary"}>
                        {vehicle.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Orders */}
        <Card className="mb-8 bg-gradient-to-br from-orange-200/80 to-orange-300/80 dark:from-orange-900/20 dark:to-black border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900 dark:text-orange-400 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Đơn hàng ({orders.length})
            </CardTitle>
            <CardDescription className="text-orange-200">
              Dữ liệu đơn hàng theo quyền của {userRole}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map((order) => (
                <Card key={order.id} className="bg-white/50 dark:bg-gray-800/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Đơn #{order.id}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Từ: {order.pickupAddress}</p>
                      <p className="text-sm text-gray-600">Đến: {order.dropoffAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Km: {order.totalKm}</p>
                      <p className="text-sm text-gray-600">Giá: {order.totalAmount.toLocaleString()} VNĐ</p>
                    </div>
                    <Badge variant={
                      order.status === "DONE" ? "default" : 
                      order.status === "ONGOING" ? "secondary" : 
                      "outline"
                    }>
                      {order.status === "NEW" && "Mới"}
                      {order.status === "ASSIGNED" && "Đã phân công"}
                      {order.status === "ONGOING" && "Đang thực hiện"}
                      {order.status === "DONE" && "Hoàn thành"}
                      {order.status === "CANCELLED" && "Đã hủy"}
                      {order.status === "FAILED" && "Thất bại"}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
