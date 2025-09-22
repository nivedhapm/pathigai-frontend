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
    // If backend returns tokens on signup completion, persist them to keep user signed in
    if (response && response.jwtToken) {
      this.setTokens({
        authToken: response.jwtToken,
        refreshToken: response.refreshToken
      })
      // Optionally persist basic user info if provided
      try {
        const userInfo = {
          userId: response.userId,
          email: response.email,
          fullName: response.fullName
        }
        // Only set when at least one field exists
        if (Object.values(userInfo).some(Boolean)) {
          localStorage.setItem('user', JSON.stringify(userInfo))
        }
      } catch (_) {
        // no-op if storage fails
      }
    }
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
    
    console.log('🔑 Login API call:', {
      endpoint: '/login/authenticate',
      email: payload.email,
      hasPassword: !!payload.password,
      hasRecaptcha: !!payload.recaptchaToken
    })
    
    const response = await apiService.post('/login/authenticate', payload)
    
    console.log('🔑 Login API response:', response)
    
    return response
  }

  async completeLogin(userId) {
    console.log('🔑 completeLogin called with userId:', userId)
    
    try {
      const response = await apiService.post(`/login/complete?userId=${userId}`)
      
      console.log('🔑 Complete login API response:', response) // Debug log
      
      // Store JWT token if login is successful
      if (response.jwtToken || response.authToken) { // ✅ Check both possible token names
        const authToken = response.jwtToken || response.authToken
        console.log('🔑 Tokens found in response, storing:', { // Debug log
          authToken: authToken ? `${authToken.substring(0, 30)}...` : 'missing',
          refreshToken: response.refreshToken ? `${response.refreshToken.substring(0, 30)}...` : 'missing'
        })
        
        this.setTokens({
          authToken: authToken,
          refreshToken: response.refreshToken
        })
        
        // Verify tokens were stored
        const storedAuth = this.getAuthToken()
        const storedRefresh = this.getRefreshToken()
        console.log('🔑 Verification after storage:', {
          authTokenStored: !!storedAuth,
          refreshTokenStored: !!storedRefresh,
          authTokenLength: storedAuth ? storedAuth.length : 0,
          refreshTokenLength: storedRefresh ? storedRefresh.length : 0
        })
        
        // Store user info
        if (response.userId || response.email || response.fullName) {
          const userInfo = {
            userId: response.userId,
            email: response.email,
            fullName: response.fullName,
            profile: response.profile // Add profile to user info
          }
          console.log('🔑 Storing user info:', userInfo) // Debug log
          localStorage.setItem('user', JSON.stringify(userInfo))
        }
      } else {
        console.error('🔑 ❌ No tokens received from login API. Response keys:', Object.keys(response)) // Debug log
        console.error('🔑 ❌ Full response:', response)
      }
      
      return response
    } catch (error) {
      console.error('🔑 ❌ completeLogin API call failed:', error)
      throw error
    }
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

  // ========== TOKEN MANAGEMENT ==========
  
  setTokens({ authToken, refreshToken }) {
    console.log('🔑 setTokens called with:', { // Debug log
      authToken: authToken ? `${authToken.substring(0, 20)}...` : 'null',
      refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null'
    })
    
    try {
      if (authToken) {
        localStorage.setItem('authToken', authToken)
        console.log('🔑 ✅ Auth token stored in localStorage')
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
        console.log('🔑 ✅ Refresh token stored in localStorage')
      }
      
      // Verify storage worked
      const storedAuth = localStorage.getItem('authToken')
      const storedRefresh = localStorage.getItem('refreshToken')
      console.log('🔑 Token storage verification:', {
        authTokenStored: !!storedAuth,
        refreshTokenStored: !!storedRefresh,
        authTokenMatches: storedAuth === authToken,
        refreshTokenMatches: storedRefresh === refreshToken
      })
    } catch (error) {
      console.error('🔑 ❌ Error storing tokens:', error)
      throw error
    }
  }

  clearTokens() {
    console.log('clearTokens() called - removing auth and refresh tokens')
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
  }

  getAuthToken() {
    return localStorage.getItem('authToken')
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken')
  }

  // ✅ New method: Manual token refresh for activity-based session management
  async refreshToken() {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await apiService.post('/auth/refresh-token', {
        refreshToken: refreshToken
      })
      
      this.setTokens({
        authToken: response.jwtToken || response.authToken,
        refreshToken: response.refreshToken
      })
      
      console.log('Token refreshed successfully')
      return response
    } catch (error) {
      console.error('Token refresh failed:', error)
      
      // Only clear tokens for certain error types, not 403 (which is expected when refresh token is invalid)
      // Let the API interceptor handle session expiration properly
      if (error.response?.status === 401 || error.response?.status === 400) {
        console.log('Clearing tokens due to authentication error:', error.response?.status)
        this.clearAllUserData()
      } else {
        console.log('Not clearing tokens for error status:', error.response?.status, '- letting API interceptor handle it')
      }
      
      throw error
    }
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

  getCurrentUser() {
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
    const refreshToken = this.getRefreshToken()
    
    // No token at all means not authenticated
    if (!token) {
      console.debug('No auth token found')
      return false
    }
    
    try {
      // Parse JWT payload to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      
      // Add a 5-minute buffer to account for clock skew and network delays
      const expirationBuffer = 5 * 60 // 5 minutes in seconds
      const isExpired = payload.exp <= (currentTime + expirationBuffer)
      
      console.debug('Token validation:', {
        expires: new Date(payload.exp * 1000).toISOString(),
        currentTime: new Date(currentTime * 1000).toISOString(),
        isExpired,
        hasRefreshToken: !!refreshToken
      })
      
      // If token is expired but we have a refresh token, consider user authenticated
      // The API interceptor will handle token refresh automatically
      if (isExpired && refreshToken) {
        console.debug('Token expired but refresh token available')
        return true
      }
      
      // Token is valid and not expired
      return !isExpired
    } catch (error) {
      console.error('Invalid token format or parsing error:', error)
      // If we have a refresh token, try to use it even if main token is malformed
      if (refreshToken) {
        console.debug('Main token invalid but refresh token available')
        return true
      }
      return false
    }
  }

  // ✅ New method: Clear all user data
  clearAllUserData() {
    console.log('clearAllUserData() called - clearing all authentication data')
    this.clearTokens()
    localStorage.removeItem('user')
  }

  // ✅ New method: Initialize authentication state on app startup
  async initializeAuth() {
    const token = this.getAuthToken()
    const refreshToken = this.getRefreshToken()
    
    console.debug('Initializing auth state:', {
      hasToken: !!token,
      hasRefreshToken: !!refreshToken
    })
    
    // If no tokens, user is not authenticated
    if (!token && !refreshToken) {
      console.debug('No tokens found, user not authenticated')
      return false
    }
    
    // If we have tokens, try to validate them
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const currentTime = Date.now() / 1000
        const isExpired = payload.exp <= currentTime
        
        console.debug('Token validation on init:', {
          expires: new Date(payload.exp * 1000).toISOString(),
          isExpired
        })
        
        // If token is not expired, user is authenticated
        if (!isExpired) {
          console.debug('Valid token found, user authenticated')
          return true
        }
      } catch (error) {
        console.warn('Token parsing failed during init:', error)
      }
    }
    
    // If main token is expired/invalid but we have refresh token, try to refresh
    if (refreshToken) {
      try {
        console.debug('Attempting token refresh on app init')
        await this.refreshToken()
        console.debug('Token refresh successful, user authenticated')
        return true
      } catch (error) {
        console.warn('Token refresh failed during init:', error)
        this.clearAllUserData()
        return false
      }
    }
    
    // No valid authentication found
    console.debug('No valid authentication found')
    this.clearAllUserData()
    return false
  }

  // ✅ New method: Check if user has valid session without network call
  hasValidSession() {
    const token = this.getAuthToken()
    const refreshToken = this.getRefreshToken()
    
    // Must have at least one token
    if (!token && !refreshToken) return false
    
    // If we have a refresh token, assume session is valid
    // (API interceptor will handle refresh if needed)
    if (refreshToken) return true
    
    // Check if main token is valid
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const currentTime = Date.now() / 1000
        return payload.exp > currentTime
      } catch (error) {
        return false
      }
    }
    
    return false
  }
}

// Export singleton instance
const authService = new AuthService()
export default authService