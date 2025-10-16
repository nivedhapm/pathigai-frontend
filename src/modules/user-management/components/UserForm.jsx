import { useState } from 'react'
import { User, UserPlus, Upload, Download } from 'lucide-react'
import { Button } from '../../../components/ui'
import { CustomDropdown, CustomDatePicker } from '../../../components/ui'

// Role and Profile hierarchies as per requirements
const ROLES = {
  ADMIN: { level: 9, label: 'Admin', description: 'Highest operational role' },
  MANAGER: { level: 8, label: 'Manager', description: 'Overseeing a team or department' },
  HR: { level: 7, label: 'HR', description: 'Human resources operations' },
  FACULTY: { level: 6, label: 'Faculty', description: 'Training and education' },
  MENTOR: { level: 5, label: 'Mentor', description: 'Guidance and mentoring' },
  INTERVIEW_PANELIST: { level: 4, label: 'Interview Panelist', description: 'Interview operations only' },
  EMPLOYEE: { level: 3, label: 'Employee', description: 'Non-training managers and non-training HR personnel' },
  TRAINEE: { level: 2, label: 'Trainee', description: 'Selected students (ZSGS/PMIS)' },
  APPLICANT: { level: 1, label: 'Applicant', description: 'No system access (data only)' }
}

const PROFILES = {
  SUPER_ADMIN: { level: 7, label: 'Super Admin', description: 'Complete system control' },
  ADMIN: { level: 6, label: 'Admin', description: 'High-level management' },
  MANAGEMENT: { level: 5, label: 'Management', description: 'Supervisory access' },
  TRAINER: { level: 4, label: 'Trainer', description: 'Training operations + interview permissions' },
  INTERVIEW_PANELIST: { level: 3, label: 'Interview Panelist', description: 'Interview operations only' },
  PLACEMENT: { level: 2, label: 'Placement', description: 'Non-training company personnel' },
  TRAINEE: { level: 1, label: 'Trainee', description: 'Student dashboard access' }
}

// Default role-profile mappings
const DEFAULT_MAPPINGS = {
  SUPER_ADMIN: ['ADMIN', 'MANAGER', 'HR'],
  ADMIN: ['MANAGER', 'HR', 'FACULTY'],
  MANAGEMENT: ['HR', 'MANAGER'],
  TRAINER: ['FACULTY', 'MENTOR'],
  INTERVIEW_PANELIST: ['INTERVIEW_PANELIST'],
  PLACEMENT: ['EMPLOYEE'],
  TRAINEE: ['TRAINEE']
}

const UserForm = ({ userProfile = 'SUPER_ADMIN', onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    workLocation: '',
    role: '',
    profile: '',
    temporaryPassword: '',
    isActive: true
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Get allowed profiles based on current user's profile with restrictions
  const getAllowedProfiles = () => {
    const currentLevel = PROFILES[userProfile]?.level || 0
    let allowedProfiles = Object.entries(PROFILES)
      .filter(([key, profile]) => profile.level <= currentLevel)
      .map(([key, profile]) => ({ key, ...profile }))

    // Apply profile-specific restrictions
    switch (userProfile) {
      case 'SUPER_ADMIN':
        // SUPER_ADMIN can create all profiles
        return allowedProfiles
        
      case 'ADMIN':
        // ADMIN cannot add other ADMINs or SUPER_ADMINs
        return allowedProfiles.filter(profile => 
          !['SUPER_ADMIN', 'ADMIN'].includes(profile.key)
        )
        
      case 'MANAGEMENT':
        // MANAGEMENT can only add: Trainees, Interview Panelists
        return allowedProfiles.filter(profile => 
          ['TRAINEE', 'INTERVIEW_PANELIST'].includes(profile.key)
        )
        
      default:
        // Other profiles don't have user management access
        return []
    }
  }

  // Get allowed roles based on selected profile
  const getAllowedRoles = () => {
    if (!formData.profile) return []
    return DEFAULT_MAPPINGS[formData.profile]?.map(roleKey => ({
      key: roleKey,
      ...ROLES[roleKey]
    })) || []
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }

    // Reset role when profile changes
    if (name === 'profile') {
      setFormData(prev => ({ ...prev, role: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.workLocation.trim()) newErrors.workLocation = 'Work location is required'
    if (!formData.role) newErrors.role = 'Role is required'
    if (!formData.profile) newErrors.profile = 'Profile is required'
    if (!formData.temporaryPassword.trim()) newErrors.temporaryPassword = 'Password is required'

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone validation
    const phoneRegex = /^[+]?[\d\s\-()]{10,}$/
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    // Date of birth validation (must be at least 13 years old)
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      if (age < 17) {
        newErrors.dateOfBirth = 'User must be at least 17 years old'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      await onSubmit(formData)
      // Reset form on success
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        workLocation: '',
        role: '',
        profile: '',
        temporaryPassword: '',
        isActive: true
      })
    } catch (error) {
      console.error('Error creating user:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateTempPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({ ...prev, temporaryPassword: password }))
  }

  return (
    <div className="user-form-container">
      <div className="form-header">
        <div className="form-title">
          <h3>Add New User</h3>
        </div>
        <p className="form-description">
          Create a new user account with appropriate role and profile assignments
        </p>
      </div>

      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-grid">
          {/* Personal Information */}
          <div className="form-section">
            <h4>Personal Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? 'error' : ''}
                  placeholder="Enter full name"
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth *</label>
                <CustomDatePicker
                  value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      dateOfBirth: e.target.value ? e.target.value.toISOString().split('T')[0] : ''
                    }))
                  }}
                  placeholder="Select date of birth"
                  error={!!errors.dateOfBirth}
                  name="dateOfBirth"
                />
                {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter email address"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="Enter phone number"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gender">Gender *</label>
                <CustomDropdown
                  options={[
                    { value: 'MALE', label: 'Male' },
                    { value: 'FEMALE', label: 'Female' },
                    { value: 'OTHER', label: 'Other' },
                    { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' }
                  ]}
                  value={formData.gender}
                  onChange={handleInputChange}
                  placeholder="Select Gender"
                  error={!!errors.gender}
                  name="gender"
                />
                {errors.gender && <span className="error-message">{errors.gender}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="workLocation">Work Location *</label>
                <input
                  type="text"
                  id="workLocation"
                  name="workLocation"
                  value={formData.workLocation}
                  onChange={handleInputChange}
                  className={errors.workLocation ? 'error' : ''}
                  placeholder="Enter work location (e.g., New York, Remote, Bangalore)"
                />
                {errors.workLocation && <span className="error-message">{errors.workLocation}</span>}
              </div>
            </div>
          </div>

          {/* Role & Profile Assignment */}
          <div className="form-section">
            <h4>Role & Profile Assignment</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="profile">Profile *</label>
                <CustomDropdown
                  options={getAllowedProfiles().map(profile => ({
                    value: profile.key,
                    label: `${profile.label} - ${profile.description}`
                  }))}
                  value={formData.profile}
                  onChange={handleInputChange}
                  placeholder="Select Profile"
                  error={!!errors.profile}
                  name="profile"
                />
                {errors.profile && <span className="error-message">{errors.profile}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="role">Role *</label>
                <CustomDropdown
                  options={getAllowedRoles().map(role => ({
                    value: role.key,
                    label: `${role.label} - ${role.description}`
                  }))}
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="Select Role"
                  error={!!errors.role}
                  name="role"
                  disabled={!formData.profile}
                />
                {errors.role && <span className="error-message">{errors.role}</span>}
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="form-section">
            <h4>Account Settings</h4>
            <div className="form-group">
              <label htmlFor="temporaryPassword">Temporary Password *</label>
              <div className="password-generator">
                <input
                  type="text"
                  id="temporaryPassword"
                  name="temporaryPassword"
                  value={formData.temporaryPassword}
                  onChange={handleInputChange}
                  className={errors.temporaryPassword ? 'error' : ''}
                  placeholder="Click Generate to create password"
                />
                <Button
                  type="button"
                  variant="outline-secondary"
                  size="small"
                  onClick={generateTempPassword}
                >
                  Generate
                </Button>
              </div>
              {errors.temporaryPassword && <span className="error-message">{errors.temporaryPassword}</span>}
              <small className="form-note">
                User will be required to change password on first login
              </small>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                <span>Account is active (user can login immediately)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <Button
            type="button"
            variant="outline-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="success"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Creating User...' : 'Create User'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default UserForm