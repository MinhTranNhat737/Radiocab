"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Megaphone, Building2, Phone, Mail, MapPin, CreditCard, FileText } from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header"

export default function AdvertisePage() {
  const [formData, setFormData] = useState({
    companyName: "",
    designation: "",
    address: "",
    mobile: "",
    telephone: "",
    fax: "",
    email: "",
    description: "",
    paymentType: "",
  })

  const advertisePrices = {
    monthly: 300000,
    quarterly: 800000,
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Advertise form submitted:", formData)
  }

  const handleReset = () => {
    setFormData({
      companyName: "",
      designation: "",
      address: "",
      mobile: "",
      telephone: "",
      fax: "",
      email: "",
      description: "",
      paymentType: "",
    })
  }

  const getPrice = () => {
    if (!formData.paymentType) return 0
    return advertisePrices[formData.paymentType as "monthly" | "quarterly"]
  }

  return (
    <div className="min-h-screen bg-black text-yellow-400 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 text-gray-900 dark:bg-black dark:text-yellow-400 page-enter">
      <Header />

      {/* Hero Section */}
      <section className="hero-section py-20 bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 dark:from-black dark:via-yellow-900/10 dark:to-black relative overflow-hidden fade-in-scale">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,193,7,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black dark:bg-gradient-to-r dark:from-yellow-400 dark:via-yellow-300 dark:to-yellow-500 dark:bg-clip-text dark:text-transparent animate-pulse">
            Quảng cáo Dịch vụ Taxi
          </h1>
          <p className="text-xl text-gray-700 dark:text-yellow-200 mb-8 max-w-3xl mx-auto leading-relaxed" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), -2px -2px 4px rgba(0,0,0,0.8), 2px -2px 4px rgba(0,0,0,0.8), -2px 2px 4px rgba(0,0,0,0.8)' }}>
            Đăng ký quảng cáo dịch vụ taxi của bạn để tiếp cận nhiều khách hàng hơn trên RadioCabs.in
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 slide-in-left">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/30 shadow-2xl shadow-yellow-500/10 max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-gray-900 dark:text-yellow-400 mb-2">Đăng ký quảng cáo</CardTitle>
              <CardDescription className="text-gray-600 dark:text-yellow-200">
                Điền thông tin để đăng ký quảng cáo dịch vụ taxi của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Thông tin công ty
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-gray-700 dark:text-yellow-300">
                        Tên công ty *
                      </Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="designation" className="text-gray-700 dark:text-yellow-300">
                        Chức vụ người liên hệ
                      </Label>
                      <Input
                        id="designation"
                        value={formData.designation}
                        onChange={(e) => handleInputChange("designation", e.target.value)}
                        className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-gray-700 dark:text-yellow-300">
                        Địa chỉ *
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      Thông tin liên hệ
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-gray-700 dark:text-yellow-300">
                        Số điện thoại *
                      </Label>
                      <Input
                        id="mobile"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange("mobile", e.target.value)}
                        className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telephone" className="text-gray-700 dark:text-yellow-300">
                        Điện thoại bàn
                      </Label>
                      <Input
                        id="telephone"
                        value={formData.telephone}
                        onChange={(e) => handleInputChange("telephone", e.target.value)}
                        className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fax" className="text-gray-700 dark:text-yellow-300">
                        Fax
                      </Label>
                      <Input
                        id="fax"
                        value={formData.fax}
                        onChange={(e) => handleInputChange("fax", e.target.value)}
                        className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 dark:text-yellow-300">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4 pt-6 border-t border-yellow-500/30">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Mô tả dịch vụ
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-700 dark:text-yellow-300">
                      Mô tả chi tiết về dịch vụ *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400 min-h-[120px]"
                      placeholder="Mô tả về dịch vụ taxi, khu vực hoạt động, ưu điểm của công ty..."
                      required
                    />
                  </div>
                </div>

                {/* Payment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-yellow-500/30">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Hình thức thanh toán
                    </h3>
                    <Select
                      value={formData.paymentType}
                      onValueChange={(value) => handleInputChange("paymentType", value)}
                    >
                      <SelectTrigger className="bg-black/50 border-yellow-500/50 text-yellow-100">
                        <SelectValue placeholder="Chọn hình thức thanh toán" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-yellow-500/50">
                        <SelectItem value="monthly" className="text-yellow-100">
                          Theo tháng
                        </SelectItem>
                        <SelectItem value="quarterly" className="text-yellow-100">
                          Theo quý
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Display */}
                  {formData.paymentType && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400">Chi phí quảng cáo</h3>
                      <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 p-4 rounded-lg border border-yellow-500/30">
                        <p className="text-gray-700 dark:text-yellow-300 text-lg">
                          Phí {formData.paymentType === "monthly" ? "hàng tháng" : "hàng quý"}:
                          <span className="text-gray-900 dark:text-yellow-400 font-bold ml-2">
                            {getPrice().toLocaleString("vi-VN")} VNĐ
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Benefits Section */}
                <div className="bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 p-6 rounded-lg border border-yellow-500/30">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-4">Lợi ích khi quảng cáo với RadioCabs.in</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600 dark:text-yellow-200">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      Hiển thị thông tin công ty nổi bật
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      Tiếp cận khách hàng tiềm năng
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      Tăng độ nhận biết thương hiệu
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      Báo cáo thống kê chi tiết
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300"
                  >
                    Đăng ký quảng cáo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="flex-1 border-yellow-500/50 text-gray-700 dark:text-yellow-400 hover:bg-yellow-500/10 py-3 bg-transparent"
                  >
                    Đặt lại
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  )
}
