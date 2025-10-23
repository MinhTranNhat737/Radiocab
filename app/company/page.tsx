"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Users, 
  Car, 
  Settings, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Shield, 
  Eye, 
  Download, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star
} from "lucide-react"
import Link from "next/link"
import { CompanyStaffOnly } from "@/components/RoleBasedAccess"
import { getCurrentUser } from "@/lib/auth"
import { getCompaniesByRole, getVehiclesByRole, getOrdersByRole, getCompanyById } from "@/lib/mockData"
import { useEffect, useState } from "react"

export default function CompanyPage() {
  const [userRole, setUserRole] = useState<"ADMIN" | "MANAGER" | "DRIVER" | "ACCOUNTANT" | "DISPATCHER" | "CUSTOMER">("CUSTOMER")
  const [currentCompany, setCurrentCompany] = useState("")
  const [companies, setCompanies] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)

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
      
      // Set current company name
      if (user.companyId && userCompanies.length > 0) {
        setCurrentCompany(userCompanies[0].name)
      }
    }
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Hoạt động
        </span>
      case "pending":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Chờ duyệt
        </span>
      case "suspended":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Tạm dừng
        </span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
    }
  }

  const getMembershipBadge = (type: string) => {
    switch (type) {
      case "Premium":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          Premium
        </span>
      case "Basic":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Basic
        </span>
      case "Enterprise":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-100 text-gold-800">
          Enterprise
        </span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {type}
        </span>
    }
  }

  return (
    <CompanyStaffOnly>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
            <Building2 className="w-8 h-8" />
            Hồ sơ công ty
          </h1>
          <p className="text-gray-600 dark:text-yellow-200 mt-2">
            Quản lý thông tin công ty taxi và các dịch vụ liên quan
          </p>
        </div>
        {(userRole === "MANAGER" || userRole === "ADMIN") && (
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
        )}
      </div>

      {/* Company Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Tổng xe</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {vehicles.length}
                </p>
              </div>
              <Car className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Đơn hàng hôm nay</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {orders.filter(order => order.createdAt.includes(new Date().toISOString().split('T')[0])).length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Doanh thu tháng</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()} VNĐ
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Đánh giá</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  4.8 <Star className="h-4 w-4 inline text-orange-500" />
                </p>
              </div>
              <Star className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Details */}
      {companies.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {companies.map((company) => (
            <Card key={company.id} className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-yellow-500/10 dark:bg-yellow-900/20 p-6 border-b border-yellow-500/20">
                <CardTitle className="text-2xl font-bold text-yellow-800 dark:text-yellow-400 flex items-center">
                  <Building2 className="w-6 h-6 mr-3 text-yellow-600 dark:text-yellow-500" />
                  {company.name} ({company.code})
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-yellow-200 mt-1">
                  {company.address}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Điện thoại</p>
                      <p className="font-medium">{company.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{company.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Địa chỉ</p>
                      <p className="font-medium">{company.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Ngày tham gia</p>
                      <p className="font-medium">{company.joinDate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(company.status)}
                    {getMembershipBadge(company.membershipType)}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Doanh thu</p>
                    <p className="text-lg font-bold text-green-600">{company.revenue.toLocaleString()} VNĐ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      </div>
    </CompanyStaffOnly>
  )
}