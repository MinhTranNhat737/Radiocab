"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Shield, 
  User, 
  Building2, 
  Car,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star
} from "lucide-react"

export default function AccountsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("admins")

  // Mock data - sẽ được thay thế bằng API calls
  const adminAccounts = [
    {
      id: 1,
      username: "admin",
      password: "admin123",
      email: "admin@radiocabs.in",
      fullName: "Nguyễn Văn Admin",
      role: "Super Admin",
      status: "active",
      lastLogin: "2025-01-15 14:30:00",
      createdDate: "2024-01-01",
      permissions: ["Full Access", "User Management", "System Settings"]
    },
    {
      id: 2,
      username: "moderator",
      password: "moderator123",
      email: "moderator@radiocabs.in",
      fullName: "Trần Thị Moderator",
      role: "Moderator",
      status: "active",
      lastLogin: "2025-01-15 10:15:00",
      createdDate: "2024-03-15",
      permissions: ["User Management", "Content Review"]
    },
    {
      id: 3,
      username: "support",
      password: "support123",
      email: "support@radiocabs.in",
      fullName: "Lê Văn Support",
      role: "Support",
      status: "inactive",
      lastLogin: "2025-01-10 16:45:00",
      createdDate: "2024-06-01",
      permissions: ["Customer Support"]
    }
  ]

  const userAccounts = [
    {
      id: 1,
      userId: "CP001",
      password: "company123",
      email: "contact@abctaxi.com",
      fullName: "Nguyễn Văn A",
      companyName: "ABC Taxi Company",
      role: "Company",
      status: "active",
      membershipType: "Premium",
      lastLogin: "2025-01-15 13:20:00",
      createdDate: "2024-02-15",
      phone: "0123-456-789",
      city: "TP. Hồ Chí Minh"
    },
    {
      id: 2,
      userId: "DR001",
      password: "driver123",
      email: "driver@email.com",
      fullName: "Trần Thị B",
      companyName: "XYZ Transport",
      role: "Driver",
      status: "active",
      membershipType: "Basic",
      lastLogin: "2025-01-15 12:10:00",
      createdDate: "2024-03-20",
      phone: "0987-654-321",
      city: "Hà Nội"
    },
    {
      id: 3,
      userId: "CP002",
      password: "company456",
      email: "info@xyztransport.com",
      fullName: "Lê Văn C",
      companyName: "XYZ Transport",
      role: "Company",
      status: "pending",
      membershipType: "Basic",
      lastLogin: "2025-01-14 09:30:00",
      createdDate: "2024-11-20",
      phone: "0912-345-678",
      city: "Đà Nẵng"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
      case "inactive":
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" /> Inactive</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Super Admin":
        return <Badge className="bg-red-100 text-red-800"><Shield className="h-3 w-3 mr-1" /> Super Admin</Badge>
      case "Moderator":
        return <Badge className="bg-blue-100 text-blue-800"><User className="h-3 w-3 mr-1" /> Moderator</Badge>
      case "Support":
        return <Badge className="bg-purple-100 text-purple-800"><User className="h-3 w-3 mr-1" /> Support</Badge>
      case "Company":
        return <Badge className="bg-orange-100 text-orange-800"><Building2 className="h-3 w-3 mr-1" /> Company</Badge>
      case "Driver":
        return <Badge className="bg-green-100 text-green-800"><Car className="h-3 w-3 mr-1" /> Driver</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const filteredAdmins = adminAccounts.filter(admin => 
    admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredUsers = userAccounts.filter(user => 
    user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản lý Tài khoản</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý tài khoản admin và người dùng trong hệ thống
        </p>
      </div>

      {/* Demo Login Credentials */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Thông tin đăng nhập Demo
          </CardTitle>
          <CardDescription className="text-blue-600">
            Sử dụng thông tin này để đăng nhập và test hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-800">Admin Accounts</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-800">Super Admin</Badge>
                  <span className="text-sm font-mono">admin / admin123</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800">Moderator</Badge>
                  <span className="text-sm font-mono">moderator / moderator123</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-100 text-purple-800">Support</Badge>
                  <span className="text-sm font-mono">support / support123</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-800">User Accounts</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-100 text-orange-800">Company</Badge>
                  <span className="text-sm font-mono">CP001 / company123</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">Driver</Badge>
                  <span className="text-sm font-mono">DR001 / driver123</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-100 text-orange-800">Company</Badge>
                  <span className="text-sm font-mono">CP002 / company456</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tài khoản..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="admins">
            <Shield className="h-4 w-4 mr-2" />
            Admin Accounts ({adminAccounts.length})
          </TabsTrigger>
          <TabsTrigger value="users">
            <User className="h-4 w-4 mr-2" />
            User Accounts ({userAccounts.length})
          </TabsTrigger>
        </TabsList>

        {/* Admin Accounts Tab */}
        <TabsContent value="admins" className="space-y-6">
          <div className="grid gap-6">
            {filteredAdmins.map((admin) => (
              <Card key={admin.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Shield className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{admin.fullName}</CardTitle>
                        <CardDescription>@{admin.username} • {admin.email}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getRoleBadge(admin.role)}
                      {getStatusBadge(admin.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{admin.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono bg-muted px-2 py-1 rounded">Username: {admin.username}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono bg-muted px-2 py-1 rounded">Password: {admin.password}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Tạo: {admin.createdDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Đăng nhập cuối: {admin.lastLogin}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Quyền hạn:</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {admin.permissions.map((permission, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Xem
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Sửa
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* User Accounts Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid gap-6">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        {user.role === 'Company' ? (
                          <Building2 className="h-6 w-6 text-primary" />
                        ) : (
                          <Car className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{user.fullName}</CardTitle>
                        <CardDescription>{user.userId} • {user.email}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono bg-muted px-2 py-1 rounded">User ID: {user.userId}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono bg-muted px-2 py-1 rounded">Password: {user.password}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{user.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{user.city}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{user.companyName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Tạo: {user.createdDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Đăng nhập cuối: {user.lastLogin}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      {user.membershipType} Membership
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Xem
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Sửa
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
