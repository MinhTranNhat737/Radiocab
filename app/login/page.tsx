"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogIn, Shield, User, Eye, EyeOff, Building2 } from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header"

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

  const handleAdminInputChange = (field: string, value: string) => {
    setAdminData((prev) => ({ ...prev, [field]: value }))
  }

  const handleUserInputChange = (field: string, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Admin login:", adminData)
    // Redirect to admin page
    window.location.href = "/admin"
  }

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("User login:", userData)
    // Redirect to user dashboard or profile
    alert("Đăng nhập thành công! Chuyển đến trang quản lý cá nhân.")
  }

  return (
    <div className="min-h-screen bg-black text-yellow-400">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-black via-yellow-900/10 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,193,7,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent animate-pulse">
            Đăng nhập Hệ thống
          </h1>
          <p className="text-xl text-yellow-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Truy cập vào tài khoản của bạn để quản lý thông tin và sử dụng các dịch vụ của RadioCabs.in
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
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
                <Card className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-yellow-400 mb-2 flex items-center justify-center gap-2">
                      <User className="w-6 h-6" />
                      Đăng nhập Người dùng
                    </CardTitle>
                    <CardDescription className="text-yellow-200">
                      Dành cho công ty, tài xế và nhà quảng cáo đã đăng ký
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUserSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="userId" className="text-yellow-300">
                          Mã người dùng *
                        </Label>
                        <Input
                          id="userId"
                          value={userData.userId}
                          onChange={(e) => handleUserInputChange("userId", e.target.value)}
                          className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400"
                          placeholder="Nhập mã công ty, mã tài xế hoặc mã quảng cáo"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="userPassword" className="text-yellow-300">
                          Mật khẩu *
                        </Label>
                        <div className="relative">
                          <Input
                            id="userPassword"
                            type={showUserPassword ? "text" : "password"}
                            value={userData.password}
                            onChange={(e) => handleUserInputChange("password", e.target.value)}
                            className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400 pr-10"
                            placeholder="Nhập mật khẩu"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowUserPassword(!showUserPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-400 hover:text-yellow-300"
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
                          <Link href="/listing" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                            Đăng ký công ty taxi
                          </Link>
                          <Link href="/drivers" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                            Đăng ký tài xế
                          </Link>
                          <Link href="/advertise" className="text-yellow-400 hover:text-yellow-300 transition-colors">
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
                <Card className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-yellow-400 mb-2 flex items-center justify-center gap-2">
                      <Shield className="w-6 h-6" />
                      Đăng nhập Quản trị viên
                    </CardTitle>
                    <CardDescription className="text-yellow-200">
                      Dành cho quản trị viên hệ thống RadioCabs.in
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAdminSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="adminUsername" className="text-yellow-300">
                          Tên đăng nhập *
                        </Label>
                        <Input
                          id="adminUsername"
                          value={adminData.username}
                          onChange={(e) => handleAdminInputChange("username", e.target.value)}
                          className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400"
                          placeholder="Nhập tên đăng nhập admin"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="adminPassword" className="text-yellow-300">
                          Mật khẩu *
                        </Label>
                        <div className="relative">
                          <Input
                            id="adminPassword"
                            type={showAdminPassword ? "text" : "password"}
                            value={adminData.password}
                            onChange={(e) => handleAdminInputChange("password", e.target.value)}
                            className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400 pr-10"
                            placeholder="Nhập mật khẩu admin"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowAdminPassword(!showAdminPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-400 hover:text-yellow-300"
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
      <section className="py-16 bg-gradient-to-r from-yellow-900/10 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-yellow-400 mb-12">Tính năng sau khi đăng nhập</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/30 text-center">
              <CardContent className="p-6">
                <Building2 className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">Quản lý thông tin</h3>
                <p className="text-yellow-200 text-sm">Cập nhật thông tin công ty, tài xế hoặc quảng cáo của bạn</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/30 text-center">
              <CardContent className="p-6">
                <User className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">Theo dõi trạng thái</h3>
                <p className="text-yellow-200 text-sm">Xem trạng thái đăng ký và tình hình thanh toán</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/30 text-center">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">Bảo mật cao</h3>
                <p className="text-yellow-200 text-sm">Thông tin được bảo mật và mã hóa an toàn</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-black via-yellow-900/20 to-black border-t border-yellow-500/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                  <LogIn className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold text-yellow-400">RadioCabs.in</span>
              </div>
              <p className="text-yellow-200 text-sm leading-relaxed">
                Cổng thông tin kết nối công ty taxi, tài xế và khách hàng tại Việt Nam.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-yellow-400 font-semibold">Dịch vụ</h4>
              <ul className="space-y-2 text-yellow-200 text-sm">
                <li>
                  <Link href="/listing" className="hover:text-yellow-300 transition-colors">
                    Đăng ký công ty
                  </Link>
                </li>
                <li>
                  <Link href="/drivers" className="hover:text-yellow-300 transition-colors">
                    Đăng ký tài xế
                  </Link>
                </li>
                <li>
                  <Link href="/advertise" className="hover:text-yellow-300 transition-colors">
                    Quảng cáo
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-yellow-300 transition-colors">
                    Thông tin dịch vụ
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-yellow-400 font-semibold">Hỗ trợ</h4>
              <ul className="space-y-2 text-yellow-200 text-sm">
                <li>
                  <Link href="/feedback" className="hover:text-yellow-300 transition-colors">
                    Góp ý
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-yellow-300 transition-colors">
                    Đăng nhập
                  </Link>
                </li>
                <li>
                  <a href="tel:1900-xxxx" className="hover:text-yellow-300 transition-colors">
                    Hotline: 1900-xxxx
                  </a>
                </li>
                <li>
                  <a href="mailto:info@radiocabs.in" className="hover:text-yellow-300 transition-colors">
                    Email: info@radiocabs.in
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-yellow-400 font-semibold">Bảo mật</h4>
              <div className="space-y-2 text-yellow-200 text-sm">
                <p>Thông tin được mã hóa SSL</p>
                <p>Bảo mật dữ liệu cá nhân</p>
                <p>Tuân thủ quy định GDPR</p>
              </div>
            </div>
          </div>

          <div className="border-t border-yellow-500/30 mt-8 pt-8 text-center">
            <p className="text-yellow-200 text-sm">© 2025 RadioCabs.in. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
