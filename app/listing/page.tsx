"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Building2, Phone, Mail, MapPin, CreditCard, Users } from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header"

export default function ListingPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyId: "",
    password: "",
    contactPerson: "",
    designation: "",
    address: "",
    mobile: "",
    telephone: "",
    fax: "",
    email: "",
    membershipType: "",
    paymentType: "",
  })

  const [searchQuery, setSearchQuery] = useState("")

  const membershipPrices = {
    Premium: { monthly: 500000, quarterly: 1350000 },
    Basic: { monthly: 200000, quarterly: 540000 },
    Free: { monthly: 0, quarterly: 0 },
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const handleReset = () => {
    setFormData({
      companyName: "",
      companyId: "",
      password: "",
      contactPerson: "",
      designation: "",
      address: "",
      mobile: "",
      telephone: "",
      fax: "",
      email: "",
      membershipType: "",
      paymentType: "",
    })
  }

  const getPrice = () => {
    if (!formData.membershipType || !formData.paymentType) return 0
    return membershipPrices[formData.membershipType as keyof typeof membershipPrices][
      formData.paymentType as "monthly" | "quarterly"
    ]
  }

  return (
    <div className="min-h-screen bg-black text-yellow-400 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 text-gray-900 dark:bg-black dark:text-yellow-400">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 dark:from-black dark:via-yellow-900/10 dark:to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,193,7,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent animate-pulse">
            Đăng ký & Tìm kiếm Công ty Taxi
          </h1>
          <p className="text-xl text-yellow-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Đăng ký công ty taxi của bạn hoặc tìm kiếm các công ty taxi đã đăng ký trên hệ thống RadioCabs.in
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="register" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-yellow-900/20 border border-yellow-500/30">
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
              >
                Đăng ký công ty
              </TabsTrigger>
              <TabsTrigger value="search" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                Tìm kiếm công ty
              </TabsTrigger>
            </TabsList>

            {/* Registration Form */}
            <TabsContent value="register">
              <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl text-gray-900 dark:text-yellow-400 mb-2">Đăng ký công ty taxi</CardTitle>
                  <CardDescription className="text-yellow-200">
                    Điền thông tin để đăng ký công ty taxi của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Company Information */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-yellow-400 flex items-center gap-2">
                          <Building2 className="w-5 h-5" />
                          Thông tin công ty
                        </h3>

                        <div className="space-y-2">
                          <Label htmlFor="companyName" className="text-yellow-300">
                            Tên công ty *
                          </Label>
                          <Input
                            id="companyName"
                            value={formData.companyName}
                            onChange={(e) => handleInputChange("companyName", e.target.value)}
                            className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="companyId" className="text-yellow-300">
                            Mã công ty (duy nhất) *
                          </Label>
                          <Input
                            id="companyId"
                            value={formData.companyId}
                            onChange={(e) => handleInputChange("companyId", e.target.value)}
                            className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-yellow-300">
                            Mật khẩu *
                          </Label>
                          <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contactPerson" className="text-yellow-300">
                            Người liên hệ *
                          </Label>
                          <Input
                            id="contactPerson"
                            value={formData.contactPerson}
                            onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                            className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="designation" className="text-yellow-300">
                            Chức vụ
                          </Label>
                          <Input
                            id="designation"
                            value={formData.designation}
                            onChange={(e) => handleInputChange("designation", e.target.value)}
                            className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                          />
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-yellow-400 flex items-center gap-2">
                          <Phone className="w-5 h-5" />
                          Thông tin liên hệ
                        </h3>

                        <div className="space-y-2">
                          <Label htmlFor="address" className="text-yellow-300">
                            Địa chỉ *
                          </Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mobile" className="text-yellow-300">
                            Số điện thoại *
                          </Label>
                          <Input
                            id="mobile"
                            value={formData.mobile}
                            onChange={(e) => handleInputChange("mobile", e.target.value)}
                            className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="telephone" className="text-yellow-300">
                            Điện thoại bàn
                          </Label>
                          <Input
                            id="telephone"
                            value={formData.telephone}
                            onChange={(e) => handleInputChange("telephone", e.target.value)}
                            className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="fax" className="text-yellow-300">
                            Fax
                          </Label>
                          <Input
                            id="fax"
                            value={formData.fax}
                            onChange={(e) => handleInputChange("fax", e.target.value)}
                            className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-yellow-300">
                            Email *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Membership & Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-yellow-500/30">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-yellow-400 flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Loại thành viên
                        </h3>
                        <Select
                          value={formData.membershipType}
                          onValueChange={(value) => handleInputChange("membershipType", value)}
                        >
                          <SelectTrigger className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100">
                            <SelectValue placeholder="Chọn loại thành viên" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-black border-yellow-500/50">
                            <SelectItem value="Premium" className="text-gray-900 dark:text-yellow-100">
                              Premium
                            </SelectItem>
                            <SelectItem value="Basic" className="text-yellow-100">
                              Basic
                            </SelectItem>
                            <SelectItem value="Free" className="text-yellow-100">
                              Free
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-yellow-400 flex items-center gap-2">
                          <CreditCard className="w-5 h-5" />
                          Hình thức thanh toán
                        </h3>
                        <Select
                          value={formData.paymentType}
                          onValueChange={(value) => handleInputChange("paymentType", value)}
                        >
                          <SelectTrigger className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100">
                            <SelectValue placeholder="Chọn hình thức thanh toán" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-black border-yellow-500/50">
                            <SelectItem value="monthly" className="text-yellow-100">
                              Theo tháng
                            </SelectItem>
                            <SelectItem value="quarterly" className="text-yellow-100">
                              Theo quý
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Price Display */}
                    {formData.membershipType && formData.paymentType && (
                      <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 p-4 rounded-lg border border-yellow-500/30">
                        <p className="text-yellow-300 text-lg">
                          Phí {formData.paymentType === "monthly" ? "hàng tháng" : "hàng quý"}:
                          <span className="text-yellow-400 font-bold ml-2">
                            {getPrice().toLocaleString("vi-VN")} VNĐ
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300"
                      >
                        Đăng ký
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="flex-1 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 py-3 bg-transparent"
                      >
                        Đặt lại
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Search Section */}
            <TabsContent value="search">
              <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl text-gray-900 dark:text-yellow-400 mb-2">Tìm kiếm công ty taxi</CardTitle>
                  <CardDescription className="text-yellow-200">
                    Tìm kiếm các công ty taxi đã đăng ký trên hệ thống
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 w-5 h-5" />
                        <Input
                          placeholder="Nhập tên công ty, mã công ty hoặc địa chỉ..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                        />
                      </div>
                      <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold px-8">
                        Tìm kiếm
                      </Button>
                    </div>

                    {/* Search Results Placeholder */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-yellow-400">Kết quả tìm kiếm</h3>
                      <div className="text-yellow-200 text-center py-12 border border-yellow-500/30 rounded-lg bg-yellow-900/10">
                        <Search className="w-12 h-12 text-yellow-400 mx-auto mb-4 opacity-50" />
                        <p>Nhập từ khóa để tìm kiếm công ty taxi</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

    </div>
  )
}
