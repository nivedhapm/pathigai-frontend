import axios from 'axios'

// API configuration and base service
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'

// Helper to get tokens
function getAuthToken() {
  return localStorage.getItem('authToken')
}
function getRefreshToken() {
  return localStorage.getItem('refreshToken')
}
function setTokens({ authToken, refreshToken }) {
  if (authToken) localStorage.setItem('authToken', authToken)
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // ✅ Add timeout
})

// Request interceptor to add JWT
api.interceptors.request.use(
  config => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // ✅ Enhanced logging for debugging
    console.debug('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      hasAuth: !!token,
      data: config.data
    })
    
    return config
  },
  error => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for refresh token logic and error formatting
let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  response => {
    // ✅ Enhanced response logging
    console.debug('API Response:', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      data: response.data
    })
    return response
  },
  async error => {
    const originalRequest = error.config

    // ✅ Enhanced error logging
    console.error('API Error:', {
      method: originalRequest?.method?.toUpperCase(),
      url: originalRequest?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    })

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        isNetworkError: true,
        originalError: error
      })
    }

    // Handle 401 Unauthorized (token expired)
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken() &&
      originalRequest.url !== '/auth/refresh-token' // ✅ Prevent infinite refresh loop
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = 'Bearer ' + token
            return api(originalRequest)
          })
          .catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const res = await api.post('/auth/refresh-token', {
          refreshToken: getRefreshToken()
        })
        const { authToken, refreshToken } = res.data
        setTokens({ authToken, refreshToken })
        api.defaults.headers.Authorization = 'Bearer ' + authToken
        processQueue(null, authToken)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        // ✅ Clear tokens and redirect to login
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        
        // ✅ Optional: Trigger a custom event for app-wide logout handling
        window.dispatchEvent(new CustomEvent('auth:logout', {
          detail: { reason: 'token_refresh_failed' }
        }))
        
        return Promise.reject({
          message: 'Session expired. Please log in again.',
          isAuthError: true,
          originalError: refreshError
        })
      } finally {
        isRefreshing = false
      }
    }

    // Handle 403 Forbidden
    if (error.response.status === 403) {
      return Promise.reject({
        message: 'Access denied. You do not have permission to perform this action.',
        status: 403,
        isForbidden: true,
        data: error.response.data
      })
    }

    // Handle 422 Unprocessable Entity (validation errors)
    if (error.response.status === 422 && error.response.data && error.response.data.errors) {
      return Promise.reject({
        message: error.response.data.message || 'Validation failed',
        fieldErrors: error.response.data.errors,
        isValidationError: true,
        status: 422
      })
    }

    // Handle 400 Bad Request (field-level validation errors)
    if (error.response.status === 400 && error.response.data && error.response.data.errors) {
      return Promise.reject({
        message: error.response.data.message || 'Invalid request data',
        fieldErrors: error.response.data.errors,
        isValidationError: true,
        status: 400
      })
    }

    // Handle 404 Not Found
    if (error.response.status === 404) {
      return Promise.reject({
        message: 'The requested resource was not found.',
        status: 404,
        isNotFound: true,
        data: error.response.data
      })
    }

    // Handle 500 Internal Server Error
    if (error.response.status === 500) {
      return Promise.reject({
        message: 'Internal server error. Please try again later.',
        status: 500,
        isServerError: true,
        data: error.response.data
      })
    }

    // Handle 503 Service Unavailable
    if (error.response.status === 503) {
      return Promise.reject({
        message: 'Service temporarily unavailable. Please try again later.',
        status: 503,
        isServiceUnavailable: true,
        data: error.response.data
      })
    }

    // ✅ Generic error handling with better structure
    const errorResponse = {
      message: error.response.data?.message || 
               `HTTP ${error.response.status}: ${error.response.statusText}` ||
               'An unexpected error occurred',
      status: error.response.status,
      data: error.response.data,
      originalError: error,
      // ✅ Add response body for debugging
      responseBody: error.response.data
    }

    return Promise.reject(errorResponse)
  }
)

// ✅ Enhanced API methods with better error handling
const apiService = {
  get: async (endpoint, config = {}) => {
    try {
      const response = await api.get(endpoint, config)
      return response.data
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error)
      throw error
    }
  },
  
  post: async (endpoint, data, config = {}) => {
    try {
      const response = await api.post(endpoint, data, config)
      return response.data
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error)
      throw error
    }
  },
  
  put: async (endpoint, data, config = {}) => {
    try {
      const response = await api.put(endpoint, data, config)
      return response.data
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error)
      throw error
    }
  },
  
  delete: async (endpoint, config = {}) => {
    try {
      const response = await api.delete(endpoint, config)
      return response.data
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error)
      throw error
    }
  },

  // ✅ New utility methods
  getBaseUrl: () => API_BASE,
  
  // ✅ Method to check API health
  checkHealth: async () => {
    try {
      const response = await api.get('/health', { timeout: 5000 })
      return response.data
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  }
}

export default apiService