"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Header from "@/components/Header"
import AdSidebar from "@/components/AdSidebar"
import { SidebarProvider, useSidebar } from "@/components/SidebarManager"
import { useLanguage } from "@/contexts/LanguageContext"
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
} from "lucide-react"

function QuickStatsSection() {
  const { t } = useLanguage()
  
  return (
    <section className="relative py-16 bg-gradient-to-br from-background via-background/95 to-background overflow-hidden border-b border-primary/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
              {t.statsTitle || "Nền Tảng Kết Nối Taxi Hàng Đầu"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.statsSubtitle || "Kết nối hàng nghìn công ty taxi và tài xế chuyên nghiệp trên toàn quốc"}
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {/* Stat 1 */}
            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-primary/20 rounded-full group-hover:animate-pulse">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2 animate-count">
                500+
              </div>
              <div className="text-sm lg:text-base text-muted-foreground font-medium">
                Công ty taxi
              </div>
            </div>

            {/* Stat 2 */}
            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-accent/20 rounded-full group-hover:animate-pulse">
                  <Users className="h-8 w-8 text-accent" />
                </div>
              </div>
              <div className="text-4xl lg:text-5xl font-bold text-accent mb-2 animate-count">
                10,000+
              </div>
              <div className="text-sm lg:text-base text-muted-foreground font-medium">
                Tài xế đăng ký
              </div>
            </div>

            {/* Stat 3 */}
            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-primary/20 rounded-full group-hover:animate-pulse">
                  <Car className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2 animate-count">
                15,000+
              </div>
              <div className="text-sm lg:text-base text-muted-foreground font-medium">
                Xe taxi hoạt động
              </div>
            </div>

            {/* Stat 4 */}
            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-accent/20 rounded-full group-hover:animate-pulse">
                  <Star className="h-8 w-8 text-accent fill-current" />
                </div>
              </div>
              <div className="text-4xl lg:text-5xl font-bold text-accent mb-2 animate-count">
                4.8/5
              </div>
              <div className="text-sm lg:text-base text-muted-foreground font-medium">
                Đánh giá trung bình
              </div>
            </div>
          </div>

          {/* Quick Service Highlights */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="flex items-start space-x-4 p-5 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
              <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">An Toàn & Tin Cậy</h3>
                <p className="text-sm text-muted-foreground">Tất cả công ty và tài xế đều được xác minh kỹ lưỡng</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-5 rounded-xl bg-card/50 border border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-md">
              <div className="flex-shrink-0 p-3 bg-accent/10 rounded-lg">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Phục Vụ 24/7</h3>
                <p className="text-sm text-muted-foreground">Dịch vụ taxi luôn sẵn sàng mọi lúc, mọi nơi</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-5 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
              <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Đặt Xe Nhanh Chóng</h3>
                <p className="text-sm text-muted-foreground">Tìm và đặt taxi chỉ trong vài giây</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AdvertisementBanner() {
  const { t } = useLanguage()
  
  return (
    <section className="relative py-12 bg-gradient-to-r from-primary via-accent to-primary overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left space-y-6">
              <div className="flex items-center justify-center md:justify-start space-x-4">
                <div className="icon-container w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center animate-pulse">
                  <Car className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">{t.adTitle}</h3>
                  <div className="rating-stars flex items-center space-x-1 text-yellow-300">
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <span className="text-lg font-semibold ml-2 text-white">{t.adRating}</span>
                  </div>
                </div>
              </div>
              <p className="text-xl text-white/90 leading-relaxed">
                {t.adDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button className="bg-white text-primary hover:bg-white/90 px-10 py-4 text-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg">
                  {t.bookNow}
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-10 py-4 text-xl font-bold transition-all duration-300 hover:scale-105">
                  {t.learnMore}
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="w-full h-64 bg-white/10 backdrop-blur rounded-3xl flex items-center justify-center border border-white/20">
                  <div className="text-center space-y-4">
                    <Car className="h-20 w-20 text-white mx-auto animate-bounce" />
                    <p className="text-white text-2xl font-bold">Premium Service</p>
                    <div className="flex items-center justify-center space-x-2">
                      <Star className="h-6 w-6 text-yellow-300 fill-current" />
                      <Star className="h-6 w-6 text-yellow-300 fill-current" />
                      <Star className="h-6 w-6 text-yellow-300 fill-current" />
                      <Star className="h-6 w-6 text-yellow-300 fill-current" />
                      <Star className="h-6 w-6 text-yellow-300 fill-current" />
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Star className="h-6 w-6 text-white fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroSection() {
  const { t } = useLanguage()
  
  return (
    <section className="homepage relative py-8 sm:py-12 lg:py-16 overflow-hidden page-enter">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-no-repeat opacity-100 dark:opacity-60"
        style={{
          backgroundImage: "url('/taxi.png')",
          backgroundSize: "150% auto",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Overlay gradients - darker background for better text visibility */}
      <div className="absolute inset-0 gradient-black-yellow opacity-40 dark:opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 via-yellow-200/50 to-yellow-300/50 dark:opacity-0" />

      {/* Left to right gradient to ensure taxi front is visible on the right */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-transparent dark:from-background/95 dark:via-background/70" />

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

      <div className="container relative lg:ml-16 px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center min-h-[40vh] sm:min-h-[50vh]">
          <div className="hero-section space-y-4 sm:space-y-6 animate-slide-in-left flex flex-col justify-center text-center lg:text-left p-4 sm:p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-primary/10 shadow-xl">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-balance leading-tight drop-shadow-lg text-black dark:text-white homepage-text">
                {t.heroTitle}
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-foreground text-pretty max-w-lg font-medium leading-relaxed drop-shadow-md homepage-text">
                {t.heroSubtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/listing">
                <Button
                  size="default"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 animate-glow hover-lift w-full sm:w-auto transition-all duration-300"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {t.registerCompany}
                </Button>
              </Link>
              <Link href="/drivers">
                <Button
                  size="default"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground hover-glow bg-transparent w-full sm:w-auto transition-all duration-300"
                >
                  {t.registerDriver}
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:pl-20 animate-slide-in-right">
            <Card className="p-6 bg-card/80 backdrop-blur border-primary/30 hover-lift animate-glow bg-white/90 dark:bg-card/80">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">{t.searchPlaceholder}</h3>

                <div className="space-y-3">
                  <div className="relative animate-fade-in-up">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-primary" />
                    <Input placeholder={t.pickupPoint} className="pl-10 border-primary/30 focus:border-primary hover-glow" />
                  </div>

                  <div className="relative animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-primary" />
                    <Input placeholder={t.destination} className="pl-10 border-primary/30 focus:border-primary hover-glow" />
                  </div>

                  <div className="relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-primary" />
                    <Input type="datetime-local" placeholder={t.pickupTime} className="pl-10 border-primary/30 focus:border-primary hover-glow" />
                  </div>
                </div>

                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 animate-glow hover-lift animate-fade-in-up"
                  style={{ animationDelay: "0.3s" }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  {t.searchButton}
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
  const { t } = useLanguage()
  
  const features = [
    {
      icon: Building2,
      title: t.feature1Title,
      description: t.feature1Desc,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Users,
      title: t.feature2Title,
      description: t.feature2Desc,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: MessageSquare,
      title: t.feature3Title,
      description: t.feature3Desc,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Star,
      title: t.feature4Title,
      description: t.feature4Desc,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Shield,
      title: t.feature1Title,
      description: t.feature1Desc,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Clock,
      title: t.feature4Title,
      description: t.feature4Desc,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ]

  return (
    <section
      id="features"
      className="relative py-12 sm:py-16 lg:py-20 bg-background/50 bg-gradient-to-br from-yellow-100/80 via-yellow-200/80 to-yellow-300/80 dark:bg-background/50 overflow-hidden slide-in-left"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-no-repeat opacity-100 dark:opacity-60"
        style={{
          backgroundImage: "url('/taxibg2.jpg')",
          backgroundSize: "100% auto",
          backgroundPosition: "10% center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Overlay gradients - darker background for better text visibility */}
      <div className="absolute inset-0 gradient-black-yellow opacity-40 dark:opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 via-yellow-200/50 to-yellow-300/50 dark:opacity-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-transparent dark:from-background/95 dark:via-background/70" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t.featuresTitle}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-muted-foreground text-pretty max-w-2xl mx-auto">
            {t.featuresSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-primary/20 bg-white/90 dark:bg-card/80 backdrop-blur hover-lift animate-fade-in-up hover-glow group card-transition"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 animate-float group-hover:animate-glow`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed text-gray-600 dark:text-muted-foreground">
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
  const { t } = useLanguage()
  
  const plans = [
    {
      name: "Free",
      price: "0",
      period: "Free",
      description: "For new individual drivers",
      features: ["Basic information registration", "Taxi company search", "Basic feedback", "Email support"],
      buttonText: t.getStarted,
      popular: false,
    },
    {
      name: "Basic",
      price: "299,000",
      period: "VND/month",
      quarterlyPrice: "799,000",
      quarterlyPeriod: "VND/quarter",
      description: "For small taxi companies and professional drivers",
      features: [
        "All Free features",
        "Basic service advertising",
        "Basic statistics",
        "Phone support",
        "Up to 10 vehicles",
      ],
      buttonText: "Choose Basic Plan",
      popular: false,
    },
    {
      name: "Premium",
      price: "699,000",
      period: "VND/month",
      quarterlyPrice: "1,899,000",
      quarterlyPeriod: "VND/quarter",
      description: "For large taxi companies and strategic partners",
      features: [
        "All Basic features",
        "Priority advertising",
        "Detailed statistics",
        "24/7 support",
        "Unlimited vehicles",
        "API integration",
        "Custom reports",
      ],
      buttonText: "Choose Premium Plan",
      popular: true,
    },
  ]

  return (
    <section
      id="pricing"
      className="relative py-20 bg-gradient-to-br from-yellow-100/60 via-yellow-200/60 to-yellow-300/60 dark:bg-transparent overflow-hidden slide-in-right"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-no-repeat opacity-100 dark:opacity-60"
        style={{
          backgroundImage: "url('/taxi3.jpg')",
          backgroundSize: "100% auto",
          backgroundPosition: "10% center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Overlay gradients - darker background for better text visibility */}
      <div className="absolute inset-0 gradient-black-yellow opacity-40 dark:opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 via-yellow-200/50 to-yellow-300/50 dark:opacity-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-transparent dark:from-background/95 dark:via-background/70" />

      <div className="container max-w-7xl mx-auto px-4 relative">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance text-gray-900 dark:text-white">
            {t.pricingTitle}
          </h2>
          <p className="text-xl text-gray-600 dark:text-muted-foreground text-pretty max-w-2xl mx-auto">
            {t.pricingSubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto justify-items-center">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-border/50 bg-white/90 dark:bg-card/50 backdrop-blur w-full max-w-sm card-transition ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
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
  const { t } = useLanguage()
  
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
    <section
      id="partners"
      className="relative py-20 bg-gradient-to-br from-yellow-100/70 via-yellow-200/70 to-yellow-300/70 dark:bg-muted/30 overflow-hidden fade-in-scale"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-no-repeat opacity-100 dark:opacity-60"
        style={{
          backgroundImage: "url('/taxi4.jpg')",
          backgroundSize: "100% auto",
          backgroundPosition: "10% center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Overlay gradients - darker background for better text visibility */}
      <div className="absolute inset-0 gradient-black-yellow opacity-40 dark:opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 via-yellow-200/50 to-yellow-300/50 dark:opacity-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-transparent dark:from-background/95 dark:via-background/70" />

      <div className="container max-w-7xl mx-auto px-4 relative">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance text-gray-900 dark:text-white">{t.partnersTitle}</h2>
          <p className="text-xl text-gray-600 dark:text-muted-foreground text-pretty max-w-2xl mx-auto">
            {t.partnersSubtitle}
          </p>
        </div>

        <Card className="p-12 bg-white/90 dark:bg-card/50 backdrop-blur border-border/50 max-w-full mx-auto">
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
            <div className="text-gray-600 dark:text-muted-foreground">Công ty taxi</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary mb-2">10,000+</div>
            <div className="text-gray-600 dark:text-muted-foreground">Tài xế đăng ký</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">1M+</div>
            <div className="text-gray-600 dark:text-muted-foreground">Lượt tìm kiếm/tháng</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TaxiVideoSection() {
  const { t } = useLanguage()
  
  return (
    <section className="relative py-16 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 dark:bg-background/50 overflow-hidden fade-in-scale">
      <div className="container max-w-6xl mx-auto px-4 relative">
        <div className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t.videoTitle}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-muted-foreground text-pretty max-w-2xl mx-auto">
            {t.videoSubtitle}
          </p>
        </div>

        {/* Video container that extends beyond section boundaries */}
        <div className="relative -mx-4 sm:-mx-8 lg:-mx-16 xl:-mx-24">
          <div className="relative">
            <video 
              className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] object-cover" 
              autoPlay 
              loop 
              muted 
              playsInline
            >
              <source src="/taxivideo.mp4" type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ video.
            </video>

            {/* Video overlay with play indicator */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

            {/* Floating badge */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-primary/90 text-primary-foreground backdrop-blur">
                <Car className="h-3 w-3 mr-1" />
                Dịch vụ chuyên nghiệp
              </Badge>
            </div>
          </div>
        </div>

        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 animate-fade-in-up">
          <Link href="/listing">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 animate-glow hover-lift"
            >
              <Building2 className="h-5 w-5 mr-2" />
              Đăng ký công ty taxi
            </Button>
          </Link>
          <Link href="/drivers">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground hover-glow bg-transparent"
            >
              <Users className="h-5 w-5 mr-2" />
              Trở thành tài xế
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

function HomePageContent() {
  const { leftCollapsed, rightCollapsed } = useSidebar()
  const bothCollapsed = leftCollapsed && rightCollapsed
  
  return (
    <div className="min-h-screen gradient-radial-yellow bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 dark:gradient-radial-yellow">
      <Header />
      
      {/* Ad Sidebars */}
      <AdSidebar position="left" />
      <AdSidebar position="right" />
      
      <main className={`relative overflow-hidden ${bothCollapsed ? 'sidebars-collapsed' : ''}`} id="main-content">
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

        <QuickStatsSection />
        <AdvertisementBanner />
        <HeroSection />
        <FeaturesSection />
        <TaxiVideoSection />
        <PricingSection />
        <PartnersSection />
      </main>
    </div>
  )
}

export default function HomePage() {
  return (
    <SidebarProvider>
      <HomePageContent />
    </SidebarProvider>
  )
}
