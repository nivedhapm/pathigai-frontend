import apiService from './api.js'

/**
 * Profile Service - Handles profile management, role-profile mappings, and hierarchy
 */
class ProfileService {
  
  /**
   * Get all available profiles
   */
  async getProfiles() {
    try {
      const response = await apiService.get('/profiles')
      return response
    } catch (error) {
      console.error('Failed to fetch profiles:', error)
      throw error
    }
  }

  /**
   * Get role-profile mappings
   */
  async getRoleProfileMappings() {
    try {
      const response = await apiService.get('/profiles/mappings')
      return response
    } catch (error) {
      console.error('Failed to fetch role-profile mappings:', error)
      throw error
    }
  }

  /**
   * Get profile hierarchy ordered by level
   */
  async getProfileHierarchy() {
    try {
      const response = await apiService.get('/profiles/hierarchy')
      return response
    } catch (error) {
      console.error('Failed to fetch profile hierarchy:', error)
      throw error
    }
  }

  /**
   * Get allowed profiles for a specific role
   */
  async getAllowedProfilesForRole(roleName) {
    try {
      const response = await apiService.get(`/profiles/allowed-for-role/${roleName}`)
      return response
    } catch (error) {
      console.error(`Failed to fetch allowed profiles for role ${roleName}:`, error)
      throw error
    }
  }

  // ========== CACHE MANAGEMENT ==========
  
  _profilesCache = null
  _hierarchyCache = null
  _mappingsCache = null
  _cacheTimeout = 10 * 60 * 1000 // 10 minutes
  _cacheTimestamps = {}

  /**
   * Get cached profiles to reduce API calls
   */
  async getCachedProfiles() {
    return this._getCachedData('profiles', () => this.getProfiles())
  }

  /**
   * Get cached hierarchy to reduce API calls
   */
  async getCachedHierarchy() {
    return this._getCachedData('hierarchy', () => this.getProfileHierarchy())
  }

  /**
   * Get cached mappings to reduce API calls
   */
  async getCachedMappings() {
    return this._getCachedData('mappings', () => this.getRoleProfileMappings())
  }

  /**
   * Generic cached data helper
   */
  async _getCachedData(cacheKey, fetchFunction) {
    const now = Date.now()
    const cacheVar = `_${cacheKey}Cache`
    const timestamp = this._cacheTimestamps[cacheKey]

    // Return cached data if still valid
    if (this[cacheVar] && timestamp && (now - timestamp) < this._cacheTimeout) {
      return this[cacheVar]
    }

    // Fetch fresh data
    try {
      const data = await fetchFunction()
      this[cacheVar] = data
      this._cacheTimestamps[cacheKey] = now
      return data
    } catch (error) {
      // Return cached data if available, even if stale
      if (this[cacheVar]) {
        console.warn(`Using stale ${cacheKey} cache due to API error:`, error)
        return this[cacheVar]
      }
      throw error
    }
  }

  /**
   * Clear all caches
   */
  clearCache() {
    this._profilesCache = null
    this._hierarchyCache = null
    this._mappingsCache = null
    this._cacheTimestamps = {}
  }

  // ========== UTILITY METHODS ==========

  /**
   * Check if a user profile can create another profile based on hierarchy
   */
  async canCreateProfile(creatorProfile, targetProfile) {
    try {
      const hierarchy = await this.getCachedHierarchy()
      
      const creator = hierarchy.find(p => p.name === creatorProfile)
      const target = hierarchy.find(p => p.name === targetProfile)
      
      if (!creator || !target) {
        return false
      }
      
      // Lower hierarchy level = higher privileges
      return creator.hierarchyLevel <= target.hierarchyLevel
    } catch (error) {
      console.error('Failed to check profile creation permissions:', error)
      return false
    }
  }

  /**
   * Get profile level for comparison
   */
  async getProfileLevel(profileName) {
    try {
      const hierarchy = await this.getCachedHierarchy()
      const profile = hierarchy.find(p => p.name === profileName)
      return profile ? profile.hierarchyLevel : null
    } catch (error) {
      console.error(`Failed to get level for profile ${profileName}:`, error)
      return null
    }
  }

  /**
   * Sort profiles by hierarchy level
   */
  sortProfilesByHierarchy(profiles, ascending = true) {
    return profiles.sort((a, b) => {
      const levelA = a.hierarchyLevel || 999
      const levelB = b.hierarchyLevel || 999
      return ascending ? levelA - levelB : levelB - levelA
    })
  }

  /**
   * Filter profiles that a user can create
   */
  async filterCreatableProfiles(creatorProfile, allProfiles) {
    try {
      const creatorLevel = await this.getProfileLevel(creatorProfile)
      if (creatorLevel === null) {
        return []
      }

      return allProfiles.filter(profile => 
        profile.hierarchyLevel >= creatorLevel
      )
    } catch (error) {
      console.error('Failed to filter creatable profiles:', error)
      return []
    }
  }

  /**
   * Get roles that can be assigned to a specific profile
   */
  async getRolesForProfile(profileName) {
    try {
      const mappings = await this.getCachedMappings()
      return mappings[profileName] || []
    } catch (error) {
      console.error(`Failed to get roles for profile ${profileName}:`, error)
      return []
    }
  }

  /**
   * Validate role-profile combination
   */
  async validateRoleProfileCombination(role, profile) {
    try {
      const allowedProfiles = await this.getAllowedProfilesForRole(role)
      return allowedProfiles.includes(profile)
    } catch (error) {
      console.error(`Failed to validate role-profile combination ${role}-${profile}:`, error)
      return false
    }
  }

  /**
   * Get display name for profile
   */
  getProfileDisplayName(profileName) {
    const displayNames = {
      'SUPER_ADMIN': 'Super Administrator',
      'ADMIN': 'Administrator',
      'MANAGEMENT': 'Management',
      'TRAINER': 'Trainer',
      'INTERVIEW_PANELIST': 'Interview Panelist',
      'PLACEMENT': 'Placement Officer',
      'TRAINEE': 'Trainee'
    }
    return displayNames[profileName] || profileName
  }

  /**
   * Get icon for profile
   */
  getProfileIcon(profileName) {
    const icons = {
      'SUPER_ADMIN': 'crown',
      'ADMIN': 'shield',
      'MANAGEMENT': 'users-cog',
      'TRAINER': 'academic-cap',
      'INTERVIEW_PANELIST': 'clipboard-list',
      'PLACEMENT': 'briefcase',
      'TRAINEE': 'graduation-cap'
    }
    return icons[profileName] || 'user'
  }

  /**
   * Clean up service state
   */
  cleanup() {
    this.clearCache()
  }
}

// Export singleton instance
const profileService = new ProfileService()
export default profileService