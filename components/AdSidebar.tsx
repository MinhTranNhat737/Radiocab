'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/SidebarManager"
import { useLanguage } from "@/contexts/LanguageContext"
import { 
  Building2, 
  Star, 
  MapPin, 
  Phone, 
  ExternalLink,
  TrendingUp,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  GripVertical
} from "lucide-react"
import Link from "next/link"

interface AdSidebarProps {
  position: 'left' | 'right'
}

export default function AdSidebar({ position }: AdSidebarProps) {
  const { leftCollapsed, rightCollapsed, toggleSidebars } = useSidebar()
  const { t } = useLanguage()
  const isCollapsed = position === 'left' ? leftCollapsed : rightCollapsed
  
  const ads = [
    {
      id: 1,
      company: "Mai Linh Taxi",
      title: "Dịch vụ taxi 24/7",
      description: "Đặt xe nhanh chóng, an toàn, giá cả hợp lý",
      rating: 4.8,
      reviews: 1250,
      location: "TP.HCM",
      phone: "028.38.38.38.38",
      image: "/mai-linh-taxi-logo.jpg",
      featured: true
    },
    {
      id: 2,
      company: "VinaSun Taxi",
      title: "Taxi chất lượng cao",
      description: "Đội ngũ tài xế chuyên nghiệp, xe đời mới",
      rating: 4.9,
      reviews: 2100,
      location: "Hà Nội",
      phone: "024.38.38.38.38",
      image: "/vinasun-taxi-logo.jpg",
      featured: false
    },
    {
      id: 3,
      company: "ABC Taxi",
      title: "Kết nối dễ dàng",
      description: "Ứng dụng đặt xe thông minh, thanh toán đa dạng",
      rating: 4.7,
      reviews: 890,
      location: "Đà Nẵng",
      phone: "0236.38.38.38",
      image: "/abc-taxi-logo.jpg",
      featured: true
    }
  ]

  return (
    <div className={`ad-sidebar ${position === 'left' ? 'left' : 'right'} ${isCollapsed ? 'collapsed' : 'visible'} hidden xl:block`}>
      {/* Drag Handle */}
      <div 
        className={`drag-handle ${position === 'left' ? 'left' : 'right'} ${isCollapsed ? 'collapsed' : ''}`}
        onClick={toggleSidebars}
        title={isCollapsed ? 'Kéo ra để mở' : 'Kéo vào để đóng'}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
        }}
      >
        <GripVertical className="h-6 w-6" />
        {isCollapsed && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        )}
      </div>

      {/* Toggle Button */}
      <div className="absolute top-2 right-2 z-50">
        <Button
          size="sm"
          variant="ghost"
          className="h-5 w-5 p-0 bg-white/80 hover:bg-white dark:bg-card/80 dark:hover:bg-card"
          onClick={toggleSidebars}
        >
          {isCollapsed ? (
            position === 'left' ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />
          ) : (
            <X className="h-3 w-3" />
          )}
        </Button>
      </div>

      <div className={`sidebar-content space-y-3 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
        {/* Header */}
        <div className="text-center mb-2">
          <h3 className="text-xs font-bold text-primary mb-1">
            {position === 'left' ? t.featuredTaxis : t.partners}
          </h3>
          <div className="w-4 h-0.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
        </div>

        {/* Ads */}
        {ads.map((ad, index) => (
          <Card 
            key={ad.id} 
            className={`ad-card group hover-lift card-transition bg-white/95 dark:bg-card/90 backdrop-blur border-primary/20 hover:border-primary/40 transition-all duration-300 ${
              ad.featured ? 'ring-2 ring-primary/30' : ''
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {ad.featured && (
              <div className="absolute -top-2 -right-2 z-10">
                <Badge className="featured-badge bg-primary text-primary-foreground text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Nổi bật
                </Badge>
              </div>
            )}
            
            <CardHeader className="pb-1">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                  <img 
                    src={ad.image} 
                    alt={ad.company}
                    className="w-4 h-4 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-logo.svg'
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xs font-semibold text-gray-900 dark:text-foreground truncate">
                    {ad.company}
                  </CardTitle>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <div className="flex items-center">
                      <Star className="h-2 w-2 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600 dark:text-muted-foreground ml-1">
                        {ad.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">({ad.reviews})</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-1">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-foreground text-xs mb-1">
                    {ad.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-muted-foreground leading-relaxed line-clamp-2">
                    {ad.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-2 w-2" />
                    <span className="truncate text-xs">{ad.location}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                    <TrendingUp className="h-2 w-2" />
                    <span className="text-xs">Online</span>
                  </div>
                </div>

                <div className="flex space-x-1 pt-1">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-6"
                  >
                    <ExternalLink className="h-2 w-2 mr-1" />
                    {t.details}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs h-6 border-primary/30 hover:bg-primary/10"
                  >
                    <Phone className="h-2 w-2 mr-1" />
                    {t.call}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Footer */}
        <div className="text-center pt-1">
          <Link href="/listing">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs h-6 border-primary/30 hover:bg-primary/10"
            >
              {t.viewAll}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
