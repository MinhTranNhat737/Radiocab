"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Header from "@/components/Header"
import {
  Car,
  Search,
  MapPin,
  Calendar,
  Zap,
  Building2,
  Users,
  MessageSquare,
  Star,
  Shield,
  Clock,
  Check,
  Mail,
  Phone,
} from "lucide-react"

function HeroSection() {
  return (
    <section className="relative py-12 lg:py-16 overflow-hidden">
      <div className="absolute inset-0 gradient-black-yellow opacity-80" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping"></div>
        <div
          className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-primary/50 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[50vh]">
          <div className="space-y-6 animate-slide-in-left flex flex-col justify-center text-center lg:text-left lg:pl-12">
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-5xl font-bold text-balance leading-tight">
                Kết nối{" "}
                <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse-yellow">
                  Taxi
                </span>{" "}
                dễ dàng hơn bao giờ hết
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-md">
                Cổng thông tin hàng đầu cho công ty taxi, tài xế và khách hàng. Đăng ký dịch vụ, quảng cáo và tìm kiếm
                thông tin một cách nhanh chóng.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/listing">
                <Button
                  size="default"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 animate-glow hover-lift w-full sm:w-auto"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Đăng Ký Công Ty Taxi
                </Button>
              </Link>
              <Link href="/drivers">
                <Button
                  size="default"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground hover-glow bg-transparent w-full sm:w-auto"
                >
                  Đăng Ký Tài Xế
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:pl-8 animate-slide-in-right">
            <Card className="p-6 bg-card/80 backdrop-blur border-primary/30 hover-lift animate-glow">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Tìm kiếm dịch vụ taxi</h3>

                <div className="space-y-3">
                  <div className="relative animate-fade-in-up">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-primary" />
                    <Input placeholder="Điểm đón" className="pl-10 border-primary/30 focus:border-primary hover-glow" />
                  </div>

                  <div className="relative animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-primary" />
                    <Input placeholder="Điểm đến" className="pl-10 border-primary/30 focus:border-primary hover-glow" />
                  </div>

                  <div className="relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-primary" />
                    <Input type="datetime-local" className="pl-10 border-primary/30 focus:border-primary hover-glow" />
                  </div>
                </div>

                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 animate-glow hover-lift animate-fade-in-up"
                  style={{ animationDelay: "0.3s" }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Tìm Kiếm Taxi
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: Building2,
      title: "Đăng ký công ty taxi",
      description: "Dễ dàng đăng ký và quảng cáo dịch vụ taxi của bạn trên nền tảng",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Users,
      title: "Kết nối tài xế",
      description: "Tài xế có thể đăng ký và kết nối với các công ty taxi phù hợp",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: MessageSquare,
      title: "Phản hồi khách hàng",
      description: "Khách hàng có thể gửi phản hồi và đánh giá dịch vụ một cách dễ dàng",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Star,
      title: "Đánh giá chất lượng",
      description: "Hệ thống đánh giá minh bạch giúp nâng cao chất lượng dịch vụ",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Shield,
      title: "An toàn bảo mật",
      description: "Thông tin được bảo mật tuyệt đối với công nghệ mã hóa tiên tiến",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Clock,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ hỗ trợ khách hàng hoạt động 24/7 để giải đáp mọi thắc mắc",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ]

  return (
    <section id="features" className="py-20 bg-background/50">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center space-y-4 mb-16 animate-fade-in-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Tại sao chọn RadioCabs.in?
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Nền tảng toàn diện kết nối mọi thành phần trong hệ sinh thái taxi Việt Nam
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-primary/20 bg-card/80 backdrop-blur hover-lift animate-fade-in-up hover-glow group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 animate-float group-hover:animate-glow`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "0",
      period: "Miễn phí",
      description: "Dành cho cá nhân tài xế mới bắt đầu",
      features: ["Đăng ký thông tin cơ bản", "Tìm kiếm công ty taxi", "Gửi phản hồi cơ bản", "Hỗ trợ email"],
      buttonText: "Bắt đầu miễn phí",
      popular: false,
    },
    {
      name: "Basic",
      price: "299,000",
      period: "VNĐ/tháng",
      quarterlyPrice: "799,000",
      quarterlyPeriod: "VNĐ/quý",
      description: "Dành cho công ty taxi nhỏ và tài xế chuyên nghiệp",
      features: [
        "Tất cả tính năng Free",
        "Quảng cáo dịch vụ cơ bản",
        "Thống kê cơ bản",
        "Hỗ trợ điện thoại",
        "Tối đa 10 xe đăng ký",
      ],
      buttonText: "Chọn gói Basic",
      popular: false,
    },
    {
      name: "Premium",
      price: "699,000",
      period: "VNĐ/tháng",
      quarterlyPrice: "1,899,000",
      quarterlyPeriod: "VNĐ/quý",
      description: "Dành cho công ty taxi lớn và đối tác chiến lược",
      features: [
        "Tất cả tính năng Basic",
        "Quảng cáo ưu tiên",
        "Thống kê chi tiết",
        "Hỗ trợ 24/7",
        "Không giới hạn số xe",
        "API tích hợp",
        "Báo cáo tùy chỉnh",
      ],
      buttonText: "Chọn gói Premium",
      popular: true,
    },
  ]

  return (
    <section id="pricing" className="py-20">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance">Bảng giá linh hoạt</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Chọn gói phù hợp với nhu cầu của bạn. Thanh toán theo tháng hoặc theo quý với mức giá ưu đãi.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto justify-items-center">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-border/50 bg-card/50 backdrop-blur w-full max-w-sm ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  <Star className="h-3 w-3 mr-1" />
                  Phổ biến nhất
                </Badge>
              )}

              <CardHeader className="text-center pb-6 px-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-primary">{plan.price}</span>
                    <span className="text-xs text-muted-foreground">/{plan.period}</span>
                  </div>
                  {plan.quarterlyPrice && (
                    <div className="text-xs text-muted-foreground">
                      Hoặc {plan.quarterlyPrice} {plan.quarterlyPeriod} (tiết kiệm 10%)
                    </div>
                  )}
                </div>
                <CardDescription className="text-sm leading-relaxed">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 px-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-xs leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  size="sm"
                  className={`w-full text-sm ${plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function PartnersSection() {
  const partners = [
    { name: "Vinasun", logo: "/vinasun-taxi-logo.jpg" },
    { name: "Mai Linh", logo: "/mai-linh-taxi-logo.jpg" },
    { name: "Taxi Group", logo: "/taxi-group-logo.jpg" },
    { name: "Saigon Taxi", logo: "/saigon-taxi-logo.jpg" },
    { name: "Hanoi Taxi", logo: "/hanoi-taxi-logo.jpg" },
    { name: "ABC Taxi", logo: "/abc-taxi-logo.jpg" },
    { name: "Vina Taxi", logo: "/vina-taxi-logo.jpg" },
    { name: "Green Taxi", logo: "/green-taxi-logo.jpg" },
  ]

  return (
    <section id="partners" className="py-20 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance">Đối tác tin cậy</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Hơn 500+ công ty taxi và 10,000+ tài xế đã tin tưởng sử dụng RadioCabs.in
          </p>
        </div>

        <Card className="p-12 bg-card/50 backdrop-blur border-border/50 max-w-full mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 items-center justify-items-center">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img
                  src={partner.logo || "/placeholder.svg"}
                  alt={`${partner.name} logo`}
                  className="h-24 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground">Công ty taxi</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary mb-2">10,000+</div>
            <div className="text-muted-foreground">Tài xế đăng ký</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">1M+</div>
            <div className="text-muted-foreground">Lượt tìm kiếm/tháng</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="contact" className="bg-secondary text-secondary-foreground">
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">RadioCabs.in</span>
            </div>
            <p className="text-secondary-foreground/80 leading-relaxed">
              Cổng thông tin taxi hàng đầu Việt Nam, kết nối công ty taxi, tài xế và khách hàng một cách hiệu quả nhất.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dịch vụ</h3>
            <ul className="space-y-2 text-secondary-foreground/80">
              <li>
                <Link href="/listing" className="hover:text-secondary-foreground transition-colors">
                  Đăng ký công ty taxi
                </Link>
              </li>
              <li>
                <Link href="/drivers" className="hover:text-secondary-foreground transition-colors">
                  Đăng ký tài xế
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-secondary-foreground transition-colors">
                  Tìm kiếm taxi
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-secondary-foreground transition-colors">
                  Phản hồi dịch vụ
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hỗ trợ</h3>
            <ul className="space-y-2 text-secondary-foreground/80">
              <li>
                <Link href="/services" className="hover:text-secondary-foreground transition-colors">
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-secondary-foreground transition-colors">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-secondary-foreground transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-secondary-foreground transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liên hệ</h3>
            <div className="space-y-3 text-secondary-foreground/80">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>1900 1234</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@radiocabs.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Hà Nội, Việt Nam</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-secondary-foreground/60 text-sm">© 2025 RadioCabs.in. Tất cả quyền được bảo lưu.</p>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-secondary-foreground/60 hover:text-secondary-foreground"
              >
                Facebook
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-secondary-foreground/60 hover:text-secondary-foreground"
              >
                Zalo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-secondary-foreground/60 hover:text-secondary-foreground"
              >
                LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-radial-yellow">
      <Header />
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full animate-float"></div>
          <div
            className="absolute top-40 right-20 w-24 h-24 bg-accent/10 rounded-full animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-40 left-1/4 w-40 h-40 bg-primary/5 rounded-full animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <PartnersSection />
      </main>
      <Footer />
    </div>
  )
}
