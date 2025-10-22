"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Search, 
  Eye, 
  Download, 
  Building2, 
  Car, 
  User,
  Phone,
  Mail,
  Calendar,
  Filter,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react"
import Header from "@/components/Header"
import { getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function AdminEmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("all")
  const [selectedRole, setSelectedRole] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== 'admin') {
      router.push('/login')
      return
    }
  }, [router])

  // Mock data for employees
  const mockEmployees = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@vinasun.vn",
      phone: "0902345678",
      role: "manager",
      company: "Vinasun Taxi",
      status: "active",
      joinDate: "15/01/2024",
      lastActive: "2024-03-15T10:30:00Z"
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@mailinh.vn",
      phone: "0903456789",
      role: "manager",
      company: "Mai Linh Taxi",
      status: "active",
      joinDate: "20/01/2024",
      lastActive: "2024-03-15T09:15:00Z"
    },
    {
      id: 3,
      name: "Nguyễn Minh F",
      email: "driver001@radiocabs.in",
      phone: "0907890123",
      role: "driver",
      company: "Vinasun Taxi",
      status: "active",
      joinDate: "25/01/2024",
      lastActive: "2024-03-15T08:45:00Z"
    },
    {
      id: 4,
      name: "Trần Văn G",
      email: "driver002@radiocabs.in",
      phone: "0908901234",
      role: "driver",
      company: "Mai Linh Taxi",
      status: "active",
      joinDate: "01/02/2024",
      lastActive: "2024-03-15T07:20:00Z"
    },
    {
      id: 5,
      name: "Nguyễn Thị N",
      email: "accountant001@radiocabs.in",
      phone: "0914567890",
      role: "accountant",
      company: "Vinasun Taxi",
      status: "active",
      joinDate: "01/03/2024",
      lastActive: "2024-03-15T11:00:00Z"
    },
    {
      id: 6,
      name: "Lê Thị P",
      email: "coordinator001@radiocabs.in",
      phone: "0916789012",
      role: "coordinator",
      company: "Vinasun Taxi",
      status: "active",
      joinDate: "10/03/2024",
      lastActive: "2024-03-15T10:45:00Z"
    },
    {
      id: 7,
      name: "Lê Thị H",
      email: "driver003@radiocabs.in",
      phone: "0909012345",
      role: "driver",
      company: "Saigon Taxi",
      status: "inactive",
      joinDate: "05/02/2024",
      lastActive: "2024-03-10T16:30:00Z"
    }
  ]

  const companies = [...new Set(mockEmployees.map(emp => emp.company))]

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "manager":
        return <Badge className="bg-blue-500 text-white">Quản lý</Badge>
      case "driver":
        return <Badge className="bg-green-500 text-white">Tài xế</Badge>
      case "accountant":
        return <Badge className="bg-purple-500 text-white">Kế toán</Badge>
      case "coordinator":
        return <Badge className="bg-orange-500 text-white">Điều phối</Badge>
      default:
        return <Badge className="bg-gray-500 text-white">Không xác định</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 text-white">Hoạt động</Badge>
      case "inactive":
        return <Badge className="bg-red-500 text-white">Không hoạt động</Badge>
      default:
        return <Badge className="bg-gray-500 text-white">Không xác định</Badge>
    }
  }

  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        employee.phone.includes(searchQuery)
    
    const matchesCompany = selectedCompany === "all" || employee.company === selectedCompany
    const matchesRole = selectedRole === "all" || employee.role === selectedRole
    
    return matchesSearch && matchesCompany && matchesRole
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400 mb-2">
              Quản lý nhân viên
            </h1>
            <p className="text-gray-600 dark:text-yellow-200">
              Xem thông tin tất cả nhân viên trong hệ thống (chỉ đọc)
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-200/80 to-blue-300/80 dark:from-blue-900/20 dark:to-black border-blue-500/30 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-blue-200">Tổng nhân viên</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-blue-400">
                      {mockEmployees.length}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-200/80 to-green-300/80 dark:from-green-900/20 dark:to-black border-green-500/30 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-green-200">Đang hoạt động</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-green-400">
                      {mockEmployees.filter(e => e.status === 'active').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-200/80 to-purple-300/80 dark:from-purple-900/20 dark:to-black border-purple-500/30 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-purple-200">Tài xế</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-purple-400">
                      {mockEmployees.filter(e => e.role === 'driver').length}
                    </p>
                  </div>
                  <Car className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-200/80 to-orange-300/80 dark:from-orange-900/20 dark:to-black border-orange-500/30 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-orange-200">Quản lý</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-orange-400">
                      {mockEmployees.filter(e => e.role === 'manager').length}
                    </p>
                  </div>
                  <Building2 className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm nhân viên..."
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
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="manager">Quản lý</option>
                <option value="driver">Tài xế</option>
                <option value="accountant">Kế toán</option>
                <option value="coordinator">Điều phối</option>
              </select>
            </div>
          </div>

          {/* Employees List */}
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400">
                          {employee.name}
                        </h3>
                        {getRoleBadge(employee.role)}
                        {getStatusBadge(employee.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-yellow-300">Email</p>
                          <p className="font-medium text-gray-900 dark:text-yellow-400">{employee.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-yellow-300">Điện thoại</p>
                          <p className="font-medium text-gray-900 dark:text-yellow-400">{employee.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-yellow-300">Công ty</p>
                          <p className="font-medium text-gray-900 dark:text-yellow-400">{employee.company}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-yellow-300">Tham gia</p>
                          <p className="font-medium text-gray-900 dark:text-yellow-400">{employee.joinDate}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-yellow-300">
                          Hoạt động cuối: {new Date(employee.lastActive).toLocaleString('vi-VN')}
                        </span>
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

          {filteredEmployees.length === 0 && (
            <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-yellow-400 mb-2">
                  Không tìm thấy nhân viên
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
