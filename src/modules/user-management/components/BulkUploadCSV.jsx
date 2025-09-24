import { useState, useRef } from 'react'
import { Upload, FileText, Users, AlertCircle, CheckCircle, X, Download, Eye } from 'lucide-react'
import { Button } from '../../../shared/components'

const BulkUploadCSV = ({ userProfile = 'SUPER_ADMIN' }) => {
  const [uploadStep, setUploadStep] = useState('upload') // 'upload', 'preview', 'processing', 'results'
  const [file, setFile] = useState(null)
  const [csvData, setCsvData] = useState([])
  const [validationResults, setValidationResults] = useState([])
  const [uploadResults, setUploadResults] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

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
            row[header] = values[i] || ''
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
      if (row.worklocation && row.worklocation.trim().length < 2) {
        errors.push('Work location must be at least 2 characters')
      }

      // Profile validation
      if (row.profile && !PROFILES[row.profile.toUpperCase()]) {
        errors.push('Invalid profile')
      } else if (row.profile) {
        const profileLevel = PROFILES[row.profile.toUpperCase()]?.level || 0
        if (profileLevel > currentLevel) {
          errors.push('Cannot assign higher profile than your own')
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
      if (row.dateofbirth) {
        const dob = new Date(row.dateofbirth)
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
      // Simulate API calls for user creation
      const validRows = validationResults.filter(result => result.isValid)
      const successCount = validRows.length
      const errorCount = validationResults.length - successCount

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000))

      setUploadResults({
        totalRows: validationResults.length,
        successCount,
        errorCount,
        timestamp: new Date().toLocaleString()
      })

      setUploadStep('results')
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setLoading(false)
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
            <Upload size={24} />
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
            <Eye size={24} />
            <h3>Preview & Validate CSV Data</h3>
          </div>
          <p className="upload-description">
            Review the uploaded data and validation results before proceeding
          </p>
        </div>

        <div className="validation-summary">
          <div className="summary-card success">
            <CheckCircle size={20} />
            <span>{validCount} Valid Records</span>
          </div>
          <div className="summary-card error">
            <AlertCircle size={20} />
            <span>{errorCount} Records with Errors</span>
          </div>
        </div>

        <div className="validation-results">
          <div className="results-header">
            <h4>Validation Results</h4>
            <p>File: {file?.name} ({validationResults.length} records)</p>
          </div>

          <div className="results-table">
            <div className="table-header">
              <span>Row</span>
              <span>Name</span>
              <span>Email</span>
              <span>Gender</span>
              <span>Work Location</span>
              <span>Role</span>
              <span>Profile</span>
              <span>Status</span>
            </div>
            {validationResults.slice(0, 10).map(result => (
              <div key={result.rowNumber} className={`table-row ${result.isValid ? 'valid' : 'invalid'}`}>
                <span>{result.rowNumber}</span>
                <span>{result.data.fullname}</span>
                <span>{result.data.email}</span>
                <span>{result.data.gender}</span>
                <span>{result.data.worklocation}</span>
                <span>{result.data.role}</span>
                <span>{result.data.profile}</span>
                <span className="status-cell">
                  {result.isValid ? (
                    <CheckCircle size={16} className="success-icon" />
                  ) : (
                    <div className="error-details">
                      <AlertCircle size={16} className="error-icon" />
                      <div className="error-tooltip">
                        {result.errors.join(', ')}
                      </div>
                    </div>
                  )}
                </span>
              </div>
            ))}
            {validationResults.length > 10 && (
              <div className="table-footer">
                Showing first 10 of {validationResults.length} records
              </div>
            )}
          </div>
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
            disabled={validCount === 0}
          >
            Upload {validCount} Valid Users
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
            User creation process completed successfully
          </p>
        </div>

        <div className="results-summary">
          <div className="summary-stats">
            <div className="stat-card">
              <Users size={24} />
              <div>
                <h4>{uploadResults.successCount}</h4>
                <p>Users Created</p>
              </div>
            </div>
            <div className="stat-card error">
              <AlertCircle size={24} />
              <div>
                <h4>{uploadResults.errorCount}</h4>
                <p>Errors</p>
              </div>
            </div>
          </div>
          <p className="results-timestamp">
            Completed on {uploadResults.timestamp}
          </p>
        </div>

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