// Database types based on SQL Server schema
export interface Role {
  role_id: number
  role_code: string
  role_name: string
}

export interface MembershipType {
  membership_type_id: number
  code: string
  name: string
}

export interface BillingCycle {
  billing_cycle_id: number
  code: string
  name: string
  months: number
}

export interface ItemType {
  item_type_id: number
  code: string
  name: string
}

export interface SubscriptionStatus {
  status_id: number
  code: string
  name: string
}

export interface PaymentMethod {
  method_id: number
  code: string
  name: string
}

export interface PaymentStatus {
  status_id: number
  code: string
  name: string
}

export interface AdStatus {
  status_id: number
  code: string
  name: string
}

export interface FeedbackType {
  feedback_type_id: number
  code: string
  name: string
}

export interface Country {
  country_id: number
  iso_code: string
  name: string
}

export interface State {
  state_id: number
  country_id: number
  code: string
  name: string
}

export interface City {
  city_id: number
  state_id: number
  name: string
}

export interface User {
  user_id: number
  email: string
  password_hash: string
  full_name: string
  phone?: string
  role_id: number
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface AuthSession {
  session_id: string
  user_id: number
  ip_address?: Buffer
  user_agent?: string
  issued_at: Date
  expires_at: Date
}

export interface Company {
  company_id: number
  company_code: string
  name: string
  contact_person?: string
  designation?: string
  address_line?: string
  city_id?: number
  mobile?: string
  telephone?: string
  fax_number?: string
  email?: string
  membership_type_id: number
  owner_user_id?: number
  status: 'draft' | 'pending' | 'active' | 'suspended' | 'deleted'
  created_at: Date
  updated_at: Date
}

export interface Driver {
  driver_id: number
  driver_code: string
  name: string
  contact_person?: string
  address_line?: string
  city_id?: number
  mobile?: string
  telephone?: string
  email?: string
  experience_years: number
  description?: string
  owner_user_id?: number
  status: 'draft' | 'pending' | 'active' | 'suspended' | 'deleted'
  created_at: Date
  updated_at: Date
}

export interface Advertisement {
  ad_id: number
  company_id: number
  title: string
  description?: string
  status_id: number
  start_date?: Date
  end_date?: Date
  created_at: Date
  updated_at: Date
}

export interface CompanyDriverLink {
  link_id: number
  company_id: number
  driver_id: number
  role_title?: string
  started_on: Date
  ended_on?: Date
}

export interface Plan {
  plan_id: number
  item_type_id: number
  billing_cycle_id: number
  name: string
  price: number
  currency: string
  is_active: boolean
}

export interface Subscription {
  subscription_id: number
  plan_id: number
  status_id: number
  start_date: Date
  end_date: Date
  created_at: Date
  updated_at: Date
}

export interface CompanySubscription {
  subscription_id: number
  company_id: number
}

export interface DriverSubscription {
  subscription_id: number
  driver_id: number
}

export interface AdSubscription {
  subscription_id: number
  ad_id: number
}

export interface Payment {
  payment_id: number
  subscription_id: number
  amount: number
  currency: string
  method_id: number
  status_id: number
  txn_ref?: string
  paid_at?: Date
  created_at: Date
}

// Extended types for dashboard views
export interface ActiveCompany {
  company_id: number
  company_code: string
  name: string
  city_id?: number
  membership_type_id: number
  status: string
  first_active_since: Date
  active_until: Date
}

export interface ActiveDriver {
  driver_id: number
  driver_code: string
  name: string
  city_id?: number
  status: string
  first_active_since: Date
  active_until: Date
}

export interface ActiveAd {
  ad_id: number
  company_id: number
  title: string
  status_id: number
  start_date?: Date
  end_date?: Date
}

// Dashboard specific types
export interface DashboardStats {
  totalCompanies: number
  totalDrivers: number
  totalAds: number
  totalRevenue: number
  activeSubscriptions: number
  pendingPayments: number
}

export interface CompanyDashboardData {
  company: Company
  stats: {
    profileViews: number
    totalLeads: number
    totalReviews: number
    averageRating: number
  }
  subscription: {
    plan: string
    nextPayment: string
    amount: string
    status: string
  }
  recentActivity: Array<{
    id: number
    type: string
    title: string
    description: string
    time: string
    status: string
  }>
}

export interface DriverDashboardData {
  driver: Driver
  stats: {
    profileViews: number
    totalApplications: number
    totalReviews: number
    averageRating: number
    totalRides: number
  }
  subscription: {
    plan: string
    nextPayment: string
    amount: string
    status: string
  }
  recentActivity: Array<{
    id: number
    type: string
    title: string
    description: string
    time: string
    status: string
  }>
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Form types for creating/updating entities
export interface CreateCompanyData {
  company_code: string
  name: string
  contact_person?: string
  designation?: string
  address_line?: string
  city_id?: number
  mobile?: string
  telephone?: string
  fax_number?: string
  email?: string
  membership_type_id: number
  owner_user_id?: number
}

export interface UpdateCompanyData extends Partial<CreateCompanyData> {
  company_id: number
}

export interface CreateDriverData {
  driver_code: string
  name: string
  contact_person?: string
  address_line?: string
  city_id?: number
  mobile?: string
  telephone?: string
  email?: string
  experience_years: number
  description?: string
  owner_user_id?: number
}

export interface UpdateDriverData extends Partial<CreateDriverData> {
  driver_id: number
}

export interface CreateAdvertisementData {
  company_id: number
  title: string
  description?: string
  status_id: number
  start_date?: Date
  end_date?: Date
}

export interface UpdateAdvertisementData extends Partial<CreateAdvertisementData> {
  ad_id: number
}

export interface CreateSubscriptionData {
  plan_id: number
  status_id: number
  start_date: Date
  end_date: Date
}

export interface CreatePaymentData {
  subscription_id: number
  amount: number
  currency: string
  method_id: number
  status_id: number
  txn_ref?: string
  paid_at?: Date
}