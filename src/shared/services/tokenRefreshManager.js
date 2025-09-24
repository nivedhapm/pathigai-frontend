/**
 * Token Refresh Manager
 * Handles automatic token refresh in the background
 * Prevents multiple simultaneous refresh attempts
 * Provides hooks for React components to handle auth state changes
 */

import authService from './authService.js'

class TokenRefreshManager {
  constructor() {
    this.refreshInterval = null
    this.isRefreshing = false
    this.refreshPromise = null
    this.listeners = []
    this.periodicCheckInterval = null
    this.visibilityHandler = null
    
    // ✅ UPDATED: Enhanced timing for 2-hour tokens (backend updated)
    this.REFRESH_INTERVAL = 30 * 1000 // Check every 30 seconds
    this.REFRESH_BUFFER_MINUTES = 15 // Refresh when 15 minutes left (was 10)
    this.SMART_REFRESH_PERCENTAGE = 0.85 // Refresh at 85% of token lifetime (more aggressive for 2-hour tokens)
    this.PROACTIVE_REFRESH_MINUTES = 20 // Start proactive refresh 20 minutes before expiration
  }

  /**
   * Start automatic token refresh monitoring (enhanced)
   */
  startTokenRefreshMonitoring() {
    this.stopTokenRefreshMonitoring() // Clear any existing interval
    
    // Initial check
    this.checkAndRefreshToken()
    
    // Set up periodic checks (now every 30 seconds)
    this.refreshInterval = setInterval(() => {
      this.checkAndRefreshToken()
    }, this.REFRESH_INTERVAL)

    // Setup tab visibility handler
    this.setupVisibilityHandler()
    
    console.log('🔄 Enhanced token refresh monitoring started (30s intervals)')
  }

  /**
   * Setup visibility change handler to prevent logout when tab becomes active
   */
  setupVisibilityHandler() {
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler)
    }

    this.visibilityHandler = () => {
      if (!document.hidden) {
        // Tab became visible again
        console.log('👁️ Tab became visible, checking token status...')
        
        const token = authService.getAuthToken()
        if (!token) {
          console.log('❌ No token found when tab became visible')
          return
        }

        if (this.isTokenActuallyExpired(token)) {
          console.log('🔄 Token expired while tab was hidden, refreshing...')
          this.refreshToken()
        } else {
          console.log('✅ Token still valid after tab became visible')
          // Schedule next refresh with updated timing
          this.scheduleSmartRefresh()
        }
      }
    }

    document.addEventListener('visibilitychange', this.visibilityHandler)
  }

  /**
   * Smart refresh scheduling based on token lifetime
   */
  scheduleSmartRefresh() {
    const token = authService.getAuthToken()
    if (!token) return

    const timeUntilExpiration = this.getTimeUntilExpiration(token)
    
    if (timeUntilExpiration <= 0) {
      console.log('🔄 Token already expired, attempting refresh...')
      this.refreshToken()
      return
    }

    const refreshTime = this.calculateRefreshTiming(token)
    
    if (refreshTime > 0) {
      console.log(`⏰ Smart refresh scheduled in ${Math.round(refreshTime / 1000 / 60)} minutes`)
      
      setTimeout(() => {
        console.log('⏰ Smart refresh timer triggered')
        this.refreshToken()
      }, refreshTime)
    }
  }

  /**
   * Stop automatic token refresh monitoring (enhanced cleanup)
   */
  stopTokenRefreshMonitoring() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
      this.refreshInterval = null
    }

    if (this.periodicCheckInterval) {
      clearInterval(this.periodicCheckInterval)
      this.periodicCheckInterval = null
    }

    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler)
      this.visibilityHandler = null
    }

    console.log('🛑 Enhanced token refresh monitoring stopped')
  }

  /**
   * Enhanced token checking with smart refresh logic for 2-hour tokens
   */
  async checkAndRefreshToken() {
    try {
      const token = authService.getAuthToken()
      const refreshToken = authService.getRefreshToken()
      
      // Don't check if user is not authenticated
      if (!token || !refreshToken) {
        return false
      }

      // Check if token is actually expired
      if (this.isTokenActuallyExpired(token)) {
        console.log('🔄 Token is expired, refreshing immediately...')
        await this.refreshToken()
        return true
      }

      // ✅ UPDATED: More aggressive refresh timing for 2-hour tokens
      const timeUntilExpiration = this.getTimeUntilExpiration(token)
      const shouldRefresh = timeUntilExpiration < (this.REFRESH_BUFFER_MINUTES * 60 * 1000)
      
      // ✅ NEW: Also check proactive refresh (20 minutes before expiration)
      const proactiveRefresh = timeUntilExpiration < (this.PROACTIVE_REFRESH_MINUTES * 60 * 1000)
      
      if (shouldRefresh || proactiveRefresh) {
        console.log(`🔄 Token expires in ${Math.round(timeUntilExpiration / 1000 / 60)} minutes, refreshing... (${shouldRefresh ? 'buffer' : 'proactive'})`)
        await this.refreshToken()
        return true
      }

      return false
    } catch (error) {
      console.error('❌ Token refresh check failed:', error)
      this.notifyListeners('refresh_failed', error)
      return false
    }
  }

  /**
   * Check if token is actually expired (enhanced from your implementation)
   */
  isTokenActuallyExpired(token = null) {
    const tokenToCheck = token || authService.getAuthToken()
    if (!tokenToCheck) return true
    
    try {
      const payload = JSON.parse(atob(tokenToCheck.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      const expirationTime = payload.exp
      
      // Add 30 second buffer to account for clock skew
      return currentTime > (expirationTime - 30)
    } catch (error) {
      console.error('Error parsing token:', error)
      return true
    }
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  getTimeUntilExpiration(token = null) {
    const tokenToCheck = token || authService.getAuthToken()
    if (!tokenToCheck) return 0
    
    try {
      const payload = JSON.parse(atob(tokenToCheck.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      const expirationTime = payload.exp
      return Math.max(0, (expirationTime - currentTime) * 1000)
    } catch (error) {
      return 0
    }
  }

  /**
   * Smart refresh timing calculation for 2-hour tokens
   */
  calculateRefreshTiming(token = null) {
    const tokenToCheck = token || authService.getAuthToken()
    if (!tokenToCheck) return 0

    const timeUntilExpiration = this.getTimeUntilExpiration(tokenToCheck)
    
    if (timeUntilExpiration <= 0) return 0

    // ✅ UPDATED: For 2-hour tokens, refresh at 20 minutes before expiration OR at 85% of token lifetime
    const refreshTime = Math.min(
      timeUntilExpiration - (this.PROACTIVE_REFRESH_MINUTES * 60 * 1000),
      timeUntilExpiration * this.SMART_REFRESH_PERCENTAGE
    )
    
    // Ensure minimum wait time of 30 seconds
    return Math.max(refreshTime, 30000)
  }

  /**
   * Refresh the token (with deduplication)
   */
  async refreshToken() {
    // If already refreshing, return the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise
    }

    this.isRefreshing = true
    
    this.refreshPromise = this._performRefresh()
    
    try {
      const result = await this.refreshPromise
      this.notifyListeners('refresh_success', result)
      return result
    } catch (error) {
      this.notifyListeners('refresh_failed', error)
      throw error
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  /**
   * Perform the actual token refresh
   */
  async _performRefresh() {
    try {
      const result = await authService.refreshAccessToken()
      console.log('✅ Token refreshed successfully')
      return result
    } catch (error) {
      console.error('❌ Token refresh failed:', error)
      
      // If refresh fails, user needs to log in again
      this.handleRefreshFailure()
      throw error
    }
  }

  /**
   * Handle refresh failure by logging out user
   */
  handleRefreshFailure() {
    console.log('🚪 Refresh failed, logging out user')
    
    // Clear all auth data
    authService.clearAllUserData()
    
    // Stop monitoring
    this.stopTokenRefreshMonitoring()
    
    // Dispatch logout event
    window.dispatchEvent(new CustomEvent('auth:logout', {
      detail: { reason: 'token_refresh_failed' }
    }))
    
    // Redirect to login page
    if (typeof window !== 'undefined' && window.location) {
      window.location.href = '/login'
    }
  }

  /**
   * Add listener for refresh events
   */
  addListener(callback) {
    this.listeners.push(callback)
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  /**
   * Notify all listeners of refresh events
   */
  notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data)
      } catch (error) {
        console.error('Error in refresh listener:', error)
      }
    })
  }

  /**
   * Force refresh token (useful for testing or manual refresh)
   */
  async forceRefresh() {
    console.log('🔄 Force refreshing token...')
    return this.refreshToken()
  }

  /**
   * Initialize the enhanced token refresh manager
   */
  initialize() {
    // Only start if user is authenticated
    if (authService.isAuthenticated()) {
      this.startTokenRefreshMonitoring()
      this.scheduleSmartRefresh()
    }

    // Listen for login events to start monitoring
    window.addEventListener('auth:login', () => {
      this.startTokenRefreshMonitoring()
      this.scheduleSmartRefresh()
    })

    // Listen for logout events to stop monitoring
    window.addEventListener('auth:logout', () => {
      this.stopTokenRefreshMonitoring()
    })

    // Expose debugging functions globally
    if (typeof window !== 'undefined') {
      window.validateToken = () => this.validateCurrentToken()
      window.checkTokenStatus = () => this.getDetailedStatus()
    }

    console.log('🚀 Enhanced Token Refresh Manager initialized')
    console.log('💡 Use validateToken() or checkTokenStatus() in console for debugging')
  }

  /**
   * Manual token validation for debugging (Updated for 2-hour tokens)
   */
  validateCurrentToken() {
    const token = authService.getAuthToken()
    if (!token) {
      console.log('❌ No access token found')
      return false
    }

    const isActuallyExpired = this.isTokenActuallyExpired(token)
    const timeLeft = this.getTimeUntilExpiration(token)
    const shouldRefresh = authService.isTokenExpired(this.REFRESH_BUFFER_MINUTES)
    const nearExpiration = authService.isTokenNearExpiration(token)
    const proactiveRefresh = timeLeft < (this.PROACTIVE_REFRESH_MINUTES * 60 * 1000)

    console.log('🔍 Enhanced Token Validation (2-hour tokens):')
    console.log(`   Actually Expired: ${isActuallyExpired ? '❌ YES' : '✅ NO'}`)
    console.log(`   Should Refresh (15min): ${shouldRefresh ? '⚠️ YES' : '✅ NO'}`)
    console.log(`   Near Expiration (5min): ${nearExpiration ? '🔴 YES' : '✅ NO'}`)
    console.log(`   Proactive Refresh (20min): ${proactiveRefresh ? '🟡 YES' : '✅ NO'}`)
    console.log(`   Time Left: ${Math.round(timeLeft / 1000 / 60)} minutes`)
    console.log(`   Next Refresh: ${Math.round(this.calculateRefreshTiming() / 1000 / 60)} minutes`)

    return !isActuallyExpired
  }

  /**
   * Get detailed status for debugging
   */
  getDetailedStatus() {
    const baseStatus = this.getStatus()
    const token = authService.getAuthToken()
    
    return {
      ...baseStatus,
      tokenExists: !!token,
      actuallyExpired: this.isTokenActuallyExpired(token),
      timeUntilExpiration: this.getTimeUntilExpiration(token),
      smartRefreshTime: this.calculateRefreshTiming(token),
      hasVisibilityHandler: !!this.visibilityHandler
    }
  }

  /**
   * Get current refresh status
   */
  getStatus() {
    return {
      isMonitoring: !!this.refreshInterval,
      isRefreshing: this.isRefreshing,
      tokenExpired: authService.isTokenExpired(),
      hasRefreshToken: !!authService.getRefreshToken()
    }
  }
}

// Export singleton instance
const tokenRefreshManager = new TokenRefreshManager()
export default tokenRefreshManager