import { useState } from 'react'
import { Search, UserPlus, Users, UserX } from 'lucide-react'
import AddUsersSection from '../components/AddUsersSection'
import ManageUsersSection from '../components/ManageUsersSection'
import DeleteUsersSection from '../components/DeleteUsersSection'
import '../styles/user-management.css'

const UserManagementPage = () => {
  const [activeSection, setActiveSection] = useState('add')
  const [searchQuery, setSearchQuery] = useState('')

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
    },
    {
      id: 'delete',
      label: 'Delete Users',
      icon: UserX,
      component: DeleteUsersSection
    }
  ]

  // Get current active component
  const ActiveComponent = navigationTabs.find(tab => tab.id === activeSection)?.component || AddUsersSection

  return (
    <div className="user-management-container">
      {/* Page Header with inline search */}
      <div className="user-management-header">
        <div className="header-top">
          <h1 className="user-management-title">User Management</h1>
          <div className="header-right">
            <div className="search-input-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
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
        <ActiveComponent searchQuery={searchQuery} />
      </div>
    </div>
  )
}

export default UserManagementPage