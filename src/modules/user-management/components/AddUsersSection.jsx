import { useState } from 'react'
import { UserPlus, Upload, ArrowLeft, Users } from 'lucide-react'
import { Button } from '../../../shared/components'
import UserForm from './UserForm'
import BulkUploadCSV from './BulkUploadCSV'
import '../styles/user-form.css'
import '../styles/bulk-upload.css'

const AddUsersSection = () => {
  const [activeView, setActiveView] = useState('options') // 'options', 'single-user', 'bulk-upload'

  const handleAddUser = async (userData) => {
    console.log('Adding user:', userData)
    // Here you would typically call an API to create the user
    // For now, just simulate success
    alert('User created successfully!')
    setActiveView('options')
  }

  const handleBackToOptions = () => {
    setActiveView('options')
  }

  // Options view - main selection interface
  if (activeView === 'options') {
    return (
      <div className="section-content fade-in">
        <h2 className="section-title">
          <UserPlus className="nav-tab-icon" />
          Add/Create Users
        </h2>
        <p className="section-description">
          Create new user accounts and assign roles and permissions. You can add individual users or upload multiple users via CSV file.
        </p>
        
        <div className="add-users-options">
          <div className="option-card">
            <div className="option-header">
              <UserPlus size={32} className="option-icon" />
              <h3>Add Single User</h3>
            </div>
            <p className="option-description">
              Create a new user account with detailed information, role assignment, and profile configuration.
            </p>
            <Button
              variant="primary"
              size="large"
              onClick={() => setActiveView('single-user')}
            >
              Create New User
            </Button>
          </div>

          <div className="option-card">
            <div className="option-header">
              <Upload size={32} className="option-icon" />
              <h3>Upload CSV File</h3>
            </div>
            <p className="option-description">
              Bulk import multiple users by uploading a CSV file with validation and error checking.
            </p>
            <Button
              variant="success"
              size="large"
              onClick={() => setActiveView('bulk-upload')}
            >
              Upload CSV File
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Single user form view
  if (activeView === 'single-user') {
    return (
      <div className="section-content fade-in">
        <div className="section-header-with-back">
          <Button
            variant="outline-secondary"
            size="small"
            onClick={handleBackToOptions}
          >
            <ArrowLeft size={16} />
            Back to Options
          </Button>
          <h2 className="section-title">
            <UserPlus className="nav-tab-icon" />
            Add Single User
          </h2>
        </div>
        
        <UserForm
          onSubmit={handleAddUser}
          onCancel={handleBackToOptions}
        />
      </div>
    )
  }

  // Bulk upload CSV view
  if (activeView === 'bulk-upload') {
    return (
      <div className="section-content fade-in">
        <div className="section-header-with-back">
          <Button
            variant="outline-secondary"
            size="small"
            onClick={handleBackToOptions}
          >
            <ArrowLeft size={16} />
            Back to Options
          </Button>
          <h2 className="section-title">
            <Upload className="nav-tab-icon" />
            Bulk Upload Users from CSV
          </h2>
        </div>
        
        <BulkUploadCSV />
      </div>
    )
  }

  return null
}

export default AddUsersSection