import { Outlet } from 'react-router-dom'
import '../styles/dashboard.css'

const ContentArea = ({ sidebarCollapsed, children }) => {
  return (
    <div 
      className={`dashboard-content-area ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
    >
      <div className="dashboard-content">
        {/* If using React Router with nested routes, use Outlet */}
        {children || <Outlet />}
      </div>
    </div>
  )
}

export default ContentArea