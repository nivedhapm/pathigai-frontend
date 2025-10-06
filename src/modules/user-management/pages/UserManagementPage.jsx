import { useState } from 'react'
import { UserPlus, Users } from 'lucide-react'
import AddUsersSection from '../components/AddUsersSection'
import ManageUsersSection from '../components/ManageUsersSection'
import '../styles/user-management.css'

const UserManagementPage = () => {
  const [activeSection, setActiveSection] = useState('add')

  // Navigation tabs configuration
  const navigationTabs = [
    {
      id: 'add',
      label: 'Add Users',
      icon: UserPlus,
      component: AddUsersSection
    },
    {
      id: 'manage',
      label: 'Manage Users',
      icon: Users,
      component: ManageUsersSection
    }
  ]

  // Get current active component
  const ActiveComponent = navigationTabs.find(tab => tab.id === activeSection)?.component || AddUsersSection

  return (
    <div className="user-management-container">
      {/* Page Header */}
      <div className="user-management-header">
        <div className="header-top">
          <h1 className="user-management-title">User Management</h1>
        </div>
        <p className="user-management-subtitle">
          Manage user accounts, roles, and permissions across your organization
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="user-management-nav">
        {navigationTabs.map((tab) => {
          const IconComponent = tab.icon
          return (
            <button
              key={tab.id}
              className={`nav-tab ${activeSection === tab.id ? 'active' : ''}`}
              data-section={tab.id}
              onClick={() => setActiveSection(tab.id)}
            >
              <IconComponent className="nav-tab-icon" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      <div className="user-management-content">
        <ActiveComponent />
      </div>
    </div>
  )
}

export default UserManagementPage