import { useState, useRef } from 'react'
import { Upload, FileText, Users, CircleX, CircleCheckBig, X, Download, Eye, EyeOff, ChevronLeft, ChevronRight, Check, Trash2, CheckCircle } from 'lucide-react'
import { Button, useToast } from '../../../shared/components'
import Table from '../../../components/ui/Table/Table'
import userService from '../../../shared/services/userService'
import '../styles/bulk-upload.css'

const BulkUploadCSV = ({ userProfile = 'SUPER_ADMIN' }) => {
  const [uploadStep, setUploadStep] = useState('upload') // 'upload', 'preview', 'processing', 'results'
  const [file, setFile] = useState(null)
  const [csvData, setCsvData] = useState([]) // eslint-disable-line no-unused-vars
  const [validationResults, setValidationResults] = useState([])
  const [uploadResults, setUploadResults] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(10)
  // Password visibility state
  const [showPasswords, setShowPasswords] = useState({})
  const fileInputRef = useRef(null)
  const { showSuccess, showError } = useToast() // eslint-disable-line no-unused-vars

  // Password generation function
  const generateTempPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  // Profile and Role hierarchies for validation
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

  const DEFAULT_MAPPINGS = {
    SUPER_ADMIN: ['ADMIN', 'MANAGER', 'HR'],
    ADMIN: ['MANAGER', 'HR', 'FACULTY'],
    MANAGEMENT: ['HR', 'MANAGER'],
    TRAINER: ['FACULTY', 'MENTOR'],
    INTERVIEW_PANELIST: ['INTERVIEW_PANELIST'],
    PLACEMENT: ['EMPLOYEE'],
    TRAINEE: ['TRAINEE']
  }

  // Required CSV headers
  const REQUIRED_HEADERS = [
    'fullName', 'email', 'phone', 'dateOfBirth', 'gender', 'workLocation', 'role', 'profile'
  ]

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'))
    
    if (csvFile) {
      handleFileSelect(csvFile)
    } else {
      alert('Please upload a CSV file')
    }
  }

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile)
    parseCSV(selectedFile)
  }

  const parseCSV = (file) => {
    setLoading(true)
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const lines = text.split('\n').filter(line => line.trim())
        
        if (lines.length < 2) {
          alert('CSV file must contain at least a header row and one data row')
          setLoading(false)
          return
        }

        // Parse headers
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
        
        // Validate required headers
        const missingHeaders = REQUIRED_HEADERS.filter(req => !headers.includes(req.toLowerCase()))
        if (missingHeaders.length > 0) {
          alert(`Missing required headers: ${missingHeaders.join(', ')}`)
          setLoading(false)
          return
        }

        // Parse data rows
        const data = lines.slice(1).map((line, index) => {
          const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
          const row = {}
          headers.forEach((header, i) => {
            // Map lowercase headers back to original camelCase field names
            const originalFieldName = REQUIRED_HEADERS.find(req => req.toLowerCase() === header)
            if (originalFieldName) {
              row[originalFieldName] = values[i] || ''
            } else {
              row[header] = values[i] || ''
            }
          })
          row.rowNumber = index + 2 // +2 for header and 0-based index
          return row
        })

        setCsvData(data)
        validateCSVData(data)
        setUploadStep('preview')
      } catch (error) {
        console.error('Error parsing CSV:', error)
        alert('Error parsing CSV file. Please check the format.')
      } finally {
        setLoading(false)
      }
    }
    
    reader.readAsText(file)
  }

  const validateCSVData = (data) => {
    const currentLevel = PROFILES[userProfile]?.level || 0
    const results = data.map(row => {
      const errors = []
      const warnings = []

      // Required field validation
      REQUIRED_HEADERS.forEach(field => {
        if (!row[field] || row[field].trim() === '') {
          errors.push(`Missing ${field}`)
        }
      })

      // Email validation
      if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        errors.push('Invalid email format')
      }

      // Phone validation
      if (row.phone && !/^[+]?[\d\s\-()]{10,}$/.test(row.phone)) {
        errors.push('Invalid phone format')
      }

      // Gender validation
      if (row.gender) {
        const validGenders = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']
        if (!validGenders.includes(row.gender.toUpperCase())) {
          errors.push('Invalid gender (must be: Male, Female, Other, or Prefer not to say)')
        }
      }

      // Work location validation
      if (row.workLocation && row.workLocation.trim().length < 2) {
        errors.push('Work location must be at least 2 characters')
      }

      // Profile validation with specific restrictions
      if (row.profile && !PROFILES[row.profile.toUpperCase()]) {
        errors.push('Invalid profile')
      } else if (row.profile) {
        const profileLevel = PROFILES[row.profile.toUpperCase()]?.level || 0
        if (profileLevel > currentLevel) {
          errors.push('Cannot assign higher profile than your own')
        }

        // Apply profile-specific restrictions based on current user's profile
        const profileKey = row.profile.toUpperCase()
        switch (userProfile) {
          case 'SUPER_ADMIN':
            // SUPER_ADMIN can create all profiles - no additional restrictions
            break
            
          case 'ADMIN':
            // ADMIN cannot add other ADMINs or SUPER_ADMINs
            if (['SUPER_ADMIN', 'ADMIN'].includes(profileKey)) {
              errors.push('Admin users cannot create other Admin or Super Admin profiles')
            }
            break
            
          case 'MANAGEMENT':
            // MANAGEMENT can only add: Trainees, Interview Panelists
            if (!['TRAINEE', 'INTERVIEW_PANELIST'].includes(profileKey)) {
              errors.push('Management users can only create Trainee and Interview Panelist profiles')
            }
            break
            
          default:
            // Other profiles don't have user management access
            errors.push('Your profile does not have user creation permissions')
        }
      }

      // Role validation
      if (row.role && !ROLES[row.role.toUpperCase()]) {
        errors.push('Invalid role')
      } else if (row.role && row.profile) {
        const allowedRoles = DEFAULT_MAPPINGS[row.profile.toUpperCase()] || []
        if (!allowedRoles.includes(row.role.toUpperCase())) {
          warnings.push('Role-profile combination not in default mapping')
        }
      }

      // Date of Birth validation
      if (row.dateOfBirth) {
        const dob = new Date(row.dateOfBirth)
        if (isNaN(dob.getTime())) {
          errors.push('Invalid date of birth format')
        } else {
          const age = new Date().getFullYear() - dob.getFullYear()
          if (age < 13) {
            errors.push('User must be at least 13 years old')
          }
        }
      }

      return {
        rowNumber: row.rowNumber,
        data: row,
        errors,
        warnings,
        isValid: errors.length === 0
      }
    })

    setValidationResults(results)
  }

  const handleUploadUsers = async () => {
    setLoading(true)
    setUploadStep('processing')

    try {
      // Get only valid rows for processing
      const validRows = validationResults.filter(result => result.isValid)
      const results = {
        totalRows: validationResults.length,
        successCount: 0,
        errorCount: 0,
        details: [],
        timestamp: new Date().toLocaleString()
      }

      // Process each valid row
      for (const validation of validRows) {
        try {
          // Add password to user data
          const userDataWithPassword = {
            ...validation.data,
            temporaryPassword: generateTempPassword()
          }

          // Create user via API
          await userService.createUser(userDataWithPassword)
          
          results.successCount++
          results.details.push({
            email: validation.data.email,
            status: 'success',
            message: 'User created successfully'
          })
        } catch (error) {
          console.error(`Failed to create user ${validation.data.email}:`, error)
          results.errorCount++
          results.details.push({
            email: validation.data.email,
            status: 'error',
            message: error.message || 'Failed to create user'
          })
        }
      }

      // Add validation errors to error count
      const invalidRows = validationResults.filter(result => !result.isValid)
      results.errorCount += invalidRows.length
      
      invalidRows.forEach(validation => {
        results.details.push({
          email: validation.data.email || 'Unknown',
          status: 'error',
          message: validation.errors.join(', ')
        })
      })

      setUploadResults(results)
      setUploadStep('results')
      
      // Show success toast with results
      if (results.successCount > 0) {
        showSuccess(`Successfully created ${results.successCount} user${results.successCount > 1 ? 's' : ''}`)
      }
      if (results.errorCount > 0) {
        showError(`${results.errorCount} user${results.errorCount > 1 ? 's' : ''} failed to create`)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      showError('Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Pagination helpers
  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * recordsPerPage
    const endIndex = startIndex + recordsPerPage
    return data.slice(startIndex, endIndex)
  }

  const getTotalPages = (data) => Math.ceil(data.length / recordsPerPage)

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const togglePasswordVisibility = (index) => {
    setShowPasswords(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  // Delete invalid row function
  const deleteInvalidRow = (rowIndex) => {
    const updatedResults = validationResults.filter((_, index) => index !== rowIndex)
    // Update row numbers after deletion
    const reNumberedResults = updatedResults.map((result, index) => ({
      ...result,
      rowNumber: index + 1
    }))
    setValidationResults(reNumberedResults)
    
    // Show success toast
    showSuccess('Invalid row deleted successfully')
    
    // Reset pagination to first page if current page becomes empty
    const totalPages = Math.ceil(reNumberedResults.length / recordsPerPage)
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }

  const downloadSampleCSV = () => {
    const sampleData = [
      'fullName,email,phone,dateOfBirth,gender,workLocation,role,profile',
      'John Doe,john.doe@company.com,+1234567890,1990-05-15,MALE,New York,MANAGER,ADMIN',
      'Jane Smith,jane.smith@company.com,+1234567891,1985-08-22,FEMALE,Remote,HR,MANAGEMENT',
      'Mike Johnson,mike.johnson@company.com,+1234567892,1988-12-03,MALE,Bangalore,FACULTY,TRAINER'
    ].join('\n')

    const blob = new Blob([sampleData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'sample_users_template.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const resetUpload = () => {
    setUploadStep('upload')
    setFile(null)
    setCsvData([])
    setValidationResults([])
    setUploadResults(null)
    setCurrentPage(1)
    setShowPasswords({})
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Upload Step - File Selection
  if (uploadStep === 'upload') {
    return (
      <div className="bulk-upload-container">
        <div className="upload-header">
          <div className="upload-title">
            <h3>Bulk Upload Users from CSV</h3>
          </div>
          <p className="upload-description">
            Upload a CSV file to create multiple user accounts at once with proper validation
          </p>
        </div>

        <div className="upload-actions">
          <Button
            variant="outline-primary"
            onClick={downloadSampleCSV}
          >
            <Download size={18} />
            Download Sample Template
          </Button>
        </div>

        <div 
          className={`upload-dropzone ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
          
          <Upload size={48} className="upload-icon" />
          <h4>Drop your CSV file here or click to browse</h4>
          <p>Supported format: CSV files (.csv)</p>
          <p>Maximum file size: 10MB</p>
        </div>

        <div className="upload-requirements">
          <h4>Required CSV Headers:</h4>
          <div className="headers-list">
            {REQUIRED_HEADERS.map(header => (
              <span key={header} className="header-tag">{header}</span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Preview Step - Validation Results
  if (uploadStep === 'preview') {
    const validCount = validationResults.filter(r => r.isValid).length
    const errorCount = validationResults.filter(r => !r.isValid).length

    return (
      <div className="bulk-upload-container">
        <div className="upload-header">
          <div className="upload-title">
            <h3>Preview & Validate CSV Data</h3>
          </div>
          <p className="upload-description">
            Review the uploaded data and validation results before proceeding
          </p>
        </div>

        <div className="validation-summary">
          <div className="validation-badges">
            <span className="badge valid">{validCount} Valid Records</span>
            <span className="badge invalid">{errorCount} Invalid Records</span>
          </div>
        </div>

        <div className="validation-results">
          <div className="results-header">
            <h4>Validation Results</h4>
            <p>File: {file?.name} ({validationResults.length} records)</p>
          </div>

          <Table 
            columns={[
              { header: 'S.No', accessor: 'sno' },
              { header: 'Full Name', accessor: 'fullName' },
              { header: 'Email', accessor: 'email' },
              { header: 'Gender', accessor: 'gender' },
              { header: 'Work Location', accessor: 'workLocation' },
              { header: 'Role', accessor: 'role' },
              { header: 'Profile', accessor: 'profile' },
              { header: 'Generated Password', accessor: 'generatedPassword' },
              { header: 'Status', accessor: 'status' },
              { header: 'Action', accessor: 'action' }
            ]}
            data={getPaginatedData(validationResults).map((result, index) => {
              const globalIndex = (currentPage - 1) * recordsPerPage + index
              const actualRowIndex = validationResults.findIndex(r => r.rowNumber === result.rowNumber)
              const tempPassword = generateTempPassword()
              
              return {
                sno: (currentPage - 1) * recordsPerPage + index + 1,
                fullName: result.data.fullName,
                email: result.data.email,
                gender: result.data.gender,
                workLocation: result.data.workLocation,
                role: result.data.role,
                profile: result.data.profile,
                generatedPassword: (
                  <div className="password-container">
                    <span className="password-text">
                      {showPasswords[globalIndex] ? tempPassword : '••••••••••••'}
                    </span>
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility(globalIndex)}
                    >
                      {showPasswords[globalIndex] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                ),
                status: result.isValid ? (
                  <div className="status-valid">
                    <CircleCheckBig size={16} className="success-icon" />
                    <span>Valid</span>
                  </div>
                ) : (
                  <div className="status-invalid">
                    <CircleX size={16} className="error-icon" />
                    <div className="error-tooltip">
                      {result.errors.join(', ')}
                    </div>
                  </div>
                ),
                action: !result.isValid ? (
                  <button
                    type="button"
                    className="delete-row-btn"
                    onClick={() => deleteInvalidRow(actualRowIndex)}
                    title="Delete invalid row"
                  >
                    <Trash2 size={14} />
                  </button>
                ) : null,
                isInvalid: !result.isValid
              }
            })}
            validCount={validCount}
            invalidCount={errorCount}
            theme="light"
          />
            
          {/* Pagination Controls */}
          {getTotalPages(validationResults) > 1 && (
            <div className="table-pagination">
              <div className="pagination-info">
                Showing {(currentPage - 1) * recordsPerPage + 1} to {Math.min(currentPage * recordsPerPage, validationResults.length)} of {validationResults.length} records
              </div>
              <div className="pagination-controls">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  <ChevronLeft size={16} />
                  Previous
                </Button>
                
                <div className="page-numbers">
                  {Array.from({ length: getTotalPages(validationResults) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`page-number ${page === currentPage ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === getTotalPages(validationResults)}
                  className="pagination-btn"
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="preview-actions">
          <Button
            variant="outline-secondary"
            onClick={resetUpload}
          >
            Choose Different File
          </Button>
          <Button
            variant="success"
            onClick={handleUploadUsers}
            disabled={validCount === 0 || loading}
          >
            {loading ? 'Creating Users...' : `Upload ${validCount} Valid Users`}
          </Button>
        </div>
      </div>
    )
  }

  // Processing Step
  if (uploadStep === 'processing') {
    return (
      <div className="bulk-upload-container">
        <div className="processing-state">
          <div className="processing-spinner"></div>
          <h3>Processing Users...</h3>
          <p>Creating user accounts and sending notifications</p>
        </div>
      </div>
    )
  }

  // Results Step
  if (uploadStep === 'results') {
    return (
      <div className="bulk-upload-container">
        <div className="upload-header">
          <div className="upload-title">
            <CheckCircle size={24} />
            <h3>Upload Complete</h3>
          </div>
          <p className="upload-description">
            User creation process completed
          </p>
        </div>

        <div className="results-summary">
          <div className="summary-stats">
            <div className="stat-card success">
              <Check size={24} />
              <div>
                <h4>{uploadResults.successCount}</h4>
                <p>Users Created</p>
              </div>
            </div>
            <div className="stat-card error">
              <X size={24} />
              <div>
                <h4>{uploadResults.errorCount}</h4>
                <p>Failed</p>
              </div>
            </div>
            <div className="stat-card total">
              <Users size={24} />
              <div>
                <h4>{uploadResults.totalRows}</h4>
                <p>Total Records</p>
              </div>
            </div>
          </div>
          <p className="results-timestamp">
            Completed on {uploadResults.timestamp}
          </p>
        </div>

        {uploadResults.details && uploadResults.details.length > 0 && (
          <div className="detailed-results">
            <h4>Detailed Results</h4>
            <div className="results-table">
              <div className="table-header">
                <span>Email</span>
                <span>Status</span>
                <span>Message</span>
              </div>
              <div className="table-body">
                {getPaginatedData(uploadResults.details).map((detail, index) => (
                  <div key={index} className={`table-row ${detail.status}`}>
                    <span className="email-cell">{detail.email}</span>
                    <span className="status-cell">
                      <div className={`status-badge ${detail.status}`}>
                        {detail.status === 'success' ? <Check size={14} /> : <X size={14} />}
                        {detail.status === 'success' ? 'Created' : 'Failed'}
                      </div>
                    </span>
                    <span className="message-cell">{detail.message}</span>
                  </div>
                ))}
              </div>
              
              {/* Pagination for results */}
              {getTotalPages(uploadResults.details) > 1 && (
                <div className="table-pagination">
                  <div className="pagination-info">
                    Showing {(currentPage - 1) * recordsPerPage + 1} to {Math.min(currentPage * recordsPerPage, uploadResults.details.length)} of {uploadResults.details.length} records
                  </div>
                  <div className="pagination-controls">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </Button>
                    
                    <div className="page-numbers">
                      {Array.from({ length: getTotalPages(uploadResults.details) }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          className={`page-number ${page === currentPage ? 'active' : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === getTotalPages(uploadResults.details)}
                      className="pagination-btn"
                    >
                      Next
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="results-actions">
          <Button
            variant="primary"
            onClick={resetUpload}
          >
            Upload Another File
          </Button>
        </div>
      </div>
    )
  }

  return null
}

export default BulkUploadCSV