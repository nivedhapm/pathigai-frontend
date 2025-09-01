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
    return response.data
  }

  async completeSignup(companyData) {
    const response = await apiService.post('/signup/complete', companyData)
    return response.data
  }

  async checkEmailExists(email) {
    const response = await apiService.get(`/signup/check-email?email=${encodeURIComponent(email)}`)
    return response.data
  }

  async checkPhoneExists(phone) {
    const response = await apiService.get(`/signup/check-phone?phone=${encodeURIComponent(phone)}`)
    return response.data
  }

  // ========== LOGIN FLOW ==========
  
  async login(loginData) {
    const payload = {
      email: loginData.email.trim(),
      password: loginData.password,
      recaptchaToken: loginData.recaptchaToken
    }
    
    const response = await apiService.post('/login/authenticate', payload)
    return response.data
  }

  async completeLogin(userId) {
    const response = await apiService.post(`/login/complete?userId=${userId}`)
    
    // Store JWT token if login is successful
    if (response.data.jwtToken) {
      localStorage.setItem('authToken', response.data.jwtToken)
      localStorage.setItem('user', JSON.stringify({
        userId: response.data.userId,
        email: response.data.email,
        fullName: response.data.fullName
      }))
    }
    
    return response.data
  }

  async resetTemporaryPassword(resetData) {
    const response = await apiService.post('/login/reset-temporary-password', resetData)
    return response.data
  }

  async logout() {
    try {
      await apiService.post('/login/logout')
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
  }

  // ========== PASSWORD RESET FLOW ==========
  
  async forgotPassword(email) {
    const response = await apiService.post('/password-reset/initiate', { email })
    return response.data
  }

  async resetPassword(resetData) {
    const response = await apiService.post('/password-reset/complete', resetData)
    return response.data
  }

  // ========== VERIFICATION FLOW ==========
  
  async verifyOTP(verificationData) {
    const response = await apiService.post('/verification/verify', verificationData)
    return response.data
  }

  async resendVerification(userId, verificationType, context) {
    const response = await apiService.post(
      `/verification/resend?userId=${userId}&verificationType=${verificationType}&context=${context}`
    )
    return response.data
  }

  async changeVerificationType(changeData) {
    const response = await apiService.post('/verification/change-type', changeData)
    return response.data
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
    } catch {
      return null
    }
  }

  getAuthToken() {
    return localStorage.getItem('authToken')
  }

  isAuthenticated() {
    return !!this.getAuthToken()
  }
}

// Export singleton instance
const authService = new AuthService()
export default authService