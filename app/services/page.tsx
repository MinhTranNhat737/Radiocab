"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import {
  Info,
  Building2,
  Car,
  Megaphone,
  MessageSquare,
  Shield,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Star,
  Users,
  Zap,
  Globe,
} from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      icon: Building2,
      title: "Đăng ký Công ty Taxi",
      description: "Đăng ký công ty taxi của bạn lên hệ thống để tiếp cận nhiều khách hàng hơn",
      features: ["Hiển thị thông tin công ty", "Quản lý đội xe", "Theo dõi đơn hàng", "Báo cáo doanh thu"],
      pricing: "Từ 200,000 VNĐ/tháng",
      link: "/listing",
    },
    {
      icon: Car,
      title: "Đăng ký Tài xế",
      description: "Tham gia mạng lưới tài xế chuyên nghiệp và tìm kiếm cơ hội việc làm",
      features: ["Hồ sơ tài xế chuyên nghiệp", "Kết nối với công ty", "Đánh giá từ khách hàng", "Hỗ trợ 24/7"],
      pricing: "150,000 VNĐ/tháng",
      link: "/drivers",
    },
    {
      icon: Megaphone,
      title: "Dịch vụ Quảng cáo",
      description: "Quảng bá thương hiệu và dịch vụ taxi của bạn đến hàng triệu người dùng",
      features: ["Banner quảng cáo", "Vị trí ưu tiên", "Thống kê chi tiết", "Tư vấn marketing"],
      pricing: "Từ 300,000 VNĐ/tháng",
      link: "/advertise",
    },
    {
      icon: MessageSquare,
      title: "Hỗ trợ Khách hàng",
      description: "Hệ thống hỗ trợ và góp ý toàn diện cho mọi người dùng",
      features: ["Hỗ trợ 24/7", "Xử lý khiếu nại", "Tư vấn dịch vụ", "Phản hồi nhanh chóng"],
      pricing: "Miễn phí",
      link: "/feedback",
    },
  ]

  const benefits = [
    {
      icon: Globe,
      title: "Mạng lưới rộng khắp",
      description: "Kết nối toàn quốc với hàng nghìn công ty taxi và tài xế",
    },
    {
      icon: Shield,
      title: "Bảo mật tuyệt đối",
      description: "Thông tin được mã hóa và bảo vệ theo tiêu chuẩn quốc tế",
    },
    {
      icon: Zap,
      title: "Công nghệ hiện đại",
      description: "Nền tảng công nghệ tiên tiến, giao diện thân thiện",
    },
    {
      icon: Users,
      title: "Cộng đồng lớn",
      description: "Hơn 10,000 thành viên đang sử dụng dịch vụ",
    },
  ]

  const stats = [
    { number: "500+", label: "Công ty taxi" },
    { number: "2,000+", label: "Tài xế" },
    { number: "50,000+", label: "Khách hàng" },
    { number: "99.9%", label: "Thời gian hoạt động" },
  ]

  const testimonials = [
    {
      name: "Nguyễn Văn A",
      role: "Giám đốc Taxi Mai Linh",
      content: "RadioCabs.in đã giúp chúng tôi mở rộng khách hàng đáng kể. Hệ thống dễ sử dụng và hỗ trợ tốt.",
      rating: 5,
    },
    {
      name: "Trần Thị B",
      role: "Tài xế độc lập",
      content: "Tôi đã tìm được nhiều cơ hội việc làm tốt thông qua nền tảng này. Rất hài lòng với dịch vụ.",
      rating: 5,
    },
    {
      name: "Lê Văn C",
      role: "Chủ công ty vận tải",
      content: "Dịch vụ quảng cáo hiệu quả, giúp tăng độ nhận biết thương hiệu và thu hút khách hàng mới.",
      rating: 4,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-yellow-400 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 text-gray-900 dark:bg-black dark:text-yellow-400 page-enter">
      <Header />

      {/* Hero Section */}
      <section className="hero-section py-20 bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 dark:from-black dark:via-yellow-900/10 dark:to-black relative overflow-hidden fade-in-scale">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(255,193,7,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black dark:bg-gradient-to-r dark:from-yellow-400 dark:via-yellow-300 dark:to-yellow-500 dark:bg-clip-text dark:text-transparent animate-pulse">
            Dịch vụ & Thông tin
          </h1>
          <p className="text-xl text-gray-700 dark:text-yellow-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Khám phá các dịch vụ toàn diện của RadioCabs.in - nền tảng kết nối hàng đầu trong ngành taxi tại Việt Nam
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-900/10 to-black slide-in-right">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-yellow-400 mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-yellow-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 slide-in-left">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-yellow-400 mb-12">Các dịch vụ của chúng tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/30 shadow-2xl shadow-yellow-500/10 hover:shadow-yellow-500/20 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-gray-900 dark:text-yellow-400">{service.title}</CardTitle>
                      <Badge className="bg-yellow-500/20 text-gray-900 dark:text-yellow-400 border-yellow-500/30 mt-1">
                        {service.pricing}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 dark:text-yellow-200 text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-gray-900 dark:text-yellow-400 font-semibold mb-2">Tính năng chính:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-gray-600 dark:text-yellow-200">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300"
                    >
                      <Link href={service.link}>Tìm hiểu thêm</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-900/10 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-yellow-400 mb-12">Tại sao chọn RadioCabs.in?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/30 text-center"
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-yellow-200 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-yellow-400 mb-12">Khách hàng nói gì về chúng tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < testimonial.rating ? "text-gray-900 dark:text-yellow-400 fill-current" : "text-gray-600 dark:text-yellow-600"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-yellow-200 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="text-gray-900 dark:text-yellow-400 font-semibold">{testimonial.name}</p>
                    <p className="text-gray-700 dark:text-yellow-300 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-900/10 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-yellow-400 mb-12">Cách thức hoạt động</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Đăng ký</h3>
              <p className="text-gray-600 dark:text-yellow-200 text-sm">Tạo tài khoản và điền thông tin cần thiết</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Xác thực</h3>
              <p className="text-gray-600 dark:text-yellow-200 text-sm">Chúng tôi xác thực thông tin và phê duyệt</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Kích hoạt</h3>
              <p className="text-gray-600 dark:text-yellow-200 text-sm">Tài khoản được kích hoạt và sẵn sàng sử dụng</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Kết nối</h3>
              <p className="text-gray-600 dark:text-yellow-200 text-sm">Bắt đầu kết nối và sử dụng dịch vụ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-yellow-400 mb-6">Liên hệ với chúng tôi</h2>
              <p className="text-gray-600 dark:text-yellow-200 mb-8 text-lg">
                Có câu hỏi hoặc cần hỗ trợ? Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-yellow-400 font-semibold">Hotline</p>
                    <p className="text-gray-600 dark:text-yellow-200">1900-xxxx (24/7)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-yellow-400 font-semibold">Email</p>
                    <p className="text-gray-600 dark:text-yellow-200">support@radiocabs.in</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-yellow-400 font-semibold">Địa chỉ</p>
                    <p className="text-gray-600 dark:text-yellow-200">123 Đường ABC, Quận 1, TP.HCM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-yellow-400 font-semibold">Giờ làm việc</p>
                    <p className="text-gray-600 dark:text-yellow-200">24/7 - Hỗ trợ không ngừng nghỉ</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-yellow-400">Bắt đầu ngay hôm nay</CardTitle>
                <CardDescription className="text-gray-600 dark:text-yellow-200">Chọn dịch vụ phù hợp với nhu cầu của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3"
                >
                  <Link href="/listing">
                    <Building2 className="w-4 h-4 mr-2" />
                    Đăng ký Công ty
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3"
                >
                  <Link href="/drivers">
                    <Car className="w-4 h-4 mr-2" />
                    Đăng ký Tài xế
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3"
                >
                  <Link href="/advertise">
                    <Megaphone className="w-4 h-4 mr-2" />
                    Đăng ký Quảng cáo
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-yellow-500/50 text-gray-700 dark:text-yellow-400 hover:bg-yellow-500/10 py-3 bg-transparent"
                >
                  <Link href="/feedback">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Gửi Góp ý
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </div>
  )
}
