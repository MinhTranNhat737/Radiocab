"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  MessageSquare, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle, 
  AlertCircle,
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  User,
  Building2,
  Car,
  Heart,
  Smile,
  Frown
} from "lucide-react"
import Link from "next/link"

export default function FeedbackPage() {
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    feedbackType: "",
    rating: "",
    subject: "",
    message: "",
    isAnonymous: false
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string | boolean) => {
    setFeedbackData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!feedbackData.feedbackType || !feedbackData.message) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc!")
      return
    }
    
    // Simulate feedback submission
    setTimeout(() => {
      setIsSubmitted(true)
    }, 2000)
  }

  const feedbackTypes = [
    { value: "service", label: "Chất lượng dịch vụ" },
    { value: "driver", label: "Thái độ tài xế" },
    { value: "vehicle", label: "Tình trạng xe" },
    { value: "booking", label: "Quy trình đặt xe" },
    { value: "payment", label: "Thanh toán" },
    { value: "website", label: "Giao diện website" },
    { value: "support", label: "Hỗ trợ khách hàng" },
    { value: "other", label: "Khác" }
  ]

  const ratings = [
    { value: "5", label: "Rất hài lòng", icon: Heart, color: "text-green-600" },
    { value: "4", label: "Hài lòng", icon: Smile, color: "text-blue-600" },
    { value: "3", label: "Bình thường", icon: MessageSquare, color: "text-yellow-600" },
    { value: "2", label: "Không hài lòng", icon: Frown, color: "text-orange-600" },
    { value: "1", label: "Rất không hài lòng", icon: AlertCircle, color: "text-red-600" }
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
                  Gửi phản hồi thành công!
                </h1>
                <p className="text-lg text-gray-700 dark:text-yellow-200 mb-8">
                  Cảm ơn bạn đã gửi phản hồi. Chúng tôi sẽ xem xét và cải thiện dịch vụ dựa trên ý kiến của bạn.
                </p>
              </div>

              <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-4">
                        Phản hồi của bạn
                      </h3>
                      <div className="space-y-2 text-left">
                        <p className="text-gray-700 dark:text-yellow-200">
                          <strong>Loại phản hồi:</strong> {
                            feedbackTypes.find(t => t.value === feedbackData.feedbackType)?.label
                          }
                        </p>
                        {feedbackData.rating && (
                          <p className="text-gray-700 dark:text-yellow-200">
                            <strong>Đánh giá:</strong> {
                              ratings.find(r => r.value === feedbackData.rating)?.label
                            }
                          </p>
                        )}
                        <p className="text-gray-700 dark:text-yellow-200">
                          <strong>Nội dung:</strong> {feedbackData.message}
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
                        Gửi phản hồi khác
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
            Phản hồi dịch vụ
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-yellow-200 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            Chia sẻ ý kiến của bạn để chúng tôi có thể cải thiện dịch vụ tốt hơn
          </p>
        </div>
      </section>

      {/* Feedback Form */}
      <section className="py-12 sm:py-16 slide-in-left">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-gray-900 dark:text-yellow-400 mb-2 flex items-center justify-center gap-2">
                  <MessageSquare className="w-8 h-8" />
                  Gửi phản hồi
                </CardTitle>
                <CardDescription className="text-yellow-200">
                  Chia sẻ trải nghiệm của bạn với chúng tôi
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

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Thông tin cá nhân
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700 dark:text-yellow-300">
                          Họ và tên
                        </Label>
                        <Input
                          id="name"
                          value={feedbackData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                          placeholder="Nhập họ và tên"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 dark:text-yellow-300">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-primary" />
                          <Input
                            id="email"
                            type="email"
                            value={feedbackData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="pl-10 bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                            placeholder="Nhập email"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 dark:text-yellow-300">
                          Số điện thoại
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-primary" />
                          <Input
                            id="phone"
                            value={feedbackData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="pl-10 bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                            placeholder="Nhập số điện thoại"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-gray-700 dark:text-yellow-300">
                          Công ty (nếu có)
                        </Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-4 w-4 text-primary" />
                          <Input
                            id="company"
                            value={feedbackData.company}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                            className="pl-10 bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                            placeholder="Nhập tên công ty"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Type */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Loại phản hồi
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="feedbackType" className="text-gray-700 dark:text-yellow-300">
                        Chọn loại phản hồi *
                      </Label>
                      <Select
                        value={feedbackData.feedbackType}
                        onValueChange={(value) => handleInputChange("feedbackType", value)}
                      >
                        <SelectTrigger className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100">
                          <SelectValue placeholder="Chọn loại phản hồi" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-black border-yellow-500/50">
                          {feedbackTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="text-gray-900 dark:text-yellow-100">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Đánh giá tổng thể
                    </h3>

                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-yellow-300">
                        Mức độ hài lòng
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                        {ratings.map((rating) => (
                          <button
                            key={rating.value}
                            type="button"
                            onClick={() => handleInputChange("rating", rating.value)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              feedbackData.rating === rating.value
                                ? 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900/30'
                                : 'border-gray-300 dark:border-gray-600 hover:border-yellow-400'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-1">
                              <rating.icon className={`w-6 h-6 ${rating.color}`} />
                              <span className="text-xs font-medium text-gray-700 dark:text-yellow-200">
                                {rating.label}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Feedback Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Nội dung phản hồi
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-gray-700 dark:text-yellow-300">
                        Tiêu đề
                      </Label>
                      <Input
                        id="subject"
                        value={feedbackData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                        placeholder="Nhập tiêu đề phản hồi"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-700 dark:text-yellow-300">
                        Nội dung chi tiết *
                      </Label>
                      <Textarea
                        id="message"
                        value={feedbackData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400 min-h-[120px]"
                        placeholder="Mô tả chi tiết về trải nghiệm của bạn..."
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Gửi phản hồi
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Feedback Matters */}
      <section className="py-16 bg-gradient-to-r from-yellow-100/80 to-yellow-200/80 dark:from-yellow-900/10 dark:to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-yellow-400 mb-12">Tại sao phản hồi quan trọng?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 text-center">
              <CardContent className="p-6">
                <ThumbsUp className="w-12 h-12 text-gray-700 dark:text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Cải thiện dịch vụ</h3>
                <p className="text-gray-600 dark:text-yellow-200 text-sm">Phản hồi giúp chúng tôi nâng cao chất lượng dịch vụ</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 text-center">
              <CardContent className="p-6">
                <Heart className="w-12 h-12 text-gray-700 dark:text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Lắng nghe khách hàng</h3>
                <p className="text-gray-600 dark:text-yellow-200 text-sm">Chúng tôi luôn lắng nghe và thấu hiểu nhu cầu của bạn</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 text-center">
              <CardContent className="p-6">
                <Star className="w-12 h-12 text-gray-700 dark:text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Trải nghiệm tốt hơn</h3>
                <p className="text-gray-600 dark:text-yellow-200 text-sm">Mỗi phản hồi giúp tạo ra trải nghiệm tốt hơn cho tất cả</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}