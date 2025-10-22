"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Car, 
  Users, 
  Phone, 
  Mail, 
  CreditCard,
  CheckCircle,
  AlertCircle,
  Search,
  Star,
  Navigation
} from "lucide-react"
import Link from "next/link"

export default function BookingPage() {
  const [bookingData, setBookingData] = useState({
    pickupLocation: "",
    destination: "",
    pickupDate: "",
    pickupTime: "",
    passengerCount: "",
    vehicleType: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    specialRequests: "",
    paymentMethod: ""
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setBookingData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!bookingData.pickupLocation || !bookingData.destination || !bookingData.customerName || !bookingData.customerPhone) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc!")
      return
    }
    
    // Simulate booking submission
    setTimeout(() => {
      setIsSubmitted(true)
    }, 2000)
  }

  const vehicleTypes = [
    { value: "standard", label: "Xe tiêu chuẩn (4 chỗ)", price: "15,000 VND/km" },
    { value: "premium", label: "Xe cao cấp (4 chỗ)", price: "25,000 VND/km" },
    { value: "suv", label: "Xe SUV (7 chỗ)", price: "30,000 VND/km" },
    { value: "van", label: "Xe van (16 chỗ)", price: "35,000 VND/km" }
  ]

  const paymentMethods = [
    { value: "cash", label: "Tiền mặt" },
    { value: "card", label: "Thẻ tín dụng" },
    { value: "bank_transfer", label: "Chuyển khoản" },
    { value: "momo", label: "Ví MoMo" },
    { value: "zalopay", label: "Ví ZaloPay" }
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black text-yellow-400 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 text-gray-900 dark:bg-black dark:text-yellow-400 page-enter">

        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 dark:from-black dark:via-yellow-900/10 dark:to-black relative overflow-hidden fade-in-scale">
          <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-black dark:text-yellow-400">
                  Đặt xe thành công!
                </h1>
                <p className="text-lg text-gray-700 dark:text-yellow-200 mb-8">
                  Chúng tôi đã nhận được yêu cầu đặt xe của bạn. Tài xế sẽ liên hệ với bạn trong vòng 5 phút.
                </p>
              </div>

              <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-4">
                        Thông tin đặt xe
                      </h3>
                      <div className="space-y-2 text-left">
                        <p className="text-gray-700 dark:text-yellow-200">
                          <strong>Từ:</strong> {bookingData.pickupLocation}
                        </p>
                        <p className="text-gray-700 dark:text-yellow-200">
                          <strong>Đến:</strong> {bookingData.destination}
                        </p>
                        <p className="text-gray-700 dark:text-yellow-200">
                          <strong>Thời gian:</strong> {bookingData.pickupDate} lúc {bookingData.pickupTime}
                        </p>
                        <p className="text-gray-700 dark:text-yellow-200">
                          <strong>Khách hàng:</strong> {bookingData.customerName}
                        </p>
                        <p className="text-gray-700 dark:text-yellow-200">
                          <strong>Số điện thoại:</strong> {bookingData.customerPhone}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3">
                          Về trang chủ
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsSubmitted(false)}
                        className="flex-1 border-yellow-500/50 text-primary hover:bg-yellow-500/10 py-3"
                      >
                        Đặt xe khác
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-yellow-400 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 text-gray-900 dark:bg-black dark:text-yellow-400 page-enter">

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 dark:from-black dark:via-yellow-900/10 dark:to-black relative overflow-hidden fade-in-scale">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,193,7,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-black dark:bg-gradient-to-r dark:from-yellow-400 dark:via-yellow-300 dark:to-yellow-500 dark:bg-clip-text dark:text-transparent animate-pulse">
            Đặt xe taxi
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-yellow-200 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            Đặt xe nhanh chóng, an toàn và tiện lợi với giá cả hợp lý
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12 sm:py-16 slide-in-left">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-gray-900 dark:text-yellow-400 mb-2 flex items-center justify-center gap-2">
                  <Car className="w-8 h-8" />
                  Đặt xe taxi
                </CardTitle>
                <CardDescription className="text-yellow-200">
                  Điền thông tin để đặt xe taxi
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

                  {/* Location Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Thông tin địa điểm
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pickupLocation" className="text-gray-700 dark:text-yellow-300">
                          Điểm đón *
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-primary" />
                          <Input
                            id="pickupLocation"
                            value={bookingData.pickupLocation}
                            onChange={(e) => handleInputChange("pickupLocation", e.target.value)}
                            className="pl-10 bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                            placeholder="Nhập địa chỉ đón"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="destination" className="text-gray-700 dark:text-yellow-300">
                          Điểm đến *
                        </Label>
                        <div className="relative">
                          <Navigation className="absolute left-3 top-3 h-4 w-4 text-primary" />
                          <Input
                            id="destination"
                            value={bookingData.destination}
                            onChange={(e) => handleInputChange("destination", e.target.value)}
                            className="pl-10 bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                            placeholder="Nhập địa chỉ đến"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Thời gian
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pickupDate" className="text-gray-700 dark:text-yellow-300">
                          Ngày đón
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-primary" />
                          <Input
                            id="pickupDate"
                            type="date"
                            value={bookingData.pickupDate}
                            onChange={(e) => handleInputChange("pickupDate", e.target.value)}
                            className="pl-10 bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pickupTime" className="text-gray-700 dark:text-yellow-300">
                          Giờ đón
                        </Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-3 h-4 w-4 text-primary" />
                          <Input
                            id="pickupTime"
                            type="time"
                            value={bookingData.pickupTime}
                            onChange={(e) => handleInputChange("pickupTime", e.target.value)}
                            className="pl-10 bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle and Passenger Info */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                      <Car className="w-5 h-5" />
                      Thông tin xe
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="passengerCount" className="text-gray-700 dark:text-yellow-300">
                          Số khách
                        </Label>
                        <Select
                          value={bookingData.passengerCount}
                          onValueChange={(value) => handleInputChange("passengerCount", value)}
                        >
                          <SelectTrigger className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100">
                            <SelectValue placeholder="Chọn số khách" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-black border-yellow-500/50">
                            <SelectItem value="1" className="text-gray-900 dark:text-yellow-100">1 khách</SelectItem>
                            <SelectItem value="2" className="text-gray-900 dark:text-yellow-100">2 khách</SelectItem>
                            <SelectItem value="3" className="text-gray-900 dark:text-yellow-100">3 khách</SelectItem>
                            <SelectItem value="4" className="text-gray-900 dark:text-yellow-100">4 khách</SelectItem>
                            <SelectItem value="5+" className="text-gray-900 dark:text-yellow-100">5+ khách</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vehicleType" className="text-gray-700 dark:text-yellow-300">
                          Loại xe
                        </Label>
                        <Select
                          value={bookingData.vehicleType}
                          onValueChange={(value) => handleInputChange("vehicleType", value)}
                        >
                          <SelectTrigger className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100">
                            <SelectValue placeholder="Chọn loại xe" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-black border-yellow-500/50">
                            {vehicleTypes.map((vehicle) => (
                              <SelectItem key={vehicle.value} value={vehicle.value} className="text-gray-900 dark:text-yellow-100">
                                {vehicle.label} - {vehicle.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Thông tin khách hàng
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customerName" className="text-gray-700 dark:text-yellow-300">
                          Họ và tên *
                        </Label>
                        <Input
                          id="customerName"
                          value={bookingData.customerName}
                          onChange={(e) => handleInputChange("customerName", e.target.value)}
                          className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                          placeholder="Nhập họ và tên"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customerPhone" className="text-gray-700 dark:text-yellow-300">
                          Số điện thoại *
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-primary" />
                          <Input
                            id="customerPhone"
                            value={bookingData.customerPhone}
                            onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                            className="pl-10 bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                            placeholder="Nhập số điện thoại"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerEmail" className="text-gray-700 dark:text-yellow-300">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-primary" />
                        <Input
                          id="customerEmail"
                          type="email"
                          value={bookingData.customerEmail}
                          onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                          className="pl-10 bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                          placeholder="Nhập email"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Yêu cầu đặc biệt
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="specialRequests" className="text-gray-700 dark:text-yellow-300">
                        Ghi chú thêm
                      </Label>
                      <Textarea
                        id="specialRequests"
                        value={bookingData.specialRequests}
                        onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                        className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400 min-h-[100px]"
                        placeholder="Nhập yêu cầu đặc biệt (nếu có)"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Phương thức thanh toán
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod" className="text-gray-700 dark:text-yellow-300">
                        Chọn phương thức thanh toán
                      </Label>
                      <Select
                        value={bookingData.paymentMethod}
                        onValueChange={(value) => handleInputChange("paymentMethod", value)}
                      >
                        <SelectTrigger className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100">
                          <SelectValue placeholder="Chọn phương thức thanh toán" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-black border-yellow-500/50">
                          {paymentMethods.map((method) => (
                            <SelectItem key={method.value} value={method.value} className="text-gray-900 dark:text-yellow-100">
                              {method.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300"
                  >
                    <Car className="w-4 h-4 mr-2" />
                    Đặt xe ngay
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-100/80 to-yellow-200/80 dark:from-yellow-900/10 dark:to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-yellow-400 mb-12">Tại sao chọn chúng tôi?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 text-center">
              <CardContent className="p-6">
                <Car className="w-12 h-12 text-gray-700 dark:text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Đặt xe nhanh chóng</h3>
                <p className="text-gray-600 dark:text-yellow-200 text-sm">Đặt xe chỉ trong vài phút với giao diện thân thiện</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 text-center">
              <CardContent className="p-6">
                <Star className="w-12 h-12 text-gray-700 dark:text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Tài xế chuyên nghiệp</h3>
                <p className="text-gray-600 dark:text-yellow-200 text-sm">Tài xế có kinh nghiệm và được đào tạo bài bản</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 text-center">
              <CardContent className="p-6">
                <CheckCircle className="w-12 h-12 text-gray-700 dark:text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Giá cả hợp lý</h3>
                <p className="text-gray-600 dark:text-yellow-200 text-sm">Giá cả minh bạch, không phát sinh chi phí</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
