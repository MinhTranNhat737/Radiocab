"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, Shield, User, Eye, EyeOff, Building2, AlertCircle } from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header"
import { login } from "@/lib/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const user = login(loginData.username, loginData.password)
    
    if (!user) {
      setError("Tên đăng nhập hoặc mật khẩu không đúng!")
      return
    }
    
    // Redirect based on role
    switch (user.role) {
      case 'ADMIN':
        window.location.href = "/admin/dashboard"
        break
      case 'MANAGER':
        window.location.href = "/company"
        break
      case 'DRIVER':
        window.location.href = "/user/dashboard/driver/profile"
        break
      case 'ACCOUNTANT':
        window.location.href = "/company"
        break
      case 'DISPATCHER':
        window.location.href = "/company"
        break
      case 'CUSTOMER':
        window.location.href = "/booking"
        break
      default:
        window.location.href = "/user/dashboard"
    }
  }

  return (
    <div className="min-h-screen bg-black text-yellow-400 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 text-gray-900 dark:bg-black dark:text-yellow-400 page-enter">
      <Header />

      {}
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

      {}
      <section className="py-12 sm:py-16 slide-in-left">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-md mx-auto">
            <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900 dark:text-yellow-400 mb-2 flex items-center justify-center gap-2">
                  <LogIn className="w-6 h-6" />
                  Đăng nhập Hệ thống
                </CardTitle>
                <CardDescription className="text-yellow-200">
                  Hệ thống sẽ tự động phân quyền dựa trên vai trò của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive" className="bg-red-900/20 border-red-500/50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-700 dark:text-yellow-300">
                      Tên đăng nhập hoặc Email *
                    </Label>
                    <Input
                      id="username"
                      value={loginData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                      placeholder="Nhập username, email hoặc mã người dùng"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 dark:text-yellow-300">
                      Mật khẩu *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400 pr-10"
                        placeholder="Nhập mật khẩu"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-yellow-400 hover:text-gray-800 dark:hover:text-yellow-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
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
                      <Link href="/demo-accounts" className="text-gray-700 dark:text-yellow-400 hover:text-gray-900 dark:hover:text-yellow-300 transition-colors">
                        Xem tài khoản demo
                      </Link>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-gradient-to-r from-yellow-100/80 to-yellow-200/80 dark:from-yellow-900/10 dark:to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-yellow-400 mb-12">Phân quyền theo vai trò</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-red-200/80 to-red-300/80 dark:from-red-900/20 dark:to-black border-red-500/30 text-center">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-red-400 mb-2">ADMIN</h3>
                <p className="text-gray-600 dark:text-red-200 text-sm">Xem toàn hệ thống (chỉ đọc)</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-200/80 to-blue-300/80 dark:from-blue-900/20 dark:to-black border-blue-500/30 text-center">
              <CardContent className="p-6">
                <Building2 className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-blue-400 mb-2">MANAGER</h3>
                <p className="text-gray-600 dark:text-blue-200 text-sm">Quản lý đầy đủ công ty</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-200/80 to-green-300/80 dark:from-green-900/20 dark:to-black border-green-500/30 text-center">
              <CardContent className="p-6">
                <User className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-green-400 mb-2">DRIVER</h3>
                <p className="text-gray-600 dark:text-green-200 text-sm">Xem đơn hàng của mình</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-200/80 to-purple-300/80 dark:from-purple-900/20 dark:to-black border-purple-500/30 text-center">
              <CardContent className="p-6">
                <Building2 className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-purple-400 mb-2">ACCOUNTANT</h3>
                <p className="text-gray-600 dark:text-purple-200 text-sm">Xem báo cáo doanh thu</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-200/80 to-orange-300/80 dark:from-orange-900/20 dark:to-black border-orange-500/30 text-center">
              <CardContent className="p-6">
                <User className="w-12 h-12 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-orange-400 mb-2">DISPATCHER</h3>
                <p className="text-gray-600 dark:text-orange-200 text-sm">Điều phối đơn hàng</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-200/80 to-cyan-300/80 dark:from-cyan-900/20 dark:to-black border-cyan-500/30 text-center">
              <CardContent className="p-6">
                <User className="w-12 h-12 text-cyan-600 dark:text-cyan-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-cyan-400 mb-2">CUSTOMER</h3>
                <p className="text-gray-600 dark:text-cyan-200 text-sm">Đặt xe và sử dụng dịch vụ</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </div>
  )
}

