"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, User, Phone, Mail, MapPin, FileText, Star } from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header"

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    type: "",
    description: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Feedback form submitted:", formData)
    // Show success message or redirect
    alert("Cảm ơn bạn đã gửi góp ý! Chúng tôi sẽ xem xét và phản hồi sớm nhất.")
  }

  const handleReset = () => {
    setFormData({
      name: "",
      mobile: "",
      email: "",
      city: "",
      type: "",
      description: "",
    })
  }

  const feedbackTypes = [
    { value: "complaint", label: "Khiếu nại", icon: "⚠️" },
    { value: "suggestion", label: "Đề xuất", icon: "💡" },
    { value: "compliment", label: "Khen ngợi", icon: "👍" },
  ]

  return (
    <div className="min-h-screen bg-black text-yellow-400 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 text-gray-900 dark:bg-black dark:text-yellow-400 page-enter">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 dark:from-black dark:via-yellow-900/10 dark:to-black relative overflow-hidden fade-in-scale">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,193,7,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black dark:bg-gradient-to-r dark:from-yellow-400 dark:via-yellow-300 dark:to-yellow-500 dark:bg-clip-text dark:text-transparent animate-pulse">
            Góp ý & Đánh giá
          </h1>
          <p className="text-xl text-gray-700 dark:text-yellow-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Chia sẻ ý kiến của bạn để giúp chúng tôi cải thiện dịch vụ RadioCabs.in ngày càng tốt hơn
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 slide-in-left">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feedback Form */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl text-gray-900 dark:text-yellow-400 mb-2">Gửi góp ý của bạn</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-yellow-200">
                    Chúng tôi luôn lắng nghe và trân trọng mọi ý kiến từ khách hàng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Thông tin cá nhân
                        </h3>

                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-700 dark:text-yellow-300">
                            Họ và tên *
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mobile" className="text-gray-700 dark:text-yellow-300">
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
                          <Label htmlFor="email" className="text-gray-700 dark:text-yellow-300">
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

                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-gray-700 dark:text-yellow-300">
                            Thành phố *
                          </Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                            required
                          />
                        </div>
                      </div>

                      {/* Feedback Type & Description */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Nội dung góp ý
                        </h3>

                        <div className="space-y-2">
                          <Label htmlFor="type" className="text-gray-700 dark:text-yellow-300">
                            Loại góp ý *
                          </Label>
                          <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                            <SelectTrigger className="bg-black/50 border-yellow-500/50 text-yellow-100">
                              <SelectValue placeholder="Chọn loại góp ý" />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-yellow-500/50">
                              {feedbackTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value} className="text-yellow-100">
                                  {type.icon} {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-gray-700 dark:text-yellow-300">
                            Mô tả chi tiết *
                          </Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            className="bg-black/50 border-yellow-500/50 text-yellow-100 focus:border-yellow-400 min-h-[150px]"
                            placeholder="Vui lòng mô tả chi tiết về góp ý của bạn..."
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300"
                      >
                        Gửi góp ý
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Liên hệ trực tiếp
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-700 dark:text-yellow-400" />
                    <div>
                      <p className="text-gray-700 dark:text-yellow-300 font-medium">Hotline</p>
                      <p className="text-gray-600 dark:text-yellow-200">1900-xxxx</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-700 dark:text-yellow-400" />
                    <div>
                      <p className="text-gray-700 dark:text-yellow-300 font-medium">Email</p>
                      <p className="text-gray-600 dark:text-yellow-200">feedback@radiocabs.in</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-700 dark:text-yellow-400" />
                    <div>
                      <p className="text-gray-700 dark:text-yellow-300 font-medium">Địa chỉ</p>
                      <p className="text-gray-600 dark:text-yellow-200">123 Đường ABC, Quận 1, TP.HCM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feedback Stats */}
              <Card className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Thống kê góp ý
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-yellow-300">Tổng góp ý:</span>
                    <span className="text-gray-900 dark:text-yellow-400 font-bold">1,234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-yellow-300">Đã xử lý:</span>
                    <span className="text-green-400 font-bold">1,180</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-yellow-300">Đang xử lý:</span>
                    <span className="text-orange-400 font-bold">54</span>
                  </div>
                  <div className="w-full bg-yellow-900/30 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full"
                      style={{ width: "95.6%" }}
                    ></div>
                  </div>
                  <p className="text-gray-600 dark:text-yellow-200 text-sm text-center">95.6% tỷ lệ xử lý</p>
                </CardContent>
              </Card>

              {/* Guidelines */}
              <Card className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 dark:text-yellow-400">Hướng dẫn góp ý</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600 dark:text-yellow-200 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      Mô tả rõ ràng vấn đề hoặc đề xuất
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      Cung cấp thông tin liên hệ chính xác
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      Sử dụng ngôn từ lịch sự, tôn trọng
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      Chúng tôi sẽ phản hồi trong 24-48h
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
