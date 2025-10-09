import { useState, useEffect } from 'react'

const TraineeDashboard = () => {
  return (
    <div className="fade-in">
      <div className="dashboard-card" style={{ marginBottom: '32px' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Trainee Dashboard</h2>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              Track your progress and continue learning
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TraineeDashboard