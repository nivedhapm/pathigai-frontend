import { useState } from 'react'

const ManagementDashboard = () => {
  return (
    <div className="fade-in">
      <div className="dashboard-card" style={{ marginBottom: '32px' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Management Dashboard</h2>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                Oversee operations and manage resources effectively
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagementDashboard