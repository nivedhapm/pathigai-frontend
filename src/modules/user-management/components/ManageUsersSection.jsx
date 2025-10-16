import { useState, useEffect } from 'react'
import { Users, Search, Filter, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { Button, useToast, CustomDropdown } from '../../../components/ui'
import userService from '../../../shared/services/userService'
import '../styles/manage-users.css'

const ManageUsersSection = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [profileFilter, setProfileFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(10)
  const [editingUser, setEditingUser] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const { showSuccess, showError } = useToast()

  // Role and Profile options
  const roles = ['ADMIN', 'MANAGER', 'HR', 'FACULTY', 'MENTOR', 'INTERVIEW_PANELIST', 'EMPLOYEE', 'TRAINEE', 'APPLICANT']
  const profiles = ['SUPER_ADMIN', 'ADMIN', 'MANAGEMENT', 'TRAINER', 'INTERVIEW_PANELIST', 'PLACEMENT', 'TRAINEE']

  useEffect(() => {
    fetchUsers()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await userService.getUsers()
      setUsers(response.data || response || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
      showError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleRoleFilter = (role) => {
    setRoleFilter(role)
    setCurrentPage(1)
  }

  const handleProfileFilter = (profile) => {
    setProfileFilter(profile)
    setCurrentPage(1)
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !roleFilter || user.role === roleFilter
    const matchesProfile = !profileFilter || user.profile === profileFilter
    return matchesSearch && matchesRole && matchesProfile
  })

  const getPaginatedUsers = () => {
    const startIndex = (currentPage - 1) * recordsPerPage
    const endIndex = startIndex + recordsPerPage
    return filteredUsers.slice(startIndex, endIndex)
  }

  const getTotalPages = () => Math.ceil(filteredUsers.length / recordsPerPage)

  const handleEdit = (user) => {
    setEditingUser({ ...user })
  }

  const handleSaveEdit = async () => {
    try {
      await userService.updateUser(editingUser.id, {
        role: editingUser.role,
        profile: editingUser.profile
      })
      await fetchUsers()
      setEditingUser(null)
      showSuccess('User updated successfully')
    } catch (error) {
      console.error('Failed to update user:', error)
      showError('Failed to update user')
    }
  }

  const handleDelete = async (userId) => {
    try {
      await userService.deleteUser(userId)
      await fetchUsers()
      setShowDeleteConfirm(null)
      showSuccess('User deleted successfully')
    } catch (error) {
      console.error('Failed to delete user:', error)
      showError('Failed to delete user')
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setRoleFilter('')
    setProfileFilter('')
    setCurrentPage(1)
  }

  return (
    <div className="section-content fade-in">
      <div className="manage-users-header">
        <h2 className="section-title">
          <Users className="nav-tab-icon" />
          Manage Users
        </h2>
        <p className="section-description">
          View, edit, and manage existing user accounts. Update user roles and profiles or remove users.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="users-controls">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-container">
          <div className="filter-group">
            <Filter size={16} />
            <CustomDropdown
              options={[
                { value: '', label: 'All Roles' },
                ...roles.map(role => ({ value: role, label: role }))
              ]}
              value={roleFilter}
              onChange={(e) => handleRoleFilter(e.target.value)}
              placeholder="All Roles"
              className="filter-select"
            />
          </div>

          <div className="filter-group">
            <Filter size={16} />
            <CustomDropdown
              options={[
                { value: '', label: 'All Profiles' },
                ...profiles.map(profile => ({ value: profile, label: profile }))
              ]}
              value={profileFilter}
              onChange={(e) => handleProfileFilter(e.target.value)}
              placeholder="All Profiles"
              className="filter-select"
            />
          </div>

          {(searchTerm || roleFilter || profileFilter) && (
            <Button
              variant="outline-secondary"
              size="small"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <Users className="empty-state-icon" />
            <h3 className="empty-state-title">No Users Found</h3>
            <p className="empty-state-text">
              {searchTerm || roleFilter || profileFilter 
                ? 'No users match your search criteria.' 
                : 'No users found. Start by adding some users.'}
            </p>
          </div>
        ) : (
          <>
            <div className="users-table">
              <div className="table-header">
                <span>S.No</span>
                <span>Full Name</span>
                <span>Email</span>
                <span>Phone</span>
                <span>Role</span>
                <span>Profile</span>
                <span>Actions</span>
              </div>
              <div className="table-body">
                {getPaginatedUsers().map((user, index) => (
                  <div key={user.id} className="table-row">
                    <span className="row-number">{(currentPage - 1) * recordsPerPage + index + 1}</span>
                    <span className="name-cell">{user.fullName}</span>
                    <span className="email-cell">{user.email}</span>
                    <span className="phone-cell">{user.phone}</span>
                    <span className="role-cell">
                      {editingUser?.id === user.id ? (
                        <CustomDropdown
                          options={roles.map(role => ({ value: role, label: role }))}
                          value={editingUser.role}
                          onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                          placeholder="Select Role"
                          className="edit-select"
                        />
                      ) : (
                        <span className="role-badge">{user.role}</span>
                      )}
                    </span>
                    <span className="profile-cell">
                      {editingUser?.id === user.id ? (
                        <CustomDropdown
                          options={profiles.map(profile => ({ value: profile, label: profile }))}
                          value={editingUser.profile}
                          onChange={(e) => setEditingUser({...editingUser, profile: e.target.value})}
                          placeholder="Select Profile"
                          className="edit-select"
                        />
                      ) : (
                        <span className="profile-badge">{user.profile}</span>
                      )}
                    </span>
                    <span className="actions-cell">
                      {editingUser?.id === user.id ? (
                        <div className="edit-actions">
                          <Button
                            variant="success"
                            size="small"
                            onClick={handleSaveEdit}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="small"
                            onClick={() => setEditingUser(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="user-actions">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => handleEdit(user)}
                            title="Edit user"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => setShowDeleteConfirm(user)}
                            title="Delete user"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            {getTotalPages() > 1 && (
              <div className="table-pagination">
                <div className="pagination-info">
                  Showing {(currentPage - 1) * recordsPerPage + 1} to {Math.min(currentPage * recordsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                </div>
                <div className="pagination-controls">
                  <Button
                    variant="outline-secondary"
                    size="small"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="page-numbers">
                    {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`page-number ${page === currentPage ? 'active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline-secondary"
                    size="small"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === getTotalPages()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="delete-confirm-modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete user <strong>{showDeleteConfirm.fullName}</strong>?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <Button
                variant="outline-secondary"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(showDeleteConfirm.id)}
              >
                Delete User
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageUsersSection