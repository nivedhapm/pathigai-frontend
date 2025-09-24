import apiService from './api.js'

/**
 * Enhanced User Service with new API endpoints for user management and profile handling
 */
class UserService {
  
  // ========== ENHANCED PROFILE MANAGEMENT ==========
  
  /**
   * Get enhanced user profile with role and profile information from new API
   */
  async getUserProfile(userId = null) {
    try {
      const endpoint = userId ? `/users/${userId}` : '/users/profile'
      const response = await apiService.get(endpoint)
      return response
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      throw error
    }
  }

  // ========== USER MANAGEMENT (NEW ENDPOINTS) ==========
  
  /**
   * Create new user with role-profile validation
   */
  async createUser(userData) {
    try {
      const response = await apiService.post('/users/create', userData)
      return response
    } catch (error) {
      console.error('Failed to create user:', error)
      throw error
    }
  }

  /**
   * Get list of users with filtering options
   */
  async getUsers(filters = {}) {
    try {
      const response = await apiService.get('/users', { params: filters })
      return response
    } catch (error) {
      console.error('Failed to fetch users:', error)
      throw error
    }
  }

  /**
   * Get specific user by ID
   */
  async getUserById(userId) {
    try {
      const response = await apiService.get(`/users/${userId}`)
      return response
    } catch (error) {
      console.error(`Failed to fetch user ${userId}:`, error)
      throw error
    }
  }

  /**
   * Update user profile/role
   */
  async updateUser(userId, userData) {
    try {
      const response = await apiService.put(`/users/${userId}`, userData)
      return response
    } catch (error) {
      console.error(`Failed to update user ${userId}:`, error)
      throw error
    }
  }

  /**
   * Delete/disable user
   */
  async deleteUser(userId) {
    try {
      const response = await apiService.delete(`/users/${userId}`)
      return response
    } catch (error) {
      console.error(`Failed to delete user ${userId}:`, error)
      throw error
    }
  }

  /**
   * Get user's dashboard route based on their profile
   */
  getDashboardRoute(profile) {
    // APPLICANT role has no profile, redirect to a special applicant page
    if (!profile || profile === null) {
      return '/applicant-dashboard'
    }
    
    // All other profiles go to the main dashboard
    return '/dashboard'
  }

  /**
   * Check if user has access to a specific feature/route
   */
  hasAccess(userProfile, requiredProfile = null, requiredRole = null) {
    if (requiredProfile && userProfile !== requiredProfile) {
      return false
    }
    
    if (requiredRole) {
      // This would be checked against user's role, but for now we focus on profile
      // TODO: Implement role-based access control when needed
    }
    
    return true
  }

  /**
   * Get navigation configuration based on user profile
   */
  getNavigationForProfile(profile) {
    const baseNavigation = [
      {
        section: 'Overview',
        items: [
          { id: 'dashboard', label: 'Dashboard', path: '/dashboard' }
        ]
      }
    ]

    switch (profile) {
      case 'SUPER_ADMIN':
        return [
          ...baseNavigation,
          {
            section: 'Administration',
            items: [
              { id: 'user-management', label: 'User Management', path: '/dashboard/users' },
              { id: 'company-settings', label: 'Company Settings', path: '/dashboard/settings' },
              { id: 'system-config', label: 'System Config', path: '/dashboard/config' },
              { id: 'audit-logs', label: 'Audit Logs', path: '/dashboard/audit' }
            ]
          }
        ]

      case 'ADMIN':
        return [
          ...baseNavigation,
          {
            section: 'Management', 
            items: [
              { id: 'user-management', label: 'User Management', path: '/dashboard/users' }
            ]
          }
        ]

      case 'MANAGEMENT':
        return [
          ...baseNavigation,
          {
            section: 'Operations',
            items: [
              { id: 'user-management', label: 'User Management', path: '/dashboard/users' }
            ]
          }
        ]

      // For other profiles, only show dashboard for now
      case 'TRAINER':
      case 'INTERVIEW_PANELIST':
      case 'PLACEMENT':
      case 'TRAINEE':
      default:
        return baseNavigation
    }
  }

  /**
   * Simulate user profile data - in real app this would come from API
   */
  getSimulatedUserProfile() {
    // For testing purposes, return SUPER_ADMIN by default
    // In real implementation, this would come from the backend after authentication
    return {
      primaryProfile: 'SUPER_ADMIN',
      primaryRole: 'ADMIN'
    }
  }

  /**
   * Check if profile has user management access
   */
  hasUserManagementAccess(profile) {
    return ['SUPER_ADMIN', 'ADMIN', 'MANAGEMENT'].includes(profile)
  }

  /**
   * Get allowed profiles that a user can create based on their profile
   */
  getAllowedCreationProfiles(userProfile) {
    switch (userProfile) {
      case 'SUPER_ADMIN':
        return ['SUPER_ADMIN', 'ADMIN', 'MANAGEMENT', 'TRAINER', 'INTERVIEW_PANELIST', 'PLACEMENT', 'TRAINEE']
      
      case 'ADMIN':
        return ['MANAGEMENT', 'TRAINER', 'INTERVIEW_PANELIST', 'PLACEMENT', 'TRAINEE']
      
      case 'MANAGEMENT':
        return ['TRAINEE', 'INTERVIEW_PANELIST']
      
      default:
        return []
    }
  }

  /**
   * Get allowed roles that a user can assign based on their profile
   */
  getAllowedRolesForProfile(userProfile, targetProfile) {
    // Based on your schema, roles can map to different profiles
    // depending on who creates them
    
    const roleProfileMappings = {
      'SUPER_ADMIN': {
        'SUPER_ADMIN': ['ADMIN', 'MANAGER', 'HR'],
        'ADMIN': ['MANAGER', 'HR', 'FACULTY'],
        'MANAGEMENT': ['HR', 'MANAGER'],
        'TRAINER': ['FACULTY', 'MENTOR'],
        'INTERVIEW_PANELIST': ['INTERVIEW_PANELIST'],
        'PLACEMENT': ['EMPLOYEE'],
        'TRAINEE': ['TRAINEE']
      },
      'ADMIN': {
        'MANAGEMENT': ['HR', 'MANAGER'],
        'TRAINER': ['FACULTY', 'MENTOR'],
        'INTERVIEW_PANELIST': ['INTERVIEW_PANELIST'],
        'PLACEMENT': ['EMPLOYEE'],
        'TRAINEE': ['TRAINEE']
      },
      'MANAGEMENT': {
        'TRAINEE': ['TRAINEE'],
        'INTERVIEW_PANELIST': ['INTERVIEW_PANELIST']
      }
    }

    return roleProfileMappings[userProfile]?.[targetProfile] || []
  }

  /**
   * Special handling for APPLICANT role (no profile)
   */
  isApplicantRole(role) {
    return role === 'APPLICANT'
  }

  /**
   * Get profile from role (null for APPLICANT)
   */
  getProfileFromRole(role, creatorProfile = null) {
    if (role === 'APPLICANT') {
      return null
    }

    // For other roles, profile depends on who creates them
    // This logic should match your backend implementation
    const defaultRoleProfileMap = {
      'ADMIN': 'SUPER_ADMIN',
      'MANAGER': creatorProfile === 'SUPER_ADMIN' ? 'ADMIN' : 'MANAGEMENT',
      'HR': creatorProfile === 'SUPER_ADMIN' ? 'ADMIN' : 'MANAGEMENT',
      'FACULTY': creatorProfile === 'ADMIN' ? 'ADMIN' : 'TRAINER',
      'MENTOR': 'TRAINER',
      'INTERVIEW_PANELIST': 'INTERVIEW_PANELIST',
      'EMPLOYEE': 'PLACEMENT',
      'TRAINEE': 'TRAINEE'
    }

    return defaultRoleProfileMap[role] || null
  }
}

// Export singleton instance
const userService = new UserService()
export default userService