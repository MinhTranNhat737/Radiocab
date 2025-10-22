"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  User,
  Mail,
  Phone,
  Building2
} from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { useEffect, useState } from "react"

// Mock employees data
const mockEmployees = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@company.com",
    phone: "0901234567",
    role: "MANAGER",
    department: "Quản lý",
    status: "ACTIVE",
    joinDate: "2024-01-15",
    avatar: "/placeholderUser.jpg"
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@company.com",
    phone: "0901234568",
    role: "ACCOUNTANT",
    department: "Kế toán",
    status: "ACTIVE",
    joinDate: "2024-02-01",
    avatar: "/placeholderUser.jpg"
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@company.com",
    phone: "0901234569",
    role: "DISPATCHER",
    department: "Điều phối",
    status: "ACTIVE",
    joinDate: "2024-02-15",
    avatar: "/placeholderUser.jpg"
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@company.com",
    phone: "0901234570",
    role: "DRIVER",
    department: "Tài xế",
    status: "ACTIVE",
    joinDate: "2024-03-01",
    avatar: "/placeholderUser.jpg"
  }
]

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [employees, setEmployees] = useState(mockEmployees)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      MANAGER: { label: "Quản lý", color: "bg-purple-100 text-purple-800" },
      ACCOUNTANT: { label: "Kế toán", color: "bg-blue-100 text-blue-800" },
      DISPATCHER: { label: "Điều phối", color: "bg-green-100 text-green-800" },
      DRIVER: { label: "Tài xế", color: "bg-orange-100 text-orange-800" }
    }
    
    const config = roleConfig[role as keyof typeof roleConfig] || { label: role, color: "bg-gray-100 text-gray-800" }
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
            <Users className="w-8 h-8" />
            Quản lý nhân viên
          </h1>
          <p className="text-gray-600 dark:text-yellow-200 mt-2">
            Quản lý thông tin nhân viên trong công ty
          </p>
        </div>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhân viên
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-gradient-to-r from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm nhân viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-yellow-300">
              {filteredEmployees.length} nhân viên
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg text-gray-900 dark:text-yellow-400">
                    {employee.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-yellow-300">
                    {employee.department}
                  </CardDescription>
                </div>
                {getRoleBadge(employee.role)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                  <Mail className="w-4 h-4 mr-2" />
                  {employee.email}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                  <Phone className="w-4 h-4 mr-2" />
                  {employee.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                  <Building2 className="w-4 h-4 mr-2" />
                  Ngày vào: {employee.joinDate}
                </div>
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
