import { useState, useEffect } from 'react'
import { 
  Users, 
  TrendingUp, 
  Activity, 
  BarChart3, 
  Shield,
  Building,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Download
} from 'lucide-react'

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 248,
    activeCompanies: 15,
    systemHealth: 99.8,
    monthlyRevenue: 45200
  })

  const [recentActivity] = useState([
    { 
      id: 1,
      type: 'user_created', 
      message: 'New admin user created for TechCorp', 
      time: '2 hours ago',
      priority: 'normal'
    },
    { 
      id: 2,
      type: 'system_update', 
      message: 'System backup completed successfully', 
      time: '6 hours ago',
      priority: 'low'
    },
    { 
      id: 3,
      type: 'company_added', 
      message: 'New company registration: InnovateTech', 
      time: '1 day ago',
      priority: 'high'
    },
    { 
      id: 4,
      type: 'security_alert', 
      message: 'Multiple failed login attempts detected', 
      time: '2 days ago',
      priority: 'critical'
    }
  ])

  const [systemAlerts] = useState([
    { id: 1, message: 'Server CPU usage at 85%', severity: 'warning' },
    { id: 2, message: 'Database backup scheduled in 2 hours', severity: 'info' },
    { id: 3, message: 'SSL certificate expires in 30 days', severity: 'warning' }
  ])

  return (
    <div className="fade-in">
      {/* Welcome Section */}
      <div className="dashboard-card" style={{ marginBottom: '32px' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Super Admin Dashboard</h2>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              Complete system oversight and administration
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
              Add User
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
              <Download size={16} />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-grid four-column" style={{ marginBottom: '32px' }}>
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Total Users</p>
              <h3 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>{stats.totalUsers}</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#059669', fontWeight: '500' }}>
                +12% from last month
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
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Active Companies</p>
              <h3 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>{stats.activeCompanies}</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#059669', fontWeight: '500' }}>
                +3 new this month
              </p>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--green-bg)' }}>
              <Building size={24} style={{ color: 'var(--green-color)' }} />
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>System Health</p>
              <h3 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>{stats.systemHealth}%</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#059669', fontWeight: '500' }}>
                +0.2% uptime
              </p>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--purple-bg)' }}>
              <Activity size={24} style={{ color: 'var(--purple-color)' }} />
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Monthly Revenue</p>
              <h3 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>${(stats.monthlyRevenue / 1000).toFixed(1)}K</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#059669', fontWeight: '500' }}>
                +18% growth
              </p>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--orange-bg)' }}>
              <BarChart3 size={24} style={{ color: 'var(--orange-color)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="dashboard-grid two-column">
        {/* Recent Activity */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">System Activity</h3>
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
                  background: activity.priority === 'critical' ? '#fef2f2' : 
                             activity.priority === 'high' ? '#fff7ed' : '#f9fafb',
                  border: '1px solid #f3f4f6'
                }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: activity.priority === 'critical' ? '#dc2626' :
                               activity.priority === 'high' ? '#ea580c' :
                               activity.priority === 'normal' ? '#3b82f6' : '#6b7280',
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

        {/* System Alerts & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* System Alerts */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">System Alerts</h3>
              <span style={{ 
                background: '#fef3c7', 
                color: '#92400e', 
                padding: '2px 8px', 
                borderRadius: '12px', 
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {systemAlerts.length} Active
              </span>
            </div>
            <div className="card-content">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {systemAlerts.map((alert) => (
                  <div key={alert.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '8px',
                    borderRadius: '6px',
                    background: alert.severity === 'warning' ? '#fff7ed' : '#f0f9ff'
                  }}>
                    {alert.severity === 'warning' ? 
                      <AlertTriangle size={16} style={{ color: '#ea580c' }} /> :
                      <CheckCircle size={16} style={{ color: '#0891b2' }} />
                    }
                    <span style={{ fontSize: '14px', flex: 1 }}>{alert.message}</span>
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
                  <Users size={16} />
                  Manage Users
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
                  <Settings size={16} />
                  System Settings
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
                  View Analytics
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
                  <Shield size={16} />
                  Security Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard