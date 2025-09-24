import apiService from './api.js'

/**
 * Dashboard Service - Handles dashboard data, navigation, and related operations
 */
class DashboardService {
  
  /**
   * Get profile-specific dashboard data with stats, activity, and quick actions
   */
  async getDashboardData() {
    try {
      const response = await apiService.get('/dashboard/data')
      return response
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      throw error
    }
  }

  /**
   * Get dynamic navigation menu based on user's profile and permissions
   */
  async getNavigation() {
    try {
      const response = await apiService.get('/dashboard/navigation')
      return response
    } catch (error) {
      console.error('Failed to fetch navigation data:', error)
      throw error
    }
  }

  /**
   * Extend user session (alternative endpoint to auth service)
   */
  async extendSession() {
    try {
      const response = await apiService.post('/dashboard/extend-session')
      return response
    } catch (error) {
      console.error('Failed to extend session via dashboard:', error)
      throw error
    }
  }

  /**
   * Cache navigation data to reduce API calls
   */
  _navigationCache = null
  _navigationCacheTime = null
  _cacheTimeout = 5 * 60 * 1000 // 5 minutes

  async getCachedNavigation() {
    const now = Date.now()
    
    // Return cached data if still valid
    if (this._navigationCache && 
        this._navigationCacheTime && 
        (now - this._navigationCacheTime) < this._cacheTimeout) {
      return this._navigationCache
    }

    // Fetch fresh data
    try {
      const navigation = await this.getNavigation()
      this._navigationCache = navigation
      this._navigationCacheTime = now
      return navigation
    } catch (error) {
      // Return cached data if available, even if stale
      if (this._navigationCache) {
        console.warn('Using stale navigation cache due to API error:', error)
        return this._navigationCache
      }
      throw error
    }
  }

  /**
   * Clear navigation cache (useful after role/profile changes)
   */
  clearNavigationCache() {
    this._navigationCache = null
    this._navigationCacheTime = null
  }

  /**
   * Check if user has permission for a specific action
   */
  hasPermission(permissions, requiredPermission) {
    if (!permissions || !Array.isArray(permissions)) {
      return false
    }
    return permissions.includes(requiredPermission)
  }

  /**
   * Filter navigation items based on user permissions
   */
  filterNavigationByPermissions(navigation, userPermissions) {
    if (!navigation || !navigation.navigation) {
      return navigation
    }

    const filteredNavigation = navigation.navigation.map(section => ({
      ...section,
      items: section.items.filter(item => {
        // If no required permissions, show item
        if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
          return true
        }
        
        // Check if user has all required permissions
        return item.requiredPermissions.every(permission => 
          this.hasPermission(userPermissions, permission)
        )
      })
    })).filter(section => section.items.length > 0) // Remove empty sections

    return {
      ...navigation,
      navigation: filteredNavigation
    }
  }

  /**
   * Get dashboard stats in a formatted way for UI components
   */
  formatDashboardStats(stats) {
    if (!stats || typeof stats !== 'object') {
      return []
    }

    return Object.entries(stats).map(([key, value]) => ({
      id: key,
      label: this.formatStatLabel(key),
      value: value,
      type: this.detectStatType(value)
    }))
  }

  /**
   * Format stat labels for display
   */
  formatStatLabel(key) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  /**
   * Detect stat value type for appropriate formatting
   */
  detectStatType(value) {
    if (typeof value === 'number') {
      return 'number'
    }
    if (typeof value === 'string' && value.includes('%')) {
      return 'percentage'
    }
    if (typeof value === 'string' && value.includes('$')) {
      return 'currency'
    }
    return 'text'
  }

  /**
   * Handle dashboard quick actions
   */
  async executeQuickAction(actionId, actionData = {}) {
    try {
      const response = await apiService.post(`/dashboard/actions/${actionId}`, actionData)
      return response
    } catch (error) {
      console.error(`Failed to execute quick action ${actionId}:`, error)
      throw error
    }
  }

  /**
   * Clean up service state (useful for logout)
   */
  cleanup() {
    this.clearNavigationCache()
  }
}

// Export singleton instance
const dashboardService = new DashboardService()
export default dashboardService