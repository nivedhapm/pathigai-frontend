import { useState } from 'react'
import { Download, FileText, Users, AlertCircle } from 'lucide-react'
import { Button } from '../../../shared/components'
import CustomDropdown from '../../../components/ui/CustomDropdown/CustomDropdown'

const ExportUsersCSV = ({ userProfile = 'SUPER_ADMIN' }) => {
  const [exportOptions, setExportOptions] = useState({
    includeInactive: false,
    includePersonalInfo: true,
    includeContactInfo: true,
    includeRoleInfo: true,
    includeOrgInfo: true,
    includeTimestamps: false,
    filterByProfile: '',
    filterByRole: '',
    filterByDepartment: ''
  })
  const [loading, setLoading] = useState(false)
  const [exportStats, setExportStats] = useState(null)

  // Profile hierarchy for filtering options
  const PROFILES = {
    SUPER_ADMIN: { label: 'Super Admin', level: 7 },
    ADMIN: { label: 'Admin', level: 6 },
    MANAGEMENT: { label: 'Management', level: 5 },
    TRAINER: { label: 'Trainer', level: 4 },
    INTERVIEW_PANELIST: { label: 'Interview Panelist', level: 3 },
    PLACEMENT: { label: 'Placement', level: 2 },
    TRAINEE: { label: 'Trainee', level: 1 }
  }

  const ROLES = {
    ADMIN: { label: 'Admin' },
    MANAGER: { label: 'Manager' },
    HR: { label: 'HR' },
    FACULTY: { label: 'Faculty' },
    MENTOR: { label: 'Mentor' },
    INTERVIEW_PANELIST: { label: 'Interview Panelist' },
    EMPLOYEE: { label: 'Employee' },
    TRAINEE: { label: 'Trainee' },
    APPLICANT: { label: 'Applicant' }
  }

  // Get allowed profiles based on current user's profile
  const getAllowedProfiles = () => {
    const currentLevel = PROFILES[userProfile]?.level || 0
    return Object.entries(PROFILES)
      .filter(([key, profile]) => profile.level <= currentLevel)
      .map(([key, profile]) => ({ key, ...profile }))
  }

  const handleOptionChange = (option, value) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: value
    }))
  }

  const generateCSVHeaders = () => {
    const headers = []
    
    if (exportOptions.includePersonalInfo) {
      headers.push('First Name', 'Last Name', 'Email')
    }
    
    if (exportOptions.includeContactInfo) {
      headers.push('Phone', 'Address')
    }
    
    if (exportOptions.includeRoleInfo) {
      headers.push('Role', 'Profile', 'Permissions')
    }
    
    if (exportOptions.includeOrgInfo) {
      headers.push('Department', 'Joining Date', 'Manager', 'Status')
    }
    
    if (exportOptions.includeTimestamps) {
      headers.push('Created At', 'Updated At', 'Last Login')
    }
    
    return headers
  }

  const generateSampleData = () => {
    // This would normally fetch from API
    const sampleUsers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1234567890',
        address: '123 Main St, City',
        role: 'MANAGER',
        profile: 'ADMIN',
        permissions: 'Full Access',
        department: 'IT',
        joiningDate: '2023-01-15',
        manager: 'Jane Smith',
        status: 'Active',
        createdAt: '2023-01-15 09:00:00',
        updatedAt: '2023-12-01 14:30:00',
        lastLogin: '2023-12-01 08:45:00'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        phone: '+1234567891',
        address: '456 Oak Ave, City',
        role: 'HR',
        profile: 'MANAGEMENT',
        permissions: 'HR Operations',
        department: 'Human Resources',
        joiningDate: '2022-06-01',
        manager: 'Mike Johnson',
        status: 'Active',
        createdAt: '2022-06-01 10:00:00',
        updatedAt: '2023-11-28 16:20:00',
        lastLogin: '2023-11-30 09:15:00'
      }
    ]
    
    return sampleUsers
  }

  const exportToCSV = async () => {
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const headers = generateCSVHeaders()
      const data = generateSampleData()
      
      // Filter data based on options
      let filteredData = data
      
      if (!exportOptions.includeInactive) {
        filteredData = filteredData.filter(user => user.status === 'Active')
      }
      
      if (exportOptions.filterByProfile) {
        filteredData = filteredData.filter(user => user.profile === exportOptions.filterByProfile)
      }
      
      if (exportOptions.filterByRole) {
        filteredData = filteredData.filter(user => user.role === exportOptions.filterByRole)
      }
      
      if (exportOptions.filterByDepartment) {
        filteredData = filteredData.filter(user => 
          user.department.toLowerCase().includes(exportOptions.filterByDepartment.toLowerCase())
        )
      }
      
      // Generate CSV content
      const csvRows = [headers.join(',')]
      
      filteredData.forEach(user => {
        const row = []
        
        if (exportOptions.includePersonalInfo) {
          row.push(user.firstName, user.lastName, user.email)
        }
        
        if (exportOptions.includeContactInfo) {
          row.push(user.phone, user.address)
        }
        
        if (exportOptions.includeRoleInfo) {
          row.push(user.role, user.profile, user.permissions)
        }
        
        if (exportOptions.includeOrgInfo) {
          row.push(user.department, user.joiningDate, user.manager, user.status)
        }
        
        if (exportOptions.includeTimestamps) {
          row.push(user.createdAt, user.updatedAt, user.lastLogin)
        }
        
        csvRows.push(row.map(field => `"${field}"`).join(','))
      })
      
      // Create and download CSV file
      const csvContent = csvRows.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      // Update stats
      setExportStats({
        totalUsers: data.length,
        exportedUsers: filteredData.length,
        timestamp: new Date().toLocaleString()
      })
      
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="export-csv-container">
      <div className="export-header">
        <div className="export-title">
          <Download size={24} />
          <h3>Export Users to CSV</h3>
        </div>
        <p className="export-description">
          Configure export settings and download user data in CSV format
        </p>
      </div>

      <div className="export-options">
        {/* Data Inclusion Options */}
        <div className="options-section">
          <h4>
            <FileText size={18} />
            Include Data Fields
          </h4>
          <div className="checkbox-grid">
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={exportOptions.includePersonalInfo}
                onChange={(e) => handleOptionChange('includePersonalInfo', e.target.checked)}
              />
              <span>Personal Information (Name, Email)</span>
            </label>
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={exportOptions.includeContactInfo}
                onChange={(e) => handleOptionChange('includeContactInfo', e.target.checked)}
              />
              <span>Contact Information (Phone, Address)</span>
            </label>
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={exportOptions.includeRoleInfo}
                onChange={(e) => handleOptionChange('includeRoleInfo', e.target.checked)}
              />
              <span>Role & Profile Information</span>
            </label>
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={exportOptions.includeOrgInfo}
                onChange={(e) => handleOptionChange('includeOrgInfo', e.target.checked)}
              />
              <span>Organization Information</span>
            </label>
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={exportOptions.includeTimestamps}
                onChange={(e) => handleOptionChange('includeTimestamps', e.target.checked)}
              />
              <span>Timestamps (Created, Updated, Last Login)</span>
            </label>
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={exportOptions.includeInactive}
                onChange={(e) => handleOptionChange('includeInactive', e.target.checked)}
              />
              <span>Include Inactive Users</span>
            </label>
          </div>
        </div>

        {/* Filter Options */}
        <div className="options-section">
          <h4>
            <Users size={18} />
            Filter Options
          </h4>
          <div className="filter-grid">
            <div className="filter-group">
              <label>Filter by Profile</label>
              <CustomDropdown
                options={[
                  { value: '', label: 'All Profiles' },
                  ...getAllowedProfiles().map(profile => ({
                    value: profile.key,
                    label: profile.label
                  }))
                ]}
                value={exportOptions.filterByProfile}
                onChange={(e) => handleOptionChange('filterByProfile', e.target.value)}
                placeholder="All Profiles"
              />
            </div>
            <div className="filter-group">
              <label>Filter by Role</label>
              <CustomDropdown
                options={[
                  { value: '', label: 'All Roles' },
                  ...Object.entries(ROLES).map(([key, role]) => ({
                    value: key,
                    label: role.label
                  }))
                ]}
                value={exportOptions.filterByRole}
                onChange={(e) => handleOptionChange('filterByRole', e.target.value)}
                placeholder="All Roles"
              />
            </div>
            <div className="filter-group">
              <label>Filter by Department</label>
              <input
                type="text"
                value={exportOptions.filterByDepartment}
                onChange={(e) => handleOptionChange('filterByDepartment', e.target.value)}
                placeholder="Enter department name"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Export Stats */}
      {exportStats && (
        <div className="export-stats">
          <AlertCircle size={18} />
          <div className="stats-content">
            <h4>Last Export Summary</h4>
            <p>
              Exported {exportStats.exportedUsers} of {exportStats.totalUsers} users 
              on {exportStats.timestamp}
            </p>
          </div>
        </div>
      )}

      {/* Export Action */}
      <div className="export-actions">
        <Button
          onClick={exportToCSV}
          loading={loading}
          disabled={loading}
          variant="primary"
          size="large"
        >
          <Download size={18} />
          {loading ? 'Generating CSV...' : 'Export to CSV'}
        </Button>
      </div>
    </div>
  )
}

export default ExportUsersCSV