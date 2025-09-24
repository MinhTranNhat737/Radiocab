// API Client for SQL Server integration

import type {
  ApiResponse,
  PaginatedResponse,
  ApiParams,
  CompanyApiParams,
  CreateCompanyData,
  UpdateCompanyData,
  DriverApiParams,
  CreateDriverData,
  UpdateDriverData,
  AdApiParams,
  CreateAdData,
  UpdateAdData,
  LeadApiParams,
  CreateLeadData,
  UpdateLeadData,
  SubscriptionApiParams,
  CreateSubscriptionData,
  UpdateSubscriptionData,
  PaymentApiParams,
  CreatePaymentData,
  UpdatePaymentData,
  ReviewApiParams,
  CreateReviewData,
  UpdateReviewData,
  DashboardStats,
  CompanyDashboardStats,
  DriverDashboardStats,
  LookupData,
  LoginData,
  RegisterData,
  AuthResponse,
  FileUploadResponse,
  SearchParams,
  SearchResult
} from './types'

// Import database types
import type {
  Company,
  Driver,
  Advertisement,
  Lead,
  Subscription,
  Payment,
  User
} from '../types/database'

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
const API_VERSION = 'v1'

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = `${API_BASE_URL}/${API_VERSION}`
    
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Authentication
  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (response.success && response.data) {
      this.setToken(response.data.token)
    }

    return response
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (response.success && response.data) {
      this.setToken(response.data.token)
    }

    return response
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.request<void>('/auth/logout', {
      method: 'POST',
    })
    
    this.clearToken()
    return response
  }

  // Companies
  async getCompanies(params?: CompanyApiParams): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    return this.request<PaginatedResponse<any>>(`/companies?${queryParams}`)
  }

  async getCompany(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/companies/${id}`)
  }

  async createCompany(data: CreateCompanyData): Promise<ApiResponse<any>> {
    return this.request<any>('/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCompany(data: UpdateCompanyData): Promise<ApiResponse<any>> {
    return this.request<any>(`/companies/${data.company_id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteCompany(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/companies/${id}`, {
      method: 'DELETE',
    })
  }

  async getCompanyDashboard(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/companies/${id}/dashboard`)
  }

  async getCompanyStats(id: number): Promise<ApiResponse<CompanyDashboardStats>> {
    return this.request<CompanyDashboardStats>(`/companies/${id}/stats`)
  }

  // Drivers
  async getDrivers(params?: DriverApiParams): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    return this.request<PaginatedResponse<any>>(`/drivers?${queryParams}`)
  }

  async getDriver(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/drivers/${id}`)
  }

  async createDriver(data: CreateDriverData): Promise<ApiResponse<any>> {
    return this.request<any>('/drivers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateDriver(data: UpdateDriverData): Promise<ApiResponse<any>> {
    return this.request<any>(`/drivers/${data.driver_id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteDriver(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/drivers/${id}`, {
      method: 'DELETE',
    })
  }

  async getDriverDashboard(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/drivers/${id}/dashboard`)
  }

  async getDriverStats(id: number): Promise<ApiResponse<DriverDashboardStats>> {
    return this.request<DriverDashboardStats>(`/drivers/${id}/stats`)
  }

  // Advertisements
  async getAdvertisements(params?: AdApiParams): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    return this.request<PaginatedResponse<any>>(`/advertisements?${queryParams}`)
  }

  async getAdvertisement(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/advertisements/${id}`)
  }

  async createAdvertisement(data: CreateAdData): Promise<ApiResponse<any>> {
    return this.request<any>('/advertisements', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateAdvertisement(data: UpdateAdData): Promise<ApiResponse<any>> {
    return this.request<any>(`/advertisements/${data.ad_id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteAdvertisement(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/advertisements/${id}`, {
      method: 'DELETE',
    })
  }

  // Leads
  async getLeads(params?: LeadApiParams): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    return this.request<PaginatedResponse<any>>(`/leads?${queryParams}`)
  }

  async getLead(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/leads/${id}`)
  }

  async createLead(data: CreateLeadData): Promise<ApiResponse<any>> {
    return this.request<any>('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateLead(data: UpdateLeadData): Promise<ApiResponse<any>> {
    return this.request<any>(`/leads/${data.lead_id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteLead(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/leads/${id}`, {
      method: 'DELETE',
    })
  }

  // Subscriptions
  async getSubscriptions(params?: SubscriptionApiParams): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    return this.request<PaginatedResponse<any>>(`/subscriptions?${queryParams}`)
  }

  async getSubscription(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/subscriptions/${id}`)
  }

  async createSubscription(data: CreateSubscriptionData): Promise<ApiResponse<any>> {
    return this.request<any>('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateSubscription(data: UpdateSubscriptionData): Promise<ApiResponse<any>> {
    return this.request<any>(`/subscriptions/${data.subscription_id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async cancelSubscription(id: number, reason?: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/subscriptions/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  }

  // Payments
  async getPayments(params?: PaymentApiParams): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    return this.request<PaginatedResponse<any>>(`/payments?${queryParams}`)
  }

  async getPayment(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/payments/${id}`)
  }

  async createPayment(data: CreatePaymentData): Promise<ApiResponse<any>> {
    return this.request<any>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updatePayment(data: UpdatePaymentData): Promise<ApiResponse<any>> {
    return this.request<any>(`/payments/${data.payment_id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async refundPayment(id: number, amount?: number, reason?: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/payments/${id}/refund`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason }),
    })
  }

  // Reviews
  async getReviews(params?: ReviewApiParams): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    return this.request<PaginatedResponse<any>>(`/reviews?${queryParams}`)
  }

  async getReview(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/reviews/${id}`)
  }

  async createReview(data: CreateReviewData): Promise<ApiResponse<any>> {
    return this.request<any>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateReview(data: UpdateReviewData): Promise<ApiResponse<any>> {
    return this.request<any>(`/reviews/${data.review_id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteReview(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/reviews/${id}`, {
      method: 'DELETE',
    })
  }

  // Dashboard
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>('/dashboard/stats')
  }

  // Lookup Data
  async getLookupData(): Promise<ApiResponse<LookupData>> {
    return this.request<LookupData>('/lookup')
  }

  // File Upload
  async uploadFile(file: File, type: 'logo' | 'avatar' | 'ad_creative'): Promise<ApiResponse<FileUploadResponse>> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    return this.request<FileUploadResponse>('/upload', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let browser set it
      },
      body: formData,
    })
  }

  // Search
  async search(params: SearchParams): Promise<ApiResponse<SearchResult<any>>> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })
    
    return this.request<SearchResult<any>>(`/search?${queryParams}`)
  }

  // Admin specific endpoints
  async approveCompany(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/companies/${id}/approve`, {
      method: 'POST',
    })
  }

  async rejectCompany(id: number, reason: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/companies/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  }

  async approveDriver(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/drivers/${id}/approve`, {
      method: 'POST',
    })
  }

  async rejectDriver(id: number, reason: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/drivers/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  }

  async approveAdvertisement(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/advertisements/${id}/approve`, {
      method: 'POST',
    })
  }

  async rejectAdvertisement(id: number, reason: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/advertisements/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Export individual methods for convenience
export const {
  // Auth
  login,
  register,
  logout,
  // Companies
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyDashboard,
  getCompanyStats,
  // Drivers
  getDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
  getDriverDashboard,
  getDriverStats,
  // Advertisements
  getAdvertisements,
  getAdvertisement,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  // Leads
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  // Subscriptions
  getSubscriptions,
  getSubscription,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  // Payments
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  refundPayment,
  // Reviews
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  // Dashboard
  getDashboardStats,
  // Lookup
  getLookupData,
  // File Upload
  uploadFile,
  // Search
  search,
  // Admin
  approveCompany,
  rejectCompany,
  approveDriver,
  rejectDriver,
  approveAdvertisement,
  rejectAdvertisement,
} = apiClient
