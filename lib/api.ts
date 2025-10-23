// API service for connecting to RadioCabs backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresAt: string
  account: {
    accountId: number
    companyId?: number
    username: string
    fullName: string
    phone?: string
    email?: string
    role: 'ADMIN' | 'MANAGER' | 'ACCOUNTANT' | 'DISPATCHER' | 'DRIVER' | 'CUSTOMER'
    status: 'ACTIVE' | 'INACTIVE'
    createdAt: string
    updatedAt?: string
    emailVerifiedAt?: string
    company?: {
      companyId: number
      name: string
      hotline: string
      email: string
      address: string
      taxCode: string
      status: 'ACTIVE' | 'INACTIVE'
    }
  }
}

class ApiService {
  private baseUrl: string
  private accessToken: string | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    this.loadTokenFromStorage()
  }

  private loadTokenFromStorage() {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('user_session')
      if (session) {
        try {
          const userSession = JSON.parse(session)
          this.accessToken = userSession.accessToken
        } catch (error) {
          console.error('Error parsing user session:', error)
        }
      }
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/accounts/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      })

      const result = await this.handleResponse<LoginResponse>(response)
      
      // Store tokens and user info
      this.accessToken = result.accessToken
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_session', JSON.stringify({
          ...result.account,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          expiresAt: result.expiresAt,
          loginAt: new Date().toISOString()
        }))
      }

      return result
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async logout(): Promise<void> {
    this.accessToken = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_session')
    }
  }

  async refreshToken(): Promise<LoginResponse> {
    if (typeof window === 'undefined') {
      throw new Error('Cannot refresh token on server side')
    }

    const session = localStorage.getItem('user_session')
    if (!session) {
      throw new Error('No session found')
    }

    try {
      const userSession = JSON.parse(session)
      const response = await fetch(`${this.baseUrl}/accounts/refresh`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ refreshToken: userSession.refreshToken }),
      })

      const result = await this.handleResponse<LoginResponse>(response)
      
      // Update stored tokens
      this.accessToken = result.accessToken
      localStorage.setItem('user_session', JSON.stringify({
        ...result.account,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresAt: result.expiresAt,
        loginAt: new Date().toISOString()
      }))

      return result
    } catch (error) {
      console.error('Token refresh error:', error)
      // If refresh fails, clear session
      this.logout()
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })

    return await this.handleResponse<T>(response)
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })

    return await this.handleResponse<T>(response)
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })

    return await this.handleResponse<T>(response)
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })

    return await this.handleResponse<T>(response)
  }

  isAuthenticated(): boolean {
    return this.accessToken !== null
  }

  getCurrentUser() {
    if (typeof window === 'undefined') return null

    const session = localStorage.getItem('user_session')
    if (!session) return null

    try {
      return JSON.parse(session)
    } catch (error) {
      console.error('Error parsing user session:', error)
      return null
    }
  }
}

// Export singleton instance
export const apiService = new ApiService()
export default apiService
