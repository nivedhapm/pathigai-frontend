import { UserX } from 'lucide-react'

const DeleteUsersSection = () => {
  return (
    <div className="section-content fade-in">
      <h2 className="section-title">
        <UserX className="nav-tab-icon" />
        Delete Users
      </h2>
      <p className="section-description">
        Remove user accounts from the system. This action is permanent and will revoke all access permissions for the selected users.
      </p>
      
      <div className="empty-state">
        <UserX className="empty-state-icon" />
        <h3 className="empty-state-title">Delete User Accounts</h3>
        <p className="empty-state-text">
          Permanently remove user accounts and revoke all associated permissions.
        </p>
      </div>
    </div>
  )
}

export default DeleteUsersSection