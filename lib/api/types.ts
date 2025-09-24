// API Types for SQL Server integration

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// Company API Types
export interface CompanyApiParams extends ApiParams {
  status?: 'active' | 'pending' | 'suspended';
  membershipType?: string;
  cityId?: number;
  verified?: boolean;
}

export interface CreateCompanyData {
  name: string;
  contact_person: string;
  designation?: string;
  address_line: string;
  city_id: number;
  phone: string;
  telephone?: string;
  fax_number?: string;
  email: string;
  website?: string;
  description?: string;
  social_media?: Record<string, string>;
  business_hours?: Record<string, string>;
}

export interface UpdateCompanyData extends Partial<CreateCompanyData> {
  company_id: number;
}

// Driver API Types
export interface DriverApiParams extends ApiParams {
  status?: 'active' | 'pending' | 'suspended';
  cityId?: number;
  available?: boolean;
  experienceYears?: number;
  rating?: number;
}

export interface CreateDriverData {
  name: string;
  address_line: string;
  city_id: number;
  phone: string;
  telephone?: string;
  email: string;
  experience_years: number;
  license_number: string;
  license_type: string;
  license_expiry: string;
  vehicle_type: string;
  vehicle_model: string;
  vehicle_plate: string;
  languages?: string[];
  specialties?: string[];
}

export interface UpdateDriverData extends Partial<CreateDriverData> {
  driver_id: number;
}

// Advertisement API Types
export interface AdApiParams extends ApiParams {
  status?: 'draft' | 'pending' | 'active' | 'paused' | 'expired';
  companyId?: number;
  type?: string;
  placement?: string;
}

export interface CreateAdData {
  company_id: number;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  budget?: number;
  placement?: string;
  target_audience?: Record<string, any>;
  creative_assets?: Record<string, any>;
}

export interface UpdateAdData extends Partial<CreateAdData> {
  ad_id: number;
}

// Lead API Types
export interface LeadApiParams extends ApiParams {
  status?: 'new' | 'contacted' | 'quoted' | 'confirmed' | 'completed' | 'cancelled';
  companyId?: number;
  driverId?: number;
  priority?: 'low' | 'medium' | 'high';
  source?: string;
}

export interface CreateLeadData {
  company_id?: number;
  driver_id?: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  service_type: string;
  pickup_location?: string;
  destination?: string;
  pickup_time?: string;
  estimated_fare?: number;
  notes?: string;
  source?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UpdateLeadData extends Partial<CreateLeadData> {
  lead_id: number;
}

// Subscription API Types
export interface SubscriptionApiParams extends ApiParams {
  status?: 'active' | 'pending' | 'suspended' | 'cancelled' | 'expired';
  planId?: number;
  companyId?: number;
  driverId?: number;
}

export interface CreateSubscriptionData {
  plan_id: number;
  start_date: string;
  end_date: string;
  auto_renew?: boolean;
  billing_interval?: number;
  price?: number;
  currency?: string;
}

export interface UpdateSubscriptionData extends Partial<CreateSubscriptionData> {
  subscription_id: number;
}

// Payment API Types
export interface PaymentApiParams extends ApiParams {
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  subscriptionId?: number;
  methodId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreatePaymentData {
  subscription_id: number;
  amount: number;
  currency: string;
  method_id: number;
  ref_id: string;
  gateway_response?: Record<string, any>;
}

export interface UpdatePaymentData extends Partial<CreatePaymentData> {
  payment_id: number;
}

// Review API Types
export interface ReviewApiParams extends ApiParams {
  revieweeType?: 'company' | 'driver';
  revieweeId?: number;
  reviewerId?: number;
  rating?: number;
  verified?: boolean;
}

export interface CreateReviewData {
  reviewer_id: number;
  reviewee_id: number;
  reviewee_type: 'company' | 'driver';
  rating: number;
  title?: string;
  comment?: string;
}

export interface UpdateReviewData extends Partial<CreateReviewData> {
  review_id: number;
}

// Dashboard API Types
export interface DashboardStats {
  totalCompanies: number;
  totalDrivers: number;
  totalAds: number;
  totalRevenue: number;
  activeSubscriptions: number;
  pendingApprovals: number;
  monthlyGrowth: {
    companies: number;
    drivers: number;
    ads: number;
    revenue: number;
  };
}

export interface CompanyDashboardStats {
  profileViews: number;
  totalLeads: number;
  newLeads: number;
  totalReviews: number;
  averageRating: number;
  monthlyLeads: number;
  conversionRate: number;
}

export interface DriverDashboardStats {
  profileViews: number;
  totalApplications: number;
  newApplications: number;
  totalReviews: number;
  averageRating: number;
  totalRides: number;
  monthlyRides: number;
  acceptanceRate: number;
}

// Lookup Data Types
export interface LookupData {
  cities: Array<{ city_id: number; name: string; state_id: number }>;
  states: Array<{ state_id: number; name: string; country_id: number }>;
  countries: Array<{ country_id: number; name: string; code: string }>;
  membershipTypes: Array<{ membership_type_id: number; code: string }>;
  subscriptionStatuses: Array<{ status_id: number; code: string }>;
  paymentStatuses: Array<{ status_id: number; code: string }>;
  paymentMethods: Array<{ method_id: number; code: string }>;
  adStatuses: Array<{ status_id: number; code: string }>;
  adTypes: Array<{ ad_type_id: number; code: string; name: string }>;
  adPlacements: Array<{ placement_id: number; code: string; name: string }>;
  plans: Array<{ plan_id: number; name: string; price: number; billing_cycle_id: number }>;
  billingCycles: Array<{ billing_cycle_id: number; code: string; name: string }>;
  roles: Array<{ role_id: number; role_code: string }>;
}

// Authentication Types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  role_id: number;
}

export interface AuthResponse {
  user: {
    user_id: number;
    email: string;
    full_name: string;
    phone: string;
    role_id: number;
    role_code: string;
  };
  token: string;
  refreshToken: string;
}

// File Upload Types
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

// Search Types
export interface SearchParams {
  query: string;
  type?: 'company' | 'driver' | 'ad' | 'lead';
  filters?: Record<string, any>;
  page?: number;
  limit?: number;
}

export interface SearchResult<T> {
  results: T[];
  total: number;
  page: number;
  limit: number;
  query: string;
  filters: Record<string, any>;
}
