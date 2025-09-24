/**
 * React Hook for Token Refresh
 * Provides components with token refresh state and utilities
 */

import { useState, useEffect, useCallback } from 'react'
import tokenRefreshManager from '../services/tokenRefreshManager.js'
import authService from '../services/authService.js'

const useTokenRefresh = () => {
  const [refreshState, setRefreshState] = useState({
    isRefreshing: false,
    lastRefreshTime: null,
    error: null,
    isAuthenticated: authService.isAuthenticated()
  })

  // Handle refresh events
  const handleRefreshEvent = useCallback((event, data) => {
    switch (event) {
      case 'refresh_success':
        setRefreshState(prev => ({
          ...prev,
          isRefreshing: false,
          lastRefreshTime: new Date(),
          error: null,
          isAuthenticated: true
        }))
        break
        
      case 'refresh_failed':
        setRefreshState(prev => ({
          ...prev,
          isRefreshing: false,
          error: data,
          isAuthenticated: false
        }))
        break
        
      default:
        break
    }
  }, [])

  // Manual refresh function
  const manualRefresh = useCallback(async () => {
    try {
      setRefreshState(prev => ({ ...prev, isRefreshing: true, error: null }))
      await tokenRefreshManager.forceRefresh()
    } catch (error) {
      setRefreshState(prev => ({ ...prev, error, isRefreshing: false }))
    }
  }, [])

  // Get refresh manager status
  const getStatus = useCallback(() => {
    return tokenRefreshManager.getStatus()
  }, [])

  useEffect(() => {
    // Subscribe to refresh events
    const unsubscribe = tokenRefreshManager.addListener(handleRefreshEvent)
    
    // Update authentication state periodically
    const authCheckInterval = setInterval(() => {
      setRefreshState(prev => ({
        ...prev,
        isAuthenticated: authService.isAuthenticated()
      }))
    }, 30000) // Check every 30 seconds

    return () => {
      unsubscribe()
      clearInterval(authCheckInterval)
    }
  }, [handleRefreshEvent])

  return {
    ...refreshState,
    manualRefresh,
    getStatus
  }
}

export default useTokenRefresh