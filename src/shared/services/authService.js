import apiService from './api.js'

class AuthService {
  // ========== SIGNUP FLOW ==========
  
  async signup(signupData) {
    const payload = {
      email: signupData.email.trim(),
      phone: this.normalizePhone(signupData.phone.trim()),
      fullName: signupData.fullName.trim(),
      password: signupData.password
    }
    
    const response = await apiService.post('/signup/register', payload)
    return response
  }

  async completeSignup(companyData) {
    const response = await apiService.post('/signup/complete', companyData)
    return response
  }

  async checkEmailExists(email) {
    const response = await apiService.get(`/signup/check-email?email=${encodeURIComponent(email)}`)
    return response
  }

  async checkPhoneExists(phone) {
    const response = await apiService.get(`/signup/check-phone?phone=${encodeURIComponent(phone)}`)
    return response
  }

  

  // ========== LOGIN FLOW ==========
  
  async login(loginData) {
    const payload = {
      email: loginData.email.trim(),
      password: loginData.password,
      recaptchaToken: loginData.recaptchaToken
    }
    
    const response = await apiService.post('/login/authenticate', payload)
    return response // ✅ Fixed: removed .data
  }

  async completeLogin(userId) {
    const response = await apiService.post(`/login/complete?userId=${userId}`)
    
    // Store JWT token if login is successful
    if (response.jwtToken) { // ✅ Fixed: removed .data
      this.setTokens({
        authToken: response.jwtToken,
        refreshToken: response.refreshToken
      })
      localStorage.setItem('user', JSON.stringify({
        userId: response.userId,
        email: response.email,
        fullName: response.fullName
      }))
      
      // Initialize session management
      if (typeof window !== 'undefined') {
        import('./sessionService').then(({ default: sessionService }) => {
          sessionService.initializeSession({
            authToken: response.jwtToken,
            refreshToken: response.refreshToken
          })
        })
      }

      // Dispatch login event for token refresh manager
      window.dispatchEvent(new CustomEvent('auth:login', {
        detail: { 
          userId: response.userId,
          email: response.email,
          fullName: response.fullName
        }
      }))
    }
    
    return response // ✅ Fixed: removed .data
  }

  async resetTemporaryPassword(resetData) {
    const response = await apiService.post('/login/reset-temporary-password', resetData)
    return response // ✅ Fixed: removed .data
  }

  async logout() {
    try {
      await apiService.post('/login/logout')
    } finally {
      // Clear local storage regardless of API response
      this.clearTokens()
      localStorage.removeItem('user')
      
      // Clean up session management
      if (typeof window !== 'undefined') {
        import('./sessionService').then(({ default: sessionService }) => {
          sessionService.cleanup()
        })
      }
    }
  }

  // ========== PASSWORD RESET FLOW ==========
  
  async forgotPassword(email) {
    const response = await apiService.post('/password-reset/initiate', { email })
    return response // ✅ Fixed: removed .data
  }

  async resetPassword(resetData) {
    const response = await apiService.post('/password-reset/complete', resetData)
    return response // ✅ Fixed: removed .data
  }

  // ========== VERIFICATION FLOW ==========
  
  async verifyOTP(verificationData) {
    try {
      const response = await apiService.post('/verification/verify', verificationData)
      return response // ✅ Fixed: removed .data
    } catch (error) {
      // ✅ Enhanced error handling with proper logging
      console.error('OTP Verification failed:', {
        userId: verificationData.userId,
        verificationType: verificationData.verificationType,
        context: verificationData.context,
        error: error.message
      })
      throw error
    }
  }

  async resendVerification(userId, verificationType, context) {
    try {
      console.log('Calling resend verification API:', {
        endpoint: `/verification/resend?userId=${userId}&verificationType=${verificationType}&context=${context}`,
        userId,
        verificationType,
        context
      })
      
      const response = await apiService.post(
        `/verification/resend?userId=${userId}&verificationType=${verificationType}&context=${context}`
      )
      console.log('Resend verification API response:', response)
      return response // ✅ Fixed: removed .data
    } catch (error) {
      console.error('Resend verification failed:', {
        userId,
        verificationType,
        context,
        error: error.message,
        fullError: error
      })
      throw error
    }
  }

  // New method specifically for initiating verification for temporary password users
  async initiateVerification(userId, verificationType, context) {
    try {
      console.log('Calling initiate verification API:', {
        endpoint: `/verification/initiate`,
        userId,
        verificationType,
        context
      })
      
      const response = await apiService.post('/verification/initiate', {
        userId,
        verificationType,
        context
      })
      console.log('Initiate verification API response:', response)
      return response
    } catch (error) {
      console.error('Initiate verification failed:', {
        userId,
        verificationType,
        context,
        error: error.message,
        fullError: error
      })
      throw error
    }
  }

  async changeVerificationType(changeData) {
    const response = await apiService.post('/verification/change-type', changeData)
    return response // ✅ Fixed: removed .data
  }

  // ========== ENHANCED AUTHENTICATION (NEW ENDPOINTS) ==========
  
  /**
   * Check current session status with enhanced profile information
   */
  async getSessionStatus() {
    try {
      const response = await apiService.get('/auth/session-status')
      return response
    } catch (error) {
      console.error('Session status check failed:', error)
      throw error
    }
  }

  /**
   * Extend current user session based on activity
   */
  async extendSession() {
    try {
      const response = await apiService.post('/auth/extend-session')
      return response
    } catch (error) {
      console.error('Session extension failed:', error)
      throw error
    }
  }

  /**
   * Get enhanced user profile with role and profile information
   */
  async getUserProfile() {
    try {
      const response = await apiService.get('/users/profile')
      return response
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      throw error
    }
  }

  // ========== TOKEN MANAGEMENT ==========
  
  setTokens({ authToken, refreshToken }) {
    if (authToken) localStorage.setItem('authToken', authToken)
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
  }

  clearTokens() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
  }

  getAuthToken() {
    return localStorage.getItem('authToken')
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken')
  }

  /**
   * Refresh the access token using the refresh token
   */
  async refreshAccessToken() {
    try {
      const refreshToken = this.getRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await apiService.post('/auth/refresh-token', {
        refreshToken
      })

      // Update tokens with the new ones
      this.setTokens({
        authToken: response.authToken || response.accessToken,
        refreshToken: response.refreshToken
      })

      // Update user data if provided
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user))
      }

      return {
        authToken: response.authToken || response.accessToken,
        refreshToken: response.refreshToken
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      // Clear invalid tokens
      this.clearAllUserData()
      throw error
    }
  }

  /**
   * Check if the current token is expired or about to expire (Updated for 2-hour tokens)
   */
  isTokenExpired(bufferMinutes = 15) { // ✅ UPDATED: Increased buffer from 5 to 15 minutes for 2-hour tokens
    const token = this.getAuthToken()
    if (!token) return true
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      const bufferTime = bufferMinutes * 60 // Convert minutes to seconds
      return payload.exp <= (currentTime + bufferTime)
    } catch (error) {
      console.error('Error parsing token:', error)
      return true
    }
  }

  /**
   * Check if token expires within 5 minutes (Near expiration check)
   */
  isTokenNearExpiration(token = null) {
    const tokenToCheck = token || this.getAuthToken()
    if (!tokenToCheck) return true
    
    try {
      const payload = JSON.parse(atob(tokenToCheck.split('.')[1]))
      const expirationTime = payload.exp * 1000
      const currentTime = Date.now()
      const timeUntilExpiration = expirationTime - currentTime
      const fiveMinutes = 5 * 60 * 1000
      
      return timeUntilExpiration <= fiveMinutes
    } catch (error) {
      console.error('Error parsing token for near expiration check:', error)
      return true
    }
  }

  /**
   * Proactively refresh token if it's about to expire (Enhanced for 2-hour tokens)
   */
  async refreshTokenIfNeeded() {
    // Check if token expires within 20 minutes (more aggressive for 2-hour tokens)
    if (this.isTokenExpired(20)) { // ✅ UPDATED: 20 minutes buffer instead of 5
      try {
        console.log('🔄 Proactively refreshing token (expires within 20 minutes)...')
        await this.refreshAccessToken()
        return true
      } catch (error) {
        console.error('Proactive token refresh failed:', error)
        return false
      }
    }
    return true // Token is still valid
  }

  /**
   * Enhanced API request method with proactive token refresh
   */
  async makeAuthenticatedRequest(url, options = {}) {
    // Proactive refresh check
    await this.refreshTokenIfNeeded()
    
    const authToken = this.getAuthToken()
    if (!authToken) {
      throw new Error('No authentication token available')
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      ...options.headers
    }

    return fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'}${url}`, {
      ...options,
      headers
    })
  }

  // ========== UTILITY METHODS ==========
  
  normalizePhone(raw) {
    const digits = (raw || '').replace(/[^0-9]/g, '')
    if (digits.startsWith('91') && digits.length === 12) return `+${digits}`
    if (digits.length === 10) return `+91${digits}`
    return raw
  }

  maskPhone(phone) {
    const p = (phone || '').replace(/[^0-9]/g, '')
    if (p.length >= 10) {
      const last2 = p.slice(-2)
      return `+91 ${'*'.repeat(8)}${last2}`
    }
    return phone
  }

  maskEmail(email) {
    if (!email || !email.includes('@')) return email
    const [local, domain] = email.split('@')
    const maskedLocal = local.length > 2 
      ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
      : local
    return `${maskedLocal}@${domain}`
  }

  /**
   * Enhanced method to get user data from JWT token with new claims
   */
  getUserFromToken() {
    const token = this.getAuthToken()
    if (!token) return null
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return {
        userId: payload.userId,
        email: payload.email,
        fullName: payload.fullName,
        role: payload.role,
        profile: payload.profile,
        profileId: payload.profileId,
        profileLevel: payload.profileLevel,
        companyId: payload.companyId,
        companyName: payload.companyName,
        redirectTo: payload.redirectTo,
        authorities: payload.authorities || [],
        exp: payload.exp,
        iat: payload.iat
      }
    } catch (error) {
      console.error('Failed to parse JWT token:', error)
      return null
    }
  }

  getCurrentUser() {
    // Try to get enhanced user data from JWT first
    const userFromToken = this.getUserFromToken()
    if (userFromToken) {
      return userFromToken
    }
    
    // Fallback to localStorage for backward compatibility
    try {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    } catch (error) {
      console.error('Failed to parse user data from localStorage:', error)
      return null
    }
  }

  isAuthenticated() {
    const token = this.getAuthToken()
    if (!token) return false
    
    try {
      // ✅ Enhanced: Check if token is expired (basic JWT check)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp > currentTime
    } catch (error) {
      console.error('Invalid token format:', error)
      return false
    }
  }

  // ✅ New method: Clear all user data
  clearAllUserData() {
    this.clearTokens()
    localStorage.removeItem('user')
  }
}

// Export singleton instance
const authService = new AuthService()
export default authService