"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogIn, Shield, User, Eye, EyeOff, Building2, AlertCircle } from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header"
import { login } from "@/lib/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [adminData, setAdminData] = useState({
    username: "",
    password: "",
  })

  const [userData, setUserData] = useState({
    userId: "",
    password: "",
  })

  const [showAdminPassword, setShowAdminPassword] = useState(false)
  const [showUserPassword, setShowUserPassword] = useState(false)
  const [adminError, setAdminError] = useState("")
  const [userError, setUserError] = useState("")

  const handleAdminInputChange = (field: string, value: string) => {
    setAdminData((prev) => ({ ...prev, [field]: value }))
    setAdminError("")
  }

  const handleUserInputChange = (field: string, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
    setUserError("")
  }

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const user = login(adminData.username, adminData.password)
    
    if (!user) {
      setAdminError("Tên đăng nhập hoặc mật khẩu không đúng!")
      return
    }
    
    if (user.role !== 'admin') {
      setAdminError("Tài khoản này không có quyền quản trị!")
      return
    }
    
    // Redirect to admin dashboard
    window.location.href = "/admin/dashboard"
  }

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const user = login(userData.userId, userData.password)
    
    if (!user) {
      setUserError("Mã người dùng hoặc mật khẩu không đúng!")
      return
    }
    
    if (user.role === 'admin') {
      setUserError("Vui lòng sử dụng tab Quản trị viên để đăng nhập!")
      return
    }
    
    // Redirect based on user role
    if (user.role === 'company') {
      window.location.href = "/user/dashboard/company/profile"
    } else if (user.role === 'driver') {
      window.location.href = "/user/dashboard/driver/profile"
    } else {
      window.location.href = "/user/dashboard"
    }
  }

  return (
    <div className="min-h-screen bg-black text-yellow-400 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 text-gray-900 dark:bg-black dark:text-yellow-400 page-enter">
      <Header />

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 dark:from-black dark:via-yellow-900/10 dark:to-black relative overflow-hidden fade-in-scale">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,193,7,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-black dark:bg-gradient-to-r dark:from-yellow-400 dark:via-yellow-300 dark:to-yellow-500 dark:bg-clip-text dark:text-transparent animate-pulse">
            Đăng nhập Hệ thống
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-yellow-200 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            Truy cập vào tài khoản của bạn để quản lý thông tin và sử dụng các dịch vụ của RadioCabs.in
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 slide-in-left">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-md mx-auto">
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-yellow-900/20 border border-yellow-500/30">
                <TabsTrigger value="user" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                  <User className="w-4 h-4 mr-2" />
                  Người dùng
                </TabsTrigger>
                <TabsTrigger value="admin" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                  <Shield className="w-4 h-4 mr-2" />
                  Quản trị viên
                </TabsTrigger>
              </TabsList>

              {/* User Login */}
              <TabsContent value="user">
                <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-gray-900 dark:text-yellow-400 mb-2 flex items-center justify-center gap-2">
                      <User className="w-6 h-6" />
                      Đăng nhập Người dùng
                    </CardTitle>
                    <CardDescription className="text-yellow-200">
                      Dành cho công ty, tài xế và nhà quảng cáo đã đăng ký
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUserSubmit} className="space-y-6">
                      {userError && (
                        <Alert variant="destructive" className="bg-red-900/20 border-red-500/50">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{userError}</AlertDescription>
                        </Alert>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="userId" className="text-gray-700 dark:text-yellow-300">
                          Mã người dùng *
                        </Label>
                        <Input
                          id="userId"
                          value={userData.userId}
                          onChange={(e) => handleUserInputChange("userId", e.target.value)}
                          className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                          placeholder="Nhập username, email hoặc mã người dùng"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="userPassword" className="text-gray-700 dark:text-yellow-300">
                          Mật khẩu *
                        </Label>
                        <div className="relative">
                          <Input
                            id="userPassword"
                            type={showUserPassword ? "text" : "password"}
                            value={userData.password}
                            onChange={(e) => handleUserInputChange("password", e.target.value)}
                            className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400 pr-10"
                            placeholder="Nhập mật khẩu"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowUserPassword(!showUserPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-yellow-400 hover:text-gray-800 dark:hover:text-yellow-300"
                          >
                            {showUserPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300"
                      >
                        Đăng nhập
                      </Button>

                      <div className="text-center space-y-2">
                        <p className="text-yellow-200 text-sm">Chưa có tài khoản?</p>
                        <div className="flex flex-col space-y-1 text-sm">
                          <Link href="/listing" className="text-gray-700 dark:text-yellow-400 hover:text-gray-900 dark:hover:text-yellow-300 transition-colors">
                            Đăng ký công ty taxi
                          </Link>
                          <Link href="/drivers" className="text-gray-700 dark:text-yellow-400 hover:text-gray-900 dark:hover:text-yellow-300 transition-colors">
                            Đăng ký tài xế
                          </Link>
                          <Link href="/advertise" className="text-gray-700 dark:text-yellow-400 hover:text-gray-900 dark:hover:text-yellow-300 transition-colors">
                            Đăng ký quảng cáo
                          </Link>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Admin Login */}
              <TabsContent value="admin">
                <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-gray-900 dark:text-yellow-400 mb-2 flex items-center justify-center gap-2">
                      <Shield className="w-6 h-6" />
                      Đăng nhập Quản trị viên
                    </CardTitle>
                    <CardDescription className="text-yellow-200">
                      Dành cho quản trị viên hệ thống RadioCabs.in
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAdminSubmit} className="space-y-6">
                      {adminError && (
                        <Alert variant="destructive" className="bg-red-900/20 border-red-500/50">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{adminError}</AlertDescription>
                        </Alert>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="adminUsername" className="text-gray-700 dark:text-yellow-300">
                          Tên đăng nhập *
                        </Label>
                        <Input
                          id="adminUsername"
                          value={adminData.username}
                          onChange={(e) => handleAdminInputChange("username", e.target.value)}
                          className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                          placeholder="Nhập tên đăng nhập admin"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="adminPassword" className="text-gray-700 dark:text-yellow-300">
                          Mật khẩu *
                        </Label>
                        <div className="relative">
                          <Input
                            id="adminPassword"
                            type={showAdminPassword ? "text" : "password"}
                            value={adminData.password}
                            onChange={(e) => handleAdminInputChange("password", e.target.value)}
                            className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400 pr-10"
                            placeholder="Nhập mật khẩu admin"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowAdminPassword(!showAdminPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-yellow-400 hover:text-gray-800 dark:hover:text-yellow-300"
                          >
                            {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Đăng nhập Admin
                      </Button>

                      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                        <p className="text-red-300 text-sm text-center">
                          <Shield className="w-4 h-4 inline mr-1" />
                          Khu vực dành riêng cho quản trị viên
                        </p>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-100/80 to-yellow-200/80 dark:from-yellow-900/10 dark:to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-yellow-400 mb-12">Tính năng sau khi đăng nhập</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 text-center">
              <CardContent className="p-6">
                <Building2 className="w-12 h-12 text-gray-700 dark:text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Quản lý thông tin</h3>
                <p className="text-gray-600 dark:text-yellow-200 text-sm">Cập nhật thông tin công ty, tài xế hoặc quảng cáo của bạn</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 text-center">
              <CardContent className="p-6">
                <User className="w-12 h-12 text-gray-700 dark:text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Theo dõi trạng thái</h3>
                <p className="text-gray-600 dark:text-yellow-200 text-sm">Xem trạng thái đăng ký và tình hình thanh toán</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 text-center">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-gray-700 dark:text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Bảo mật cao</h3>
                <p className="text-gray-600 dark:text-yellow-200 text-sm">Thông tin được bảo mật và mã hóa an toàn</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </div>
  )
}
