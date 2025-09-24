import { useState } from 'react'
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  Award,
  Calendar,
  Plus,
  BarChart3,
  Clock
} from 'lucide-react'

const ManagementDashboard = () => {
  const [stats] = useState({
    activeTrainees: 28,
    scheduledInterviews: 6,
    trainingProgress: 74,
    placementRate: 92
  })

  const [recentActivity] = useState([
    { 
      id: 1,
      message: 'Sarah completed JavaScript module', 
      time: '30 minutes ago',
      type: 'progress'
    },
    { 
      id: 2,
      message: 'Positive feedback for candidate Mike', 
      time: '2 hours ago',
      type: 'feedback'
    },
    { 
      id: 3,
      message: 'React training batch milestone reached', 
      time: '5 hours ago',
      type: 'milestone'
    }
  ])

  return (
    <div className="fade-in">
      <div className="dashboard-card" style={{ marginBottom: '32px' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Management Dashboard</h2>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              Oversee operations and track progress
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ 
              padding: '8px 16px', 
              background: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Plus size={16} />
              Add Trainee
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-grid four-column" style={{ marginBottom: '32px' }}>
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Active Trainees</p>
              <h3 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>{stats.activeTrainees}</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#059669', fontWeight: '500' }}>
                +3 this month
              </p>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--blue-bg)' }}>
              <Users size={24} style={{ color: 'var(--blue-color)' }} />
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Scheduled Interviews</p>
              <h3 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>{stats.scheduledInterviews}</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#059669', fontWeight: '500' }}>
                +1 this week
              </p>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--green-bg)' }}>
              <Calendar size={24} style={{ color: 'var(--green-color)' }} />
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Training Progress</p>
              <h3 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>{stats.trainingProgress}%</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#059669', fontWeight: '500' }}>
                +8% this month
              </p>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--purple-bg)' }}>
              <TrendingUp size={24} style={{ color: 'var(--purple-color)' }} />
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Placement Rate</p>
              <h3 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>{stats.placementRate}%</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#059669', fontWeight: '500' }}>
                +5% improvement
              </p>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--orange-bg)' }}>
              <Award size={24} style={{ color: 'var(--orange-color)' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid two-column">
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>
          <div className="card-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivity.map((activity) => (
                <div key={activity.id} style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: '#f9fafb',
                  border: '1px solid #f3f4f6'
                }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: '#3b82f6',
                    marginTop: '6px',
                    flexShrink: 0
                  }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500' }}>
                      {activity.message}
                    </p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-content">
            <div style={{ display: 'grid', gap: '8px' }}>
              <button style={{ 
                padding: '12px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Users size={16} />
                Manage Trainees
              </button>
              <button style={{ 
                padding: '12px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <UserCheck size={16} />
                Schedule Interview
              </button>
              <button style={{ 
                padding: '12px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <BarChart3 size={16} />
                View Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagementDashboard