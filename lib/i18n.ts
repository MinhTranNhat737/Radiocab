export type Language = 'vi' | 'en'

export interface Translations {
  home: string
  taxiCompanies: string
  drivers: string
  services: string
  feedback: string
  login: string
  register: string
  downloadApp: string
  heroTitle: string
  heroSubtitle: string
  searchPlaceholder: string
  searchButton: string
  pickupPoint: string
  destination: string
  pickupTime: string
  registerCompany: string
  registerDriver: string
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
  videoTitle: string
  videoSubtitle: string
  pricingTitle: string
  pricingSubtitle: string
  basicPlan: string
  premiumPlan: string
  enterprisePlan: string
  partnersTitle: string
  partnersSubtitle: string
  featuredTaxis: string
  partners: string
  viewAll: string
  details: string
  call: string
  online: string
  featured: string
  getStarted: string
  learnMore: string
  contactUs: string
  listingTitle: string
  listingSubtitle: string
  registerCompanyTab: string
  searchCompanyTab: string
  companyRegistrationTitle: string
  companyRegistrationDesc: string
  companyInfo: string
  contactInfo: string
  membershipType: string
  paymentMethod: string
  companyName: string
  companyId: string
  password: string
  contactPerson: string
  designation: string
  address: string
  mobile: string
  telephone: string
  fax: string
  email: string
  website: string
  description: string
  monthly: string
  quarterly: string
  free: string
  basic: string
  premium: string
  monthlyFee: string
  quarterlyFee: string
  reset: string
  searchCompanyTitle: string
  searchCompanyDesc: string
  searchResults: string
  enterKeyword: string
  driversTitle: string
  driversSubtitle: string
  registerDriverTab: string
  searchDriverTab: string
  driverRegistrationTitle: string
  driverRegistrationDesc: string
  personalInfo: string
  contactExperience: string
  driverName: string
  driverId: string
  city: string
  experience: string
  driverDescription: string
  experienceYears: string
  describeYourself: string
  payment: string
  cost: string
  searchDriverTitle: string
  searchDriverDesc: string
  searchDriverPlaceholder: string
  enterDriverKeyword: string
  servicesTitle: string
  servicesSubtitle: string
  ourServices: string
  whyChooseUs: string
  whatCustomersSay: string
  howItWorks: string
  startToday: string
  chooseService: string
  sendFeedback: string
  step1: string
  step2: string
  step3: string
  step4: string
  step1Desc: string
  step2Desc: string
  step3Desc: string
  step4Desc: string
  hotline: string
  workingHours: string
  service1Title: string
  service1Desc: string
  service1Features: string
  service1Pricing: string
  service2Title: string
  service2Desc: string
  service2Features: string
  service2Pricing: string
  service3Title: string
  service3Desc: string
  service3Features: string
  service3Pricing: string
  service4Title: string
  service4Desc: string
  service4Features: string
  service4Pricing: string
  benefit1Title: string
  benefit1Desc: string
  benefit2Title: string
  benefit2Desc: string
  benefit3Title: string
  benefit3Desc: string
  benefit4Title: string
  benefit4Desc: string
  testimonial1: string
  testimonial2: string
  testimonial3: string
  testimonial1Role: string
  testimonial2Role: string
  testimonial3Role: string
  mainFeatures: string
}

export const translations: Record<Language, Translations> = {
  vi: {
    home: 'Trang Chủ',
    taxiCompanies: 'Công Ty Taxi',
    drivers: 'Tài Xế',
    services: 'Dịch Vụ',
    feedback: 'Góp Ý',
    login: 'Đăng Nhập',
    register: 'Đăng Ký',
    downloadApp: 'TẢI ỨNG DỤNG NGAY',
    heroTitle: 'Kết Nối Taxi Thông Minh',
    heroSubtitle: 'Tìm kiếm và đặt taxi nhanh chóng, an toàn với công nghệ tiên tiến',
    searchPlaceholder: 'Tìm kiếm dịch vụ taxi',
    searchButton: 'Tìm Kiếm Taxi',
    pickupPoint: 'Điểm đón',
    destination: 'Điểm đến',
    pickupTime: 'Ngày giờ đón',
    registerCompany: 'Đăng Ký Công Ty Taxi',
    registerDriver: 'Đăng Ký Tài Xế',
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
    videoTitle: 'Trải Nghiệm Dịch Vụ Taxi',
    videoSubtitle: 'Xem video để hiểu rõ hơn về dịch vụ của chúng tôi',
    pricingTitle: 'Bảng Giá Dịch Vụ',
    pricingSubtitle: 'Lựa chọn gói dịch vụ phù hợp với nhu cầu của bạn',
    basicPlan: 'Gói Cơ Bản',
    premiumPlan: 'Gói Cao Cấp',
    enterprisePlan: 'Gói Doanh Nghiệp',
    partnersTitle: 'Đối Tác Tin Cậy',
    partnersSubtitle: 'Hơn 500+ công ty taxi và 10,000+ tài xế đã tin tưởng sử dụng RadioCabs.in',
    featuredTaxis: 'Taxi Nổi Bật',
    partners: 'Đối Tác',
    viewAll: 'Xem Tất Cả',
    details: 'Chi Tiết',
    call: 'Gọi',
    online: 'Online',
    featured: 'Nổi Bật',
    getStarted: 'Bắt Đầu',
    learnMore: 'Tìm Hiểu Thêm',
    contactUs: 'Liên Hệ',
    listingTitle: 'Đăng ký & Tìm kiếm Công ty Taxi',
    listingSubtitle: 'Đăng ký công ty taxi của bạn hoặc tìm kiếm các công ty taxi đã đăng ký trên hệ thống RadioCabs.in',
    registerCompanyTab: 'Đăng ký công ty',
    searchCompanyTab: 'Tìm kiếm công ty',
    companyRegistrationTitle: 'Đăng ký công ty taxi',
    companyRegistrationDesc: 'Điền thông tin để đăng ký công ty taxi của bạn',
    companyInfo: 'Thông tin công ty',
    contactInfo: 'Thông tin liên hệ',
    membershipType: 'Loại thành viên',
    paymentMethod: 'Hình thức thanh toán',
    companyName: 'Tên công ty',
    companyId: 'Mã công ty (duy nhất)',
    password: 'Mật khẩu',
    contactPerson: 'Người liên hệ',
    designation: 'Chức vụ',
    address: 'Địa chỉ',
    mobile: 'Số điện thoại',
    telephone: 'Điện thoại bàn',
    fax: 'Fax',
    email: 'Email',
    website: 'Website',
    description: 'Mô tả',
    monthly: 'Theo tháng',
    quarterly: 'Theo quý',
    free: 'Free',
    basic: 'Basic',
    premium: 'Premium',
    monthlyFee: 'Phí hàng tháng',
    quarterlyFee: 'Phí hàng quý',
    reset: 'Đặt lại',
    searchCompanyTitle: 'Tìm kiếm công ty taxi',
    searchCompanyDesc: 'Tìm kiếm các công ty taxi đã đăng ký trên hệ thống',
    searchResults: 'Kết quả tìm kiếm',
    enterKeyword: 'Nhập từ khóa để tìm kiếm công ty taxi',
    driversTitle: 'Đăng ký & Tìm kiếm Tài xế',
    driversSubtitle: 'Đăng ký làm tài xế taxi hoặc tìm kiếm các tài xế có kinh nghiệm trên hệ thống RadioCabs.in',
    registerDriverTab: 'Đăng ký tài xế',
    searchDriverTab: 'Tìm kiếm tài xế',
    driverRegistrationTitle: 'Đăng ký tài xế taxi',
    driverRegistrationDesc: 'Điền thông tin để đăng ký làm tài xế taxi',
    personalInfo: 'Thông tin cá nhân',
    contactExperience: 'Liên hệ & Kinh nghiệm',
    driverName: 'Họ và tên',
    driverId: 'Mã tài xế (duy nhất)',
    city: 'Thành phố',
    experience: 'Kinh nghiệm (năm)',
    driverDescription: 'Mô tả bản thân',
    experienceYears: 'Kinh nghiệm (năm)',
    describeYourself: 'Mô tả về kinh nghiệm, kỹ năng lái xe...',
    payment: 'Hình thức thanh toán',
    cost: 'Chi phí',
    searchDriverTitle: 'Tìm kiếm tài xế',
    searchDriverDesc: 'Tìm kiếm các tài xế có kinh nghiệm đã đăng ký trên hệ thống',
    searchDriverPlaceholder: 'Nhập tên tài xế, mã tài xế, thành phố hoặc kinh nghiệm...',
    enterDriverKeyword: 'Nhập từ khóa để tìm kiếm tài xế',
    servicesTitle: 'Dịch vụ & Thông tin',
    servicesSubtitle: 'Khám phá các dịch vụ toàn diện của RadioCabs.in - nền tảng kết nối hàng đầu trong ngành taxi tại Việt Nam',
    ourServices: 'Các dịch vụ của chúng tôi',
    whyChooseUs: 'Tại sao chọn RadioCabs.in?',
    whatCustomersSay: 'Khách hàng nói gì về chúng tôi',
    howItWorks: 'Cách thức hoạt động',
    startToday: 'Bắt đầu ngay hôm nay',
    chooseService: 'Chọn dịch vụ phù hợp với nhu cầu của bạn',
    sendFeedback: 'Gửi Góp ý',
    step1: 'Đăng ký',
    step2: 'Xác thực',
    step3: 'Kích hoạt',
    step4: 'Kết nối',
    step1Desc: 'Tạo tài khoản và điền thông tin cần thiết',
    step2Desc: 'Chúng tôi xác thực thông tin và phê duyệt',
    step3Desc: 'Tài khoản được kích hoạt và sẵn sàng sử dụng',
    step4Desc: 'Bắt đầu kết nối và sử dụng dịch vụ',
    hotline: 'Hotline',
    workingHours: 'Giờ làm việc',
    service1Title: 'Đăng ký Công ty Taxi',
    service1Desc: 'Đăng ký công ty taxi của bạn lên hệ thống để tiếp cận nhiều khách hàng hơn',
    service1Features: 'Hiển thị thông tin công ty, Quản lý đội xe, Theo dõi đơn hàng, Báo cáo doanh thu',
    service1Pricing: 'Từ 200,000 VNĐ/tháng',
    service2Title: 'Đăng ký Tài xế',
    service2Desc: 'Tham gia mạng lưới tài xế chuyên nghiệp và tìm kiếm cơ hội việc làm',
    service2Features: 'Hồ sơ tài xế chuyên nghiệp, Kết nối với công ty, Đánh giá từ khách hàng, Hỗ trợ 24/7',
    service2Pricing: '150,000 VNĐ/tháng',
    service3Title: 'Hỗ trợ Khách hàng',
    service3Desc: 'Hệ thống hỗ trợ và góp ý toàn diện cho mọi người dùng',
    service3Features: 'Hỗ trợ 24/7, Xử lý khiếu nại, Tư vấn dịch vụ, Phản hồi nhanh chóng',
    service3Pricing: 'Miễn phí',
    service4Title: 'Quản lý Đội Xe',
    service4Desc: 'Giải pháp quản lý đội xe, theo dõi hành trình và tối ưu hóa lịch trình',
    service4Features: 'Quản lý đội xe, Tối ưu lộ trình, Báo cáo nâng cao',
    service4Pricing: 'Liên hệ để nhận báo giá',
    benefit1Title: 'Mạng lưới rộng khắp',
    benefit1Desc: 'Kết nối toàn quốc với hàng nghìn công ty taxi và tài xế',
    benefit2Title: 'Bảo mật tuyệt đối',
    benefit2Desc: 'Thông tin được mã hóa và bảo vệ theo tiêu chuẩn quốc tế',
    benefit3Title: 'Công nghệ hiện đại',
    benefit3Desc: 'Nền tảng công nghệ tiên tiến, giao diện thân thiện',
    benefit4Title: 'Cộng đồng lớn',
    benefit4Desc: 'Hơn 10,000 thành viên đang sử dụng dịch vụ',
    testimonial1: 'RadioCabs.in đã giúp chúng tôi mở rộng khách hàng đáng kể. Hệ thống dễ sử dụng và hỗ trợ tốt.',
    testimonial2: 'Tôi đã tìm được nhiều cơ hội việc làm tốt thông qua nền tảng này. Rất hài lòng với dịch vụ.',
    testimonial3: 'Dịch vụ quảng cáo hiệu quả, giúp tăng độ nhận biết thương hiệu và thu hút khách hàng mới.',
    testimonial1Role: 'Giám đốc Taxi Mai Linh',
    testimonial2Role: 'Tài xế độc lập',
    testimonial3Role: 'Chủ công ty vận tải',
    mainFeatures: 'Tính năng chính'
  },

  en: {
    home: 'Home',
    taxiCompanies: 'Taxi Companies',
    drivers: 'Drivers',
    services: 'Services',
    feedback: 'Feedback',
    login: 'Login',
    register: 'Register',
    downloadApp: 'DOWNLOAD APP NOW',
    heroTitle: 'Smart Taxi Connection',
    heroSubtitle: 'Find and book taxis quickly and safely with advanced technology',
    searchPlaceholder: 'Search taxi service',
    searchButton: 'Search Taxi',
    pickupPoint: 'Pickup Point',
    destination: 'Destination',
    pickupTime: 'Pickup Time',
    registerCompany: 'Register Taxi Company',
    registerDriver: 'Register Driver',
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
    videoTitle: 'Taxi Service Experience',
    videoSubtitle: 'Watch the video to better understand our service',
    pricingTitle: 'Service Pricing',
    pricingSubtitle: 'Choose the service package that suits your needs',
    basicPlan: 'Basic Plan',
    premiumPlan: 'Premium Plan',
    enterprisePlan: 'Enterprise Plan',
    partnersTitle: 'Trusted Partners',
    partnersSubtitle: 'Over 500+ taxi companies and 10,000+ drivers trust RadioCabs.in',
    featuredTaxis: 'Featured Taxis',
    partners: 'Partners',
    viewAll: 'View All',
    details: 'Details',
    call: 'Call',
    online: 'Online',
    featured: 'Featured',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    contactUs: 'Contact Us',
    listingTitle: 'Register & Search Taxi Companies',
    listingSubtitle: 'Register your taxi company or search for registered taxi companies on RadioCabs.in system',
    registerCompanyTab: 'Register Company',
    searchCompanyTab: 'Search Company',
    companyRegistrationTitle: 'Register Taxi Company',
    companyRegistrationDesc: 'Fill in the information to register your taxi company',
    companyInfo: 'Company Information',
    contactInfo: 'Contact Information',
    membershipType: 'Membership Type',
    paymentMethod: 'Payment Method',
    companyName: 'Company Name',
    companyId: 'Company ID (unique)',
    password: 'Password',
    contactPerson: 'Contact Person',
    designation: 'Designation',
    address: 'Address',
    mobile: 'Mobile Phone',
    telephone: 'Telephone',
    fax: 'Fax',
    email: 'Email',
    website: 'Website',
    description: 'Description',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    free: 'Free',
    basic: 'Basic',
    premium: 'Premium',
    monthlyFee: 'Monthly Fee',
    quarterlyFee: 'Quarterly Fee',
    reset: 'Reset',
    searchCompanyTitle: 'Search Taxi Companies',
    searchCompanyDesc: 'Search for registered taxi companies on the system',
    searchResults: 'Search Results',
    enterKeyword: 'Enter keywords to search for taxi companies',
    driversTitle: 'Register & Search Drivers',
    driversSubtitle: 'Register as a taxi driver or search for experienced drivers on RadioCabs.in system',
    registerDriverTab: 'Register Driver',
    searchDriverTab: 'Search Driver',
    driverRegistrationTitle: 'Register Taxi Driver',
    driverRegistrationDesc: 'Fill in the information to register as a taxi driver',
    personalInfo: 'Personal Information',
    contactExperience: 'Contact & Experience',
    driverName: 'Full Name',
    driverId: 'Driver ID (unique)',
    city: 'City',
    experience: 'Experience (years)',
    driverDescription: 'Self Description',
    experienceYears: 'Experience (years)',
    describeYourself: 'Describe your experience, driving skills...',
    payment: 'Payment Method',
    cost: 'Cost',
    searchDriverTitle: 'Search Drivers',
    searchDriverDesc: 'Search for experienced drivers registered on the system',
    searchDriverPlaceholder: 'Enter driver name, driver ID, city or experience...',
    enterDriverKeyword: 'Enter keywords to search for drivers',
    servicesTitle: 'Services & Information',
    servicesSubtitle: 'Discover comprehensive services of RadioCabs.in - the leading connection platform in Vietnam taxi industry',
    ourServices: 'Our Services',
    whyChooseUs: 'Why Choose RadioCabs.in?',
    whatCustomersSay: 'What Our Customers Say',
    howItWorks: 'How It Works',
    startToday: 'Start Today',
    chooseService: 'Choose the service that suits your needs',
    sendFeedback: 'Send Feedback',
    step1: 'Register',
    step2: 'Verify',
    step3: 'Activate',
    step4: 'Connect',
    step1Desc: 'Create account and fill in necessary information',
    step2Desc: 'We verify information and approve',
    step3Desc: 'Account is activated and ready to use',
    step4Desc: 'Start connecting and using services',
    hotline: 'Hotline',
    workingHours: 'Working Hours',
    service1Title: 'Taxi Company Registration',
    service1Desc: 'Register your taxi company on the system to reach more customers',
    service1Features: 'Display company information, Fleet management, Order tracking, Revenue reports',
    service1Pricing: 'From 200,000 VND/month',
    service2Title: 'Driver Registration',
    service2Desc: 'Join professional driver network and find job opportunities',
    service2Features: 'Professional driver profile, Connect with companies, Customer reviews, 24/7 support',
    service2Pricing: '150,000 VND/month',
    service3Title: 'Customer Support',
    service3Desc: 'Comprehensive support and feedback system for all users',
    service3Features: '24/7 support, Complaint handling, Service consultation, Quick response',
    service3Pricing: 'Free',
    service4Title: 'Fleet Management',
    service4Desc: 'Solutions to manage your fleet, track trips and optimize schedules',
    service4Features: 'Fleet administration, Route optimization, Advanced reporting',
    service4Pricing: 'Contact us for pricing',
    benefit1Title: 'Wide Network',
    benefit1Desc: 'Nationwide connection with thousands of taxi companies and drivers',
    benefit2Title: 'Absolute Security',
    benefit2Desc: 'Information encrypted and protected to international standards',
    benefit3Title: 'Modern Technology',
    benefit3Desc: 'Advanced technology platform, user-friendly interface',
    benefit4Title: 'Large Community',
    benefit4Desc: 'Over 10,000 members using our services',
    testimonial1: 'RadioCabs.in has helped us significantly expand our customer base. The system is easy to use and has good support.',
    testimonial2: 'I found many good job opportunities through this platform. Very satisfied with the service.',
    testimonial3: 'Effective advertising service, helping increase brand awareness and attract new customers.',
    testimonial1Role: 'Mai Linh Taxi Director',
    testimonial2Role: 'Independent Driver',
    testimonial3Role: 'Transport Company Owner',
    mainFeatures: 'Main Features'
  }
}