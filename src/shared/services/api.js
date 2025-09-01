// API configuration and base service
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'

class ApiService {
  constructor() {
    this.baseURL = API_BASE
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    // Add JWT token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, config)
      
      // Handle different response types
      let data = null
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        throw new ApiError(
          data?.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          data?.errorCode || 'HTTP_ERROR',
          data
        )
      }

      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      // Network or other errors
      throw new ApiError(
        'Network error. Please check your connection and try again.',
        0,
        'NETWORK_ERROR'
      )
    }
  }

  // HTTP methods
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }
}

// Custom API Error class
class ApiError extends Error {
  constructor(message, status, errorCode, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errorCode = errorCode
    this.data = data
  }
}

// Export singleton instance
const apiService = new ApiService()
export default apiService
export { ApiError }