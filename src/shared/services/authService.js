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
      const response = await apiService.post(
        `/verification/resend?userId=${userId}&verificationType=${verificationType}&context=${context}`
      )
      return response // ✅ Fixed: removed .data
    } catch (error) {
      console.error('Resend verification failed:', {
        userId,
        verificationType,
        context,
        error: error.message
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