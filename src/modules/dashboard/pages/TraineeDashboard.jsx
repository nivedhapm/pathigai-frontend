import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  BookOpen, 
  CheckCircle, 
  Award, 
  Calendar,
  Play,
  Target,
  Clock,
  BarChart3
} from 'lucide-react'

const TraineeDashboard = () => {
  const [stats, setStats] = useState({
    overallProgress: 72,
    completedModules: 8,
    totalModules: 12,
    upcomingSessions: 3,
    interviewReadiness: 85
  })

  const [recentProgress] = useState([
    { 
      id: 1,
      type: 'module_completed', 
      message: 'Completed React Hooks module', 
      time: '1 hour ago',
      score: 95
    },
    { 
      id: 2,
      type: 'assignment_submitted', 
      message: 'Submitted portfolio project', 
      time: '3 hours ago',
      score: null
    },
    { 
      id: 3,
      type: 'feedback_received', 
      message: 'Received feedback on API project', 
      time: '1 day ago',
      score: 88
    },
    { 
      id: 4,
      type: 'skill_assessment', 
      message: 'JavaScript fundamentals assessment', 
      time: '2 days ago',
      score: 92
    }
  ])

  const [upcomingSchedule] = useState([
    { id: 1, title: 'React State Management', date: 'Today', time: '2:00 PM', type: 'training' },
    { id: 2, title: 'Code Review Session', date: 'Tomorrow', time: '10:00 AM', type: 'review' },
    { id: 3, title: 'Mock Interview', date: 'Thursday', time: '3:00 PM', type: 'interview' },
    { id: 4, title: 'Project Presentation', date: 'Friday', time: '11:00 AM', type: 'presentation' }
  ])

  const [learningPath] = useState([
    { id: 1, title: 'JavaScript Fundamentals', completed: true, score: 92 },
    { id: 2, title: 'React Basics', completed: true, score: 88 },
    { id: 3, title: 'React Hooks', completed: true, score: 95 },
    { id: 4, title: 'State Management', completed: false, progress: 60 },
    { id: 5, title: 'API Integration', completed: false, progress: 30 },
    { id: 6, title: 'Testing', completed: false, progress: 0 }
  ])

  return (
    <div className="fade-in">
      {/* Welcome Section */}
      <div className="dashboard-card" style={{ marginBottom: '32px' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">My Learning Dashboard</h2>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              Track your progress and continue learning
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
              <Play size={16} />
              Continue Learning
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
              View Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-grid four-column" style={{ marginBottom: '32px' }}>
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Overall Progress</p>
              <h3 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>{stats.overallProgress}%</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#059669', fontWeight: '500' }}>
                +8% this week
              </p>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--blue-bg)' }}>
              <TrendingUp size={24} style={{ color: 'var(--blue-color)' }} />
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Completed Modules</p>
              <h3 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>{stats.completedModules}/{stats.totalModules}</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#059669', fontWeight: '500' }}>
                +1 this week
              </p>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--green-bg)' }}>
              <CheckCircle size={24} style={{ color: 'var(--green-color)' }} />
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Upcoming Sessions</p>
              <h3 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>{stats.upcomingSessions}</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                This week
              </p>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--purple-bg)' }}>
              <Calendar size={24} style={{ color: 'var(--purple-color)' }} />
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Interview Readiness</p>
              <h3 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>{stats.interviewReadiness}%</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#059669', fontWeight: '500' }}>
                +15% improvement
              </p>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--orange-bg)' }}>
              <Award size={24} style={{ color: 'var(--orange-color)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="dashboard-grid two-column">
        {/* Learning Progress */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Learning Path</h3>
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
              {learningPath.map((module) => (
                <div key={module.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: module.completed ? '#f0fdf4' : '#f9fafb',
                  border: '1px solid #f3f4f6'
                }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    background: module.completed ? '#10b981' : '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {module.completed ? 
                      <CheckCircle size={14} style={{ color: 'white' }} /> :
                      <span style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600' }}>
                        {module.id}
                      </span>
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500' }}>
                      {module.title}
                    </p>
                    {module.completed ? (
                      <p style={{ margin: '0', fontSize: '12px', color: '#059669' }}>
                        Score: {module.score}%
                      </p>
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '4px', 
                        background: '#e5e7eb', 
                        borderRadius: '2px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${module.progress}%`, 
                          height: '100%', 
                          background: '#3b82f6',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    )}
                  </div>
                  {!module.completed && (
                    <button style={{ 
                      padding: '4px 8px', 
                      background: '#3b82f6', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>
                      Continue
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity & Schedule */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Recent Activity */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
            </div>
            <div className="card-content">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentProgress.slice(0, 3).map((activity) => (
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
                      background: activity.score ? '#10b981' : '#3b82f6',
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
                    {activity.score && (
                      <span style={{ 
                        fontSize: '12px', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        background: '#d1fae5',
                        color: '#065f46',
                        fontWeight: '500'
                      }}>
                        {activity.score}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Upcoming Schedule</h3>
            </div>
            <div className="card-content">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {upcomingSchedule.map((event) => (
                  <div key={event.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '8px',
                    borderRadius: '6px',
                    background: event.type === 'interview' ? '#fef2f2' : 
                               event.type === 'review' ? '#fff7ed' : '#f0f9ff',
                    border: '1px solid #f3f4f6'
                  }}>
                    <Clock size={14} style={{ 
                      color: event.type === 'interview' ? '#dc2626' :
                             event.type === 'review' ? '#ea580c' : '#3b82f6'
                    }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: '500' }}>{event.title}</p>
                      <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
                        {event.date} at {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TraineeDashboard