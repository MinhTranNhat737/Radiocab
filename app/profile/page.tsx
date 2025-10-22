"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  User, 
  Building2, 
  Car, 
  CreditCard, 
  FileText, 
  Bell, 
  Settings,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  TrendingUp,
  DollarSign,
  Eye,
  Download
} from "lucide-react"
import Link from "next/link"
import RoleSelector from "@/components/RoleSelector"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userRole, setUserRole] = useState<"ADMIN" | "MANAGER" | "DRIVER" | "ACCOUNTANT" | "DISPATCHER" | "CUSTOMER">("ADMIN")
  const [profileData, setProfileData] = useState({
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0123-456-789",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    company: "ABC Taxi Company",
    role: "ADMIN",
    joinDate: "15/03/2024",
    status: "active"
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSave = () => {
    setSuccess("Thông tin đã được cập nhật thành công!")
    setIsEditing(false)
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setError("")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Hoạt động
        </span>
      case "pending":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Chờ duyệt
        </span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
    }
  }

  return (
    <div className="min-h-screen bg-black text-yellow-400 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 text-gray-900 dark:bg-black dark:text-yellow-400 page-enter">

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 dark:from-black dark:via-yellow-900/10 dark:to-black relative overflow-hidden fade-in-scale">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,193,7,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-black dark:bg-gradient-to-r dark:from-yellow-400 dark:via-yellow-300 dark:to-yellow-500 dark:bg-clip-text dark:text-transparent animate-pulse">
            Trang cá nhân
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-yellow-200 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            Quản lý thông tin cá nhân và tài khoản của bạn
          </p>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-12 sm:py-16 slide-in-left">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Role Selector */}
            <RoleSelector 
              currentRole={userRole} 
              onRoleChange={setUserRole} 
            />

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-yellow-900/20 border border-yellow-500/30">
                <TabsTrigger value="profile" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                  <User className="w-4 h-4 mr-2" />
                  Hồ sơ
                </TabsTrigger>
                <TabsTrigger value="account" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                  <Building2 className="w-4 h-4 mr-2" />
                  Tài khoản
                </TabsTrigger>
                <TabsTrigger value="payment" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Thanh toán
                </TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                  <FileText className="w-4 h-4 mr-2" />
                  Báo cáo
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Profile Information */}
                  <div className="lg:col-span-2">
                    <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-2xl text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                            <User className="w-6 h-6" />
                            Thông tin cá nhân
                          </CardTitle>
                          {!isEditing ? (
                            <Button
                              onClick={() => setIsEditing(true)}
                              variant="outline"
                              className="border-yellow-500/50 text-primary hover:bg-yellow-500/10"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Chỉnh sửa
                            </Button>
                          ) : (
                            <div className="flex gap-2">
                              <Button
                                onClick={handleSave}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Lưu
                              </Button>
                              <Button
                                onClick={handleCancel}
                                variant="outline"
                                className="border-red-500/50 text-red-600 hover:bg-red-500/10"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Hủy
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {success && (
                          <Alert className="bg-green-900/20 border-green-500/50 mb-4">
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>{success}</AlertDescription>
                          </Alert>
                        )}

                        {error && (
                          <Alert variant="destructive" className="bg-red-900/20 border-red-500/50 mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}

                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="fullName" className="text-gray-700 dark:text-yellow-300">
                                Họ và tên
                              </Label>
                              {isEditing ? (
                                <Input
                                  id="fullName"
                                  value={profileData.fullName}
                                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                                  className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                                />
                              ) : (
                                <p className="text-gray-900 dark:text-yellow-400 font-medium">{profileData.fullName}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-gray-700 dark:text-yellow-300">
                                Email
                              </Label>
                              {isEditing ? (
                                <Input
                                  id="email"
                                  type="email"
                                  value={profileData.email}
                                  onChange={(e) => handleInputChange("email", e.target.value)}
                                  className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                                />
                              ) : (
                                <p className="text-gray-900 dark:text-yellow-400 font-medium">{profileData.email}</p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="phone" className="text-gray-700 dark:text-yellow-300">
                                Số điện thoại
                              </Label>
                              {isEditing ? (
                                <Input
                                  id="phone"
                                  value={profileData.phone}
                                  onChange={(e) => handleInputChange("phone", e.target.value)}
                                  className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                                />
                              ) : (
                                <p className="text-gray-900 dark:text-yellow-400 font-medium">{profileData.phone}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="company" className="text-gray-700 dark:text-yellow-300">
                                Công ty
                              </Label>
                              {isEditing ? (
                                <Input
                                  id="company"
                                  value={profileData.company}
                                  onChange={(e) => handleInputChange("company", e.target.value)}
                                  className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                                />
                              ) : (
                                <p className="text-gray-900 dark:text-yellow-400 font-medium">{profileData.company}</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address" className="text-gray-700 dark:text-yellow-300">
                              Địa chỉ
                            </Label>
                            {isEditing ? (
                              <Input
                                id="address"
                                value={profileData.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                              />
                            ) : (
                              <p className="text-gray-900 dark:text-yellow-400 font-medium">{profileData.address}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Profile Stats */}
                  <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
                      <CardHeader>
                        <CardTitle className="text-xl text-gray-900 dark:text-yellow-400">
                          Thống kê tài khoản
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-yellow-300">Trạng thái</span>
                          {getStatusBadge(profileData.status)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-yellow-300">Tham gia</span>
                          <span className="text-gray-900 dark:text-yellow-400 font-medium">{profileData.joinDate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-yellow-300">Loại tài khoản</span>
                          <span className="text-gray-900 dark:text-yellow-400 font-medium capitalize">{profileData.role}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
                      <CardHeader>
                        <CardTitle className="text-xl text-gray-900 dark:text-yellow-400">
                          Hoạt động gần đây
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600 dark:text-yellow-200">Đăng nhập lần cuối: Hôm nay</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600 dark:text-yellow-200">Cập nhật thông tin: 2 ngày trước</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm text-gray-600 dark:text-yellow-200">Thanh toán: 1 tuần trước</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Account Tab */}
              <TabsContent value="account">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                        <Building2 className="w-6 h-6" />
                        Thông tin tài khoản
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-yellow-300">Loại tài khoản</span>
                        <span className="text-gray-900 dark:text-yellow-400 font-medium capitalize">{profileData.role}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-yellow-300">Trạng thái</span>
                        {getStatusBadge(profileData.status)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-yellow-300">Ngày tạo</span>
                        <span className="text-gray-900 dark:text-yellow-400 font-medium">{profileData.joinDate}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                        <Settings className="w-6 h-6" />
                        Cài đặt tài khoản
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button className="w-full justify-start" variant="outline">
                        <Bell className="w-4 h-4 mr-2" />
                        Cài đặt thông báo
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Cài đặt bảo mật
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <User className="w-4 h-4 mr-2" />
                        Đổi mật khẩu
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Payment Tab */}
              <TabsContent value="payment">
                <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                      <CreditCard className="w-6 h-6" />
                      Thông tin thanh toán
                    </CardTitle>
                    <CardDescription className="text-yellow-200">
                      Quản lý phương thức thanh toán và lịch sử giao dịch
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-white/50 dark:bg-black/30 border-yellow-500/30">
                          <CardContent className="p-4 text-center">
                            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <h3 className="font-semibold text-gray-900 dark:text-yellow-400">Tổng chi</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-yellow-400">2,500,000 VND</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-white/50 dark:bg-black/30 border-yellow-500/30">
                          <CardContent className="p-4 text-center">
                            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <h3 className="font-semibold text-gray-900 dark:text-yellow-400">Thanh toán tiếp theo</h3>
                            <p className="text-lg font-bold text-gray-900 dark:text-yellow-400">15/01/2025</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-white/50 dark:bg-black/30 border-yellow-500/30">
                          <CardContent className="p-4 text-center">
                            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <h3 className="font-semibold text-gray-900 dark:text-yellow-400">Gói hiện tại</h3>
                            <p className="text-lg font-bold text-gray-900 dark:text-yellow-400">Premium</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="flex gap-4">
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Thêm phương thức
                        </Button>
                        <Button variant="outline" className="border-yellow-500/50 text-primary hover:bg-yellow-500/10">
                          <Eye className="w-4 h-4 mr-2" />
                          Xem lịch sử
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports">
                <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                      <FileText className="w-6 h-6" />
                      Báo cáo cá nhân
                    </CardTitle>
                    <CardDescription className="text-yellow-200">
                      Xem và tải xuống các báo cáo cá nhân
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-white/50 dark:bg-black/30 border-yellow-500/30">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-yellow-400">Báo cáo tháng</h3>
                                <p className="text-sm text-gray-600 dark:text-yellow-200">Tháng 12/2024</p>
                              </div>
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-white/50 dark:bg-black/30 border-yellow-500/30">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-yellow-400">Báo cáo quý</h3>
                                <p className="text-sm text-gray-600 dark:text-yellow-200">Q4/2024</p>
                              </div>
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gradient-to-r from-yellow-100/80 to-yellow-200/80 dark:from-yellow-900/10 dark:to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-yellow-400 mb-12">Thao tác nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Link href="/notifications">
              <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <Bell className="w-12 h-12 text-gray-700 dark:text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Thông báo</h3>
                  <p className="text-gray-600 dark:text-yellow-200 text-sm">Xem thông báo mới</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/user/dashboard/company/payments">
              <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <CreditCard className="w-12 h-12 text-gray-700 dark:text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Thanh toán</h3>
                  <p className="text-gray-600 dark:text-yellow-200 text-sm">Quản lý thanh toán</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/contact">
              <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <Phone className="w-12 h-12 text-gray-700 dark:text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Liên hệ</h3>
                  <p className="text-gray-600 dark:text-yellow-200 text-sm">Hỗ trợ khách hàng</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/feedback">
              <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <Star className="w-12 h-12 text-gray-700 dark:text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Phản hồi</h3>
                  <p className="text-gray-600 dark:text-yellow-200 text-sm">Gửi phản hồi dịch vụ</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
