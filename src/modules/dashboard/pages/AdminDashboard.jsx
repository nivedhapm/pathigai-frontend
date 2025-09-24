import { useState, useEffect } from 'react'
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  Target,
  Calendar,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    teamMembers: 42,
    activeInterviews: 8,
    trainingSessions: 12,
    completionRate: 87
  })

  const [recentActivity] = useState([
    { 
      id: 1,
      type: 'interview_scheduled', 
      message: 'Interview scheduled for John Doe', 
      time: '1 hour ago',
      status: 'scheduled'
    },
    { 
      id: 2,
      type: 'user_added', 
      message: 'New trainer added to the team', 
      time: '4 hours ago',
      status: 'completed'
    },
    { 
      id: 3,
      type: 'training_completed', 
      message: 'React training module completed', 
      time: '1 day ago',
      status: 'completed'
    },
    { 
      id: 4,
      type: 'user_invitation', 
      message: 'Invitation sent to 3 new interview panelists', 
      time: '2 days ago',
      status: 'pending'
    }
  ])

  const [upcomingTasks] = useState([
    { id: 1, task: 'Review trainer applications', due: 'Today', priority: 'high' },
    { id: 2, task: 'Prepare interview schedule for next week', due: 'Tomorrow', priority: 'medium' },
    { id: 3, task: 'Update company training curriculum', due: 'This week', priority: 'low' },
    { id: 4, task: 'Monthly team performance review', due: 'Next week', priority: 'medium' }
  ])

  return (
    <div className="fade-in">
      {/* Welcome Section */}
      <div className="dashboard-card" style={{ marginBottom: '32px' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Admin Dashboard</h2>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              Manage your team and oversee operations
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
              Add Team Member
            </button>
            <button style={{ 
              padding: '8px 16px', 
              background: '#10b981', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Calendar size={16} />
              Schedule Interview
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-grid four-column" style={{ marginBottom: '32px' }}>
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Team Members</p>
              <h3 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>{stats.teamMembers}</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#059669', fontWeight: '500' }}>
                +5 this month
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
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Active Interviews</p>
              <h3 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>{stats.activeInterviews}</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#059669', fontWeight: '500' }}>
                +2 this week
              </p>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--green-bg)' }}>
              <UserCheck size={24} style={{ color: 'var(--green-color)' }} />
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Training Sessions</p>
              <h3 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>{stats.trainingSessions}</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#059669', fontWeight: '500' }}>
                +1 this month
              </p>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--purple-bg)' }}>
              <BookOpen size={24} style={{ color: 'var(--purple-color)' }} />
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Completion Rate</p>
              <h3 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>{stats.completionRate}%</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#059669', fontWeight: '500' }}>
                +5% improvement
              </p>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--orange-bg)' }}>
              <Target size={24} style={{ color: 'var(--orange-color)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="dashboard-grid two-column">
        {/* Recent Activity */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
            <button style={{ 
              padding: '6px 12px', 
              background: 'transparent', 
              border: '1px solid #e5e7eb', 
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer'
            }}>
              View All
            </button>
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
                    background: activity.status === 'completed' ? '#10b981' :
                               activity.status === 'scheduled' ? '#3b82f6' : '#f59e0b',
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
                  <span style={{ 
                    fontSize: '11px', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    background: activity.status === 'completed' ? '#d1fae5' :
                               activity.status === 'scheduled' ? '#dbeafe' : '#fef3c7',
                    color: activity.status === 'completed' ? '#065f46' :
                           activity.status === 'scheduled' ? '#1e40af' : '#92400e'
                  }}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Upcoming Tasks */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Upcoming Tasks</h3>
              <span style={{ 
                background: '#dbeafe', 
                color: '#1e40af', 
                padding: '2px 8px', 
                borderRadius: '12px', 
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {upcomingTasks.filter(task => task.priority === 'high').length} High Priority
              </span>
            </div>
            <div className="card-content">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {upcomingTasks.map((task) => (
                  <div key={task.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '8px',
                    borderRadius: '6px',
                    background: task.priority === 'high' ? '#fef2f2' : 
                               task.priority === 'medium' ? '#fff7ed' : '#f9fafb',
                    border: '1px solid #f3f4f6'
                  }}>
                    <Clock size={14} style={{ 
                      color: task.priority === 'high' ? '#dc2626' :
                             task.priority === 'medium' ? '#ea580c' : '#6b7280' 
                    }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: '500' }}>{task.task}</p>
                      <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>Due: {task.due}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
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
                  gap: '8px',
                  transition: 'all 0.2s ease'
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
                  <Users size={16} />
                  Manage Team
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
                  <BookOpen size={16} />
                  Training Programs
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
                  <TrendingUp size={16} />
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard