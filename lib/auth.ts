// Authentication system with mock data

export interface User {
  id: string
  username: string
  email: string
  fullName: string
  role: 'admin' | 'company' | 'driver'
  password: string // In production, this should never be stored in frontend
  phone?: string
  companyName?: string
  driverLicense?: string
  createdAt: string
}

// Demo accounts
export const DEMO_ACCOUNTS: User[] = [
  // Admin accounts
  {
    id: 'admin-001',
    username: 'admin',
    email: 'admin@radiocabs.in',
    fullName: 'Quản Trị Viên',
    role: 'admin',
    password: 'Admin@123',
    phone: '0901234567',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'admin-002',
    username: 'superadmin',
    email: 'superadmin@radiocabs.in',
    fullName: 'Super Admin',
    role: 'admin',
    password: 'SuperAdmin@2024',
    phone: '0901234568',
    createdAt: '2024-01-01T00:00:00Z'
  },
  
  // Company accounts
  {
    id: 'company-001',
    username: 'vinasun',
    email: 'info@vinasun.vn',
    fullName: 'Nguyễn Văn A',
    role: 'company',
    password: 'Vinasun@123',
    phone: '0902345678',
    companyName: 'Vinasun Taxi',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'company-002',
    username: 'mailinh',
    email: 'contact@mailinh.vn',
    fullName: 'Trần Thị B',
    role: 'company',
    password: 'MaiLinh@123',
    phone: '0903456789',
    companyName: 'Mai Linh Taxi',
    createdAt: '2024-01-20T00:00:00Z'
  },
  {
    id: 'company-003',
    username: 'saigontaxi',
    email: 'info@saigontaxi.vn',
    fullName: 'Lê Văn C',
    role: 'company',
    password: 'SaigonTaxi@123',
    phone: '0904567890',
    companyName: 'Saigon Taxi',
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'company-004',
    username: 'vinataxigroup',
    email: 'contact@vinataxigroup.vn',
    fullName: 'Phạm Thị D',
    role: 'company',
    password: 'VinaTaxi@123',
    phone: '0905678901',
    companyName: 'Vina Taxi Group',
    createdAt: '2024-02-10T00:00:00Z'
  },
  {
    id: 'company-005',
    username: 'greentaxi',
    email: 'hello@greentaxi.vn',
    fullName: 'Hoàng Văn E',
    role: 'company',
    password: 'GreenTaxi@123',
    phone: '0906789012',
    companyName: 'Green Taxi',
    createdAt: '2024-02-15T00:00:00Z'
  },
  
  // Driver accounts
  {
    id: 'driver-001',
    username: 'driver001',
    email: 'driver001@radiocabs.in',
    fullName: 'Nguyễn Minh F',
    role: 'driver',
    password: 'Driver001@123',
    phone: '0907890123',
    driverLicense: 'B2-123456789',
    createdAt: '2024-01-25T00:00:00Z'
  },
  {
    id: 'driver-002',
    username: 'driver002',
    email: 'driver002@radiocabs.in',
    fullName: 'Trần Văn G',
    role: 'driver',
    password: 'Driver002@123',
    phone: '0908901234',
    driverLicense: 'B2-987654321',
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'driver-003',
    username: 'driver003',
    email: 'driver003@radiocabs.in',
    fullName: 'Lê Thị H',
    role: 'driver',
    password: 'Driver003@123',
    phone: '0909012345',
    driverLicense: 'B2-555666777',
    createdAt: '2024-02-05T00:00:00Z'
  },
  {
    id: 'driver-004',
    username: 'driver004',
    email: 'driver004@radiocabs.in',
    fullName: 'Phạm Văn I',
    role: 'driver',
    password: 'Driver004@123',
    phone: '0910123456',
    driverLicense: 'B2-111222333',
    createdAt: '2024-02-10T00:00:00Z'
  },
  {
    id: 'driver-005',
    username: 'driver005',
    email: 'driver005@radiocabs.in',
    fullName: 'Võ Thị K',
    role: 'driver',
    password: 'Driver005@123',
    phone: '0911234567',
    driverLicense: 'B2-444555666',
    createdAt: '2024-02-15T00:00:00Z'
  },
  {
    id: 'driver-006',
    username: 'driver006',
    email: 'driver006@radiocabs.in',
    fullName: 'Đặng Văn L',
    role: 'driver',
    password: 'Driver006@123',
    phone: '0912345678',
    driverLicense: 'B2-777888999',
    createdAt: '2024-02-20T00:00:00Z'
  },
  {
    id: 'driver-007',
    username: 'driver007',
    email: 'driver007@radiocabs.in',
    fullName: 'Bùi Thị M',
    role: 'driver',
    password: 'Driver007@123',
    phone: '0913456789',
    driverLicense: 'B2-123789456',
    createdAt: '2024-02-25T00:00:00Z'
  },
]

// Authentication functions
export const login = (username: string, password: string): User | null => {
  const user = DEMO_ACCOUNTS.find(
    (account) => 
      (account.username.toLowerCase() === username.toLowerCase() || 
       account.email.toLowerCase() === username.toLowerCase()) &&
      account.password === password
  )
  
  if (user) {
    // Store user session in localStorage
    const session = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      phone: user.phone,
      companyName: user.companyName,
      driverLicense: user.driverLicense,
      loginAt: new Date().toISOString()
    }
    localStorage.setItem('user_session', JSON.stringify(session))
    return user
  }
  
  return null
}

export const logout = (): void => {
  localStorage.removeItem('user_session')
}

export const getCurrentUser = (): Omit<User, 'password'> | null => {
  if (typeof window === 'undefined') return null
  
  const session = localStorage.getItem('user_session')
  if (!session) return null
  
  try {
    return JSON.parse(session)
  } catch {
    return null
  }
}

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null
}

export const hasRole = (role: 'admin' | 'company' | 'driver'): boolean => {
  const user = getCurrentUser()
  return user?.role === role
}

export const isAdmin = (): boolean => hasRole('admin')
export const isCompany = (): boolean => hasRole('company')
export const isDriver = (): boolean => hasRole('driver')

