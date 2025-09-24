import { Users } from 'lucide-react'

const ManageUsersSection = () => {
  return (
    <div className="section-content fade-in">
      <h2 className="section-title">
        <Users className="nav-tab-icon" />
        Manage Users
      </h2>
      <p className="section-description">
        View, edit, and manage existing user accounts. Update user information, modify roles, reset passwords, and manage user status.
      </p>
      
      <div className="empty-state">
        <Users className="empty-state-icon" />
        <h3 className="empty-state-title">Manage Existing Users</h3>
        <p className="empty-state-text">
          View and edit user accounts, update roles, and manage user permissions.
        </p>
      </div>
    </div>
  )
}

export default ManageUsersSection