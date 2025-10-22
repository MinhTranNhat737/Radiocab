// Mock data để thay thế database
export interface Company {
  id: number
  name: string
  hotline: string
  email: string
  address: string
  taxCode: string
  status: 'ACTIVE' | 'INACTIVE'
  contactAccountId: number
  createdAt: string
  updatedAt?: string
  fax: string
}

export interface Vehicle {
  id: number
  companyId: number
  modelId: number
  plateNumber: string
  vin?: string
  color?: string
  yearManufactured?: number
  inServiceFrom: string
  odometerKm: number
  status: 'ACTIVE' | 'INACTIVE'
}

export interface VehicleModel {
  id: number
  companyId: number
  segmentId?: number
  brand: string
  modelName: string
  fuelType: 'GASOLINE' | 'DIESEL' | 'EV' | 'HYBRID'
  seatCategory: 'HATCHBACK_5' | 'SEDAN_5' | 'SUV_5' | 'SUV_7' | 'MPV_7'
  imageUrl?: string
  description?: string
  isActive: boolean
}

export interface DrivingOrder {
  id: number
  companyId: number
  customerAccountId?: number
  vehicleId?: number
  driverAccountId?: number
  modelId: number
  priceRefId?: number
  fromProvinceId: number
  toProvinceId: number
  pickupAddress?: string
  dropoffAddress?: string
  pickupTime?: string
  dropoffTime?: string
  status: 'NEW' | 'ASSIGNED' | 'ONGOING' | 'DONE' | 'CANCELLED' | 'FAILED'
  totalKm: number
  innerCityKm: number
  intercityKm: number
  trafficKm: number
  isRaining: boolean
  waitMinutes: number
  baseFare: number
  trafficUnitPrice: number
  trafficFee: number
  rainFee: number
  intercityUnitPrice: number
  intercityFee: number
  otherFee: number
  totalAmount: number
  fareBreakdown?: any
  paymentMethod?: 'CASH' | 'CARD' | 'WALLET' | 'BANK'
  paidAt?: string
  createdAt: string
  updatedAt?: string
}

export interface Province {
  id: number
  code?: string
  name: string
}

// Mock Companies
export const MOCK_COMPANIES: Company[] = [
  {
    id: 1,
    name: "Vinasun Taxi",
    hotline: "028.38.27.27.27",
    email: "info@vinasun.com.vn",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    taxCode: "0123456789",
    status: "ACTIVE",
    contactAccountId: 2,
    createdAt: "2024-01-01T00:00:00Z",
    fax: "028.38.27.27.28"
  },
  {
    id: 2,
    name: "Mai Linh Taxi",
    hotline: "028.38.38.38.38",
    email: "info@mailinh.vn",
    address: "456 Đường DEF, Quận 3, TP.HCM",
    taxCode: "0987654321",
    status: "ACTIVE",
    contactAccountId: 3,
    createdAt: "2024-01-15T00:00:00Z",
    fax: "028.38.38.38.39"
  },
  {
    id: 3,
    name: "Saigon Taxi",
    hotline: "028.39.39.39.39",
    email: "info@saigontaxi.com.vn",
    address: "789 Đường GHI, Quận 5, TP.HCM",
    taxCode: "1122334455",
    status: "ACTIVE",
    contactAccountId: 4,
    createdAt: "2024-02-01T00:00:00Z",
    fax: "028.39.39.39.40"
  }
]

// Mock Vehicles
export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 1,
    companyId: 1,
    modelId: 1,
    plateNumber: "51A-12345",
    vin: "VIN123456789",
    color: "Trắng",
    yearManufactured: 2020,
    inServiceFrom: "2024-01-01",
    odometerKm: 50000,
    status: "ACTIVE"
  },
  {
    id: 2,
    companyId: 1,
    modelId: 2,
    plateNumber: "51A-67890",
    vin: "VIN987654321",
    color: "Xanh",
    yearManufactured: 2021,
    inServiceFrom: "2024-01-15",
    odometerKm: 30000,
    status: "ACTIVE"
  },
  {
    id: 3,
    companyId: 2,
    modelId: 3,
    plateNumber: "51B-11111",
    vin: "VIN111111111",
    color: "Đỏ",
    yearManufactured: 2019,
    inServiceFrom: "2024-02-01",
    odometerKm: 80000,
    status: "ACTIVE"
  }
]

// Mock Vehicle Models
export const MOCK_VEHICLE_MODELS: VehicleModel[] = [
  {
    id: 1,
    companyId: 1,
    segmentId: 1,
    brand: "Toyota",
    modelName: "Vios",
    fuelType: "GASOLINE",
    seatCategory: "SEDAN_5",
    imageUrl: "/Taxi2.jpg",
    description: "Xe sedan 4 chỗ tiết kiệm nhiên liệu",
    isActive: true
  },
  {
    id: 2,
    companyId: 1,
    segmentId: 1,
    brand: "Honda",
    modelName: "City",
    fuelType: "GASOLINE",
    seatCategory: "SEDAN_5",
    imageUrl: "/Taxi3.jpg",
    description: "Xe sedan 4 chỗ sang trọng",
    isActive: true
  },
  {
    id: 3,
    companyId: 2,
    segmentId: 2,
    brand: "Toyota",
    modelName: "Innova",
    fuelType: "DIESEL",
    seatCategory: "MPV_7",
    imageUrl: "/Taxi4.jpg",
    description: "Xe 7 chỗ phù hợp gia đình",
    isActive: true
  }
]

// Mock Driving Orders
export const MOCK_DRIVING_ORDERS: DrivingOrder[] = [
  {
    id: 1,
    companyId: 1,
    customerAccountId: 5,
    vehicleId: 1,
    driverAccountId: 6,
    modelId: 1,
    fromProvinceId: 1,
    toProvinceId: 1,
    pickupAddress: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    dropoffAddress: "456 Lê Lợi, Quận 3, TP.HCM",
    pickupTime: "2024-10-13T08:00:00Z",
    dropoffTime: "2024-10-13T08:30:00Z",
    status: "DONE",
    totalKm: 5.2,
    innerCityKm: 5.2,
    intercityKm: 0,
    trafficKm: 0,
    isRaining: false,
    waitMinutes: 0,
    baseFare: 12000,
    trafficUnitPrice: 0,
    trafficFee: 0,
    rainFee: 0,
    intercityUnitPrice: 0,
    intercityFee: 0,
    otherFee: 0,
    totalAmount: 12000,
    paymentMethod: "CASH",
    paidAt: "2024-10-13T08:30:00Z",
    createdAt: "2024-10-13T07:45:00Z"
  },
  {
    id: 2,
    companyId: 1,
    customerAccountId: 7,
    vehicleId: 2,
    driverAccountId: 8,
    modelId: 2,
    fromProvinceId: 1,
    toProvinceId: 1,
    pickupAddress: "789 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    dropoffAddress: "321 Cách Mạng Tháng 8, Quận 10, TP.HCM",
    pickupTime: "2024-10-13T14:00:00Z",
    status: "ONGOING",
    totalKm: 8.5,
    innerCityKm: 8.5,
    intercityKm: 0,
    trafficKm: 0,
    isRaining: true,
    waitMinutes: 5,
    baseFare: 12000,
    trafficUnitPrice: 0,
    trafficFee: 0,
    rainFee: 2000,
    intercityUnitPrice: 0,
    intercityFee: 0,
    otherFee: 0,
    totalAmount: 14000,
    paymentMethod: "CARD",
    createdAt: "2024-10-13T13:45:00Z"
  }
]

// Mock Provinces
export const MOCK_PROVINCES: Province[] = [
  { id: 1, code: "SG", name: "TP. Hồ Chí Minh" },
  { id: 2, code: "HN", name: "Hà Nội" },
  { id: 3, code: "DN", name: "Đà Nẵng" },
  { id: 4, code: "CT", name: "Cần Thơ" }
]

// Helper functions để lấy dữ liệu theo role
export const getCompaniesByRole = (userRole: string, userCompanyId?: number) => {
  if (userRole === 'ADMIN') {
    return MOCK_COMPANIES
  }
  if (userRole === 'MANAGER' || userRole === 'ACCOUNTANT' || userRole === 'DISPATCHER') {
    return MOCK_COMPANIES.filter(company => company.id === userCompanyId)
  }
  return []
}

export const getVehiclesByRole = (userRole: string, userCompanyId?: number) => {
  if (userRole === 'ADMIN') {
    return MOCK_VEHICLES
  }
  if (userRole === 'MANAGER' || userRole === 'ACCOUNTANT' || userRole === 'DISPATCHER') {
    return MOCK_VEHICLES.filter(vehicle => vehicle.companyId === userCompanyId)
  }
  if (userRole === 'DRIVER') {
    // Driver chỉ thấy xe được phân công
    return MOCK_VEHICLES.filter(vehicle => vehicle.companyId === userCompanyId)
  }
  return []
}

export const getOrdersByRole = (userRole: string, userCompanyId?: number, userId?: number) => {
  if (userRole === 'ADMIN') {
    return MOCK_DRIVING_ORDERS
  }
  if (userRole === 'MANAGER' || userRole === 'DISPATCHER') {
    return MOCK_DRIVING_ORDERS.filter(order => order.companyId === userCompanyId)
  }
  if (userRole === 'DRIVER') {
    return MOCK_DRIVING_ORDERS.filter(order => order.driverAccountId === userId)
  }
  if (userRole === 'CUSTOMER') {
    return MOCK_DRIVING_ORDERS.filter(order => order.customerAccountId === userId)
  }
  return []
}

export const getCompanyById = (companyId: number) => {
  return MOCK_COMPANIES.find(company => company.id === companyId)
}

export const getVehicleById = (vehicleId: number) => {
  return MOCK_VEHICLES.find(vehicle => vehicle.id === vehicleId)
}

export const getOrderById = (orderId: number) => {
  return MOCK_DRIVING_ORDERS.find(order => order.id === orderId)
}
