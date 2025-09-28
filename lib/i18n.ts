export type Language = 'vi' | 'en'

export interface Translations {
  // Header
  home: string
  taxiCompanies: string
  drivers: string
  advertise: string
  services: string
  feedback: string
  login: string
  register: string
  downloadApp: string
  
  // Hero Section
  heroTitle: string
  heroSubtitle: string
  searchPlaceholder: string
  searchButton: string
  pickupPoint: string
  destination: string
  pickupTime: string
  registerCompany: string
  registerDriver: string
  
  // Features
  featuresTitle: string
  featuresSubtitle: string
  feature1Title: string
  feature1Desc: string
  feature2Title: string
  feature2Desc: string
  feature3Title: string
  feature3Desc: string
  feature4Title: string
  feature4Desc: string
  
  // Video Section
  videoTitle: string
  videoSubtitle: string
  
  // Pricing
  pricingTitle: string
  pricingSubtitle: string
  basicPlan: string
  premiumPlan: string
  enterprisePlan: string
  
  // Partners
  partnersTitle: string
  partnersSubtitle: string
  
  // Sidebar
  featuredTaxis: string
  partners: string
  viewAll: string
  details: string
  call: string
  online: string
  featured: string
  
  // Common
  getStarted: string
  learnMore: string
  contactUs: string
  
  // Advertisement
  adTitle: string
  adDescription: string
  adRating: string
  bookNow: string
}

export const translations: Record<Language, Translations> = {
  vi: {
    // Header
    home: 'Trang Chủ',
    taxiCompanies: 'Công Ty Taxi',
    drivers: 'Tài Xế',
    advertise: 'Quảng Cáo',
    services: 'Dịch Vụ',
    feedback: 'Góp Ý',
    login: 'Đăng Nhập',
    register: 'Đăng Ký',
    downloadApp: 'TẢI ỨNG DỤNG NGAY',
    
    // Hero Section
    heroTitle: 'Kết Nối Taxi Thông Minh',
    heroSubtitle: 'Tìm kiếm và đặt taxi nhanh chóng, an toàn với công nghệ tiên tiến',
    searchPlaceholder: 'Tìm kiếm dịch vụ taxi',
    searchButton: 'Tìm Kiếm Taxi',
    pickupPoint: 'Điểm đón',
    destination: 'Điểm đến',
    pickupTime: 'Ngày giờ đón',
    registerCompany: 'Đăng Ký Công Ty Taxi',
    registerDriver: 'Đăng Ký Tài Xế',
    
    // Features
    featuresTitle: 'Tại Sao Chọn Chúng Tôi',
    featuresSubtitle: 'Dịch vụ taxi hàng đầu với công nghệ hiện đại',
    feature1Title: 'Đặt Xe Nhanh Chóng',
    feature1Desc: 'Chỉ cần vài cú click để đặt xe trong vòng 2 phút',
    feature2Title: 'Tài Xế Chuyên Nghiệp',
    feature2Desc: 'Đội ngũ tài xế được đào tạo chuyên nghiệp và thân thiện',
    feature3Title: 'Giá Cả Minh Bạch',
    feature3Desc: 'Bảng giá rõ ràng, không phát sinh chi phí ẩn',
    feature4Title: 'Hỗ Trợ 24/7',
    feature4Desc: 'Đội ngũ hỗ trợ khách hàng 24/7 sẵn sàng giúp đỡ',
    
    // Video Section
    videoTitle: 'Trải Nghiệm Dịch Vụ Taxi',
    videoSubtitle: 'Xem video để hiểu rõ hơn về dịch vụ của chúng tôi',
    
    // Pricing
    pricingTitle: 'Bảng Giá Dịch Vụ',
    pricingSubtitle: 'Lựa chọn gói dịch vụ phù hợp với nhu cầu của bạn',
    basicPlan: 'Gói Cơ Bản',
    premiumPlan: 'Gói Cao Cấp',
    enterprisePlan: 'Gói Doanh Nghiệp',
    
    // Partners
    partnersTitle: 'Đối Tác Tin Cậy',
    partnersSubtitle: 'Hơn 500+ công ty taxi và 10,000+ tài xế đã tin tưởng sử dụng RadioCabs.in',
    
    // Sidebar
    featuredTaxis: 'Taxi Nổi Bật',
    partners: 'Đối Tác',
    viewAll: 'Xem Tất Cả',
    details: 'Chi Tiết',
    call: 'Gọi',
    online: 'Online',
    featured: 'Nổi Bật',
    
    // Common
    getStarted: 'Bắt Đầu',
    learnMore: 'Tìm Hiểu Thêm',
    contactUs: 'Liên Hệ',
    
    // Advertisement
    adTitle: 'Dịch Vụ Taxi Cao Cấp',
    adDescription: 'Trải nghiệm sang trọng với các đối tác taxi cao cấp của chúng tôi',
    adRating: '4.9/5',
    bookNow: 'Đặt Ngay'
  },
  
  en: {
    // Header
    home: 'Home',
    taxiCompanies: 'Taxi Companies',
    drivers: 'Drivers',
    advertise: 'Advertise',
    services: 'Services',
    feedback: 'Feedback',
    login: 'Login',
    register: 'Register',
    downloadApp: 'DOWNLOAD APP NOW',
    
    // Hero Section
    heroTitle: 'Smart Taxi Connection',
    heroSubtitle: 'Find and book taxis quickly and safely with advanced technology',
    searchPlaceholder: 'Search taxi service',
    searchButton: 'Search Taxi',
    pickupPoint: 'Pickup Point',
    destination: 'Destination',
    pickupTime: 'Pickup Time',
    registerCompany: 'Register Taxi Company',
    registerDriver: 'Register Driver',
    
    // Features
    featuresTitle: 'Why Choose Us',
    featuresSubtitle: 'Leading taxi service with modern technology',
    feature1Title: 'Quick Booking',
    feature1Desc: 'Just a few clicks to book a taxi in 2 minutes',
    feature2Title: 'Professional Drivers',
    feature2Desc: 'Team of professionally trained and friendly drivers',
    feature3Title: 'Transparent Pricing',
    feature3Desc: 'Clear pricing table, no hidden costs',
    feature4Title: '24/7 Support',
    feature4Desc: '24/7 customer support team ready to help',
    
    // Video Section
    videoTitle: 'Taxi Service Experience',
    videoSubtitle: 'Watch the video to better understand our service',
    
    // Pricing
    pricingTitle: 'Service Pricing',
    pricingSubtitle: 'Choose the service package that suits your needs',
    basicPlan: 'Basic Plan',
    premiumPlan: 'Premium Plan',
    enterprisePlan: 'Enterprise Plan',
    
    // Partners
    partnersTitle: 'Trusted Partners',
    partnersSubtitle: 'Over 500+ taxi companies and 10,000+ drivers trust RadioCabs.in',
    
    // Sidebar
    featuredTaxis: 'Featured Taxis',
    partners: 'Partners',
    viewAll: 'View All',
    details: 'Details',
    call: 'Call',
    online: 'Online',
    featured: 'Featured',
    
    // Common
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    contactUs: 'Contact Us',
    
    // Advertisement
    adTitle: 'Premium Taxi Service',
    adDescription: 'Experience luxury with our premium taxi partners',
    adRating: '4.9/5',
    bookNow: 'Book Now'
  }
}
