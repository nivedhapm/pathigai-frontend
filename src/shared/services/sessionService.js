import authService from './authService'

class SessionService {
  constructor() {
    this.refreshInterval = null
    this.refreshThreshold = 5 * 60 * 1000 // 5 minutes before expiry
    this.tokenExpiryTime = 30 * 60 * 1000 // 30 minutes for testing (later 5 hours)
    this.lastActivityTime = Date.now()
    this.isRefreshing = false
    
    // Initialize from localStorage
    this.initializeFromStorage()
    
    // Start monitoring session
    this.startSessionMonitoring()
    this.setupActivityTracking()
  }

  /**
   * Initialize session data from localStorage
   */
  initializeFromStorage() {
    const lastActivity = localStorage.getItem('lastActivity')
    if (lastActivity) {
      this.lastActivityTime = parseInt(lastActivity)
    } else {
      this.updateActivity()
    }
  }

  /**
   * Update last activity timestamp
   */
  updateActivity() {
    this.lastActivityTime = Date.now()
    localStorage.setItem('lastActivity', this.lastActivityTime.toString())
    localStorage.setItem('loginTimestamp', Date.now().toString())
  }

  /**
   * Start session monitoring and auto-refresh
   */
  startSessionMonitoring() {
    // Check every minute
    this.refreshInterval = setInterval(() => {
      this.checkAndRefreshToken()
    }, 60 * 1000)
  }

  /**
   * Stop session monitoring
   */
  stopSessionMonitoring() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
      this.refreshInterval = null
    }
  }

  /**
   * Setup activity tracking to determine if user is active
   */
  setupActivityTracking() {
    const updateActivity = () => {
      this.updateActivity()
    }

    // Track various user activities
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true })
    })

    // Track navigation/route changes
    window.addEventListener('popstate', updateActivity)
  }

  /**
   * Check if user is currently active (has interacted in last 10 minutes)
   */
  isUserActive() {
    const inactivityThreshold = 10 * 60 * 1000 // 10 minutes
    const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0')
    return (Date.now() - lastActivity) < inactivityThreshold
  }

  /**
   * Get token expiry time from JWT
   */
  getTokenExpiryTime(token) {
    if (!token) return null
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 // Convert to milliseconds
    } catch (error) {
      console.error('Failed to parse token:', error)
      return null
    }
  }

  /**
   * Check if token needs refresh and refresh if user is active
   */
  async checkAndRefreshToken() {
    if (!authService.isAuthenticated() || this.isRefreshing) {
      return
    }

    const token = authService.getAuthToken()
    if (!token) return

    const expiryTime = this.getTokenExpiryTime(token)
    if (!expiryTime) return

    const currentTime = Date.now()
    const timeUntilExpiry = expiryTime - currentTime

    // If token expires soon and user is active, refresh it
    if (timeUntilExpiry <= this.refreshThreshold && this.isUserActive()) {
      await this.refreshAuthToken()
    } else if (timeUntilExpiry <= 0) {
      // Token has expired
      if (this.isUserActive()) {
        // User is active but token expired, try to refresh
        await this.refreshAuthToken()
      } else {
        // User is inactive and token expired, logout
        this.handleSessionExpiry()
      }
    }
  }

  /**
   * Refresh the authentication token
   */
  async refreshAuthToken() {
    if (this.isRefreshing) return

    this.isRefreshing = true

    try {
      const refreshToken = authService.getRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      // Call refresh token endpoint
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const data = await response.json()
      
      // Update tokens
      authService.setTokens({
        authToken: data.authToken || data.jwtToken,
        refreshToken: data.refreshToken
      })

      console.log('Token refreshed successfully')
      
      // Dispatch custom event for components to listen to
      window.dispatchEvent(new CustomEvent('tokenRefreshed', { 
        detail: { 
          newToken: data.authToken || data.jwtToken,
          expiresAt: this.getTokenExpiryTime(data.authToken || data.jwtToken)
        } 
      }))

    } catch (error) {
      console.error('Failed to refresh token:', error)
      this.handleSessionExpiry()
    } finally {
      this.isRefreshing = false
    }
  }

  /**
   * Handle session expiry
   */
  handleSessionExpiry() {
    console.log('Session expired, logging out user')
    
    // Clear all session data
    authService.clearAllUserData()
    this.stopSessionMonitoring()
    
    // Dispatch session expired event
    window.dispatchEvent(new CustomEvent('sessionExpired'))
    
    // Redirect to login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login?session=expired'
    }
  }

  /**
   * Extend session on user activity
   */
  extendSession() {
    this.updateActivity()
    
    // If we're close to token expiry and user is active, proactively refresh
    const token = authService.getAuthToken()
    if (token) {
      const expiryTime = this.getTokenExpiryTime(token)
      const timeUntilExpiry = expiryTime - Date.now()
      
      if (timeUntilExpiry <= this.refreshThreshold) {
        this.refreshAuthToken()
      }
    }
  }

  /**
   * Get session info for display
   */
  getSessionInfo() {
    const token = authService.getAuthToken()
    if (!token) return null

    const expiryTime = this.getTokenExpiryTime(token)
    if (!expiryTime) return null

    const currentTime = Date.now()
    const timeRemaining = expiryTime - currentTime

    return {
      expiresAt: new Date(expiryTime),
      timeRemaining: Math.max(0, timeRemaining),
      isActive: this.isUserActive(),
      willAutoRefresh: this.isUserActive() && timeRemaining <= this.refreshThreshold
    }
  }

  /**
   * Manually refresh token (for user-initiated refresh)
   */
  async manualRefresh() {
    return this.refreshAuthToken()
  }

  /**
   * Initialize session for new login
   */
  initializeSession(tokens) {
    authService.setTokens(tokens)
    this.updateActivity()
    
    if (!this.refreshInterval) {
      this.startSessionMonitoring()
    }
  }

  /**
   * Clean up on logout
   */
  cleanup() {
    this.stopSessionMonitoring()
    localStorage.removeItem('lastActivity')
    localStorage.removeItem('loginTimestamp')
  }
}

// Export singleton instance
const sessionService = new SessionService()
export default sessionService