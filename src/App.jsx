import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './shared/contexts/ThemeContext'
import LandingPage from './modules/auth/pages/LandingPage'
import LoginPage from './modules/auth/pages/LoginPage'
import SignupPage from './modules/auth/pages/SignupPage'
import EmailVerificationPage from './modules/auth/pages/EmailVerificationPage'
import SMSVerificationPage from './modules/auth/pages/SMSVerificationPage'
import ForgotPasswordPage from './modules/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from './modules/auth/pages/ResetPasswordPage'
import CompanyInfoPage from './modules/auth/pages/CompanyInfoPage'
import ProtectedRoute from './shared/routes/ProtectedRoute'
import DashboardRouter from './modules/dashboard/DashboardRouter'
import Unauthorized from './modules/common/Unauthorized'
import SuperAdminDashboard from './modules/dashboard/superadmin/SuperAdminDashboard'
import AdminDashboard from './modules/dashboard/admin/AdminDashboard'
import SuperAdminUsersPage from './modules/dashboard/superadmin/SuperAdminUsersPage'
import ManagementDashboard from './modules/dashboard/management/ManagementDashboard'
import TrainerDashboard from './modules/dashboard/trainer/TrainerDashboard'
import InterviewPanelistDashboard from './modules/dashboard/interviewpanelist/InterviewPanelistDashboard'
import PlacementDashboard from './modules/dashboard/placement/PlacementDashboard'
import TraineeDashboard from './modules/dashboard/trainee/TraineeDashboard'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/email-verification" element={<EmailVerificationPage />} />
          <Route path="/sms-verification" element={<SMSVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/company-info" element={<CompanyInfoPage />} />

          {/* Unauthorized */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Dashboard entry point */}
          <Route path="/dashboard" element={<DashboardRouter />} />

          {/* Protected Dashboard routes */}
          <Route element={<ProtectedRoute allowedProfiles={["SUPER_ADMIN"]} />}> 
            <Route path="/dashboard/superadmin" element={<SuperAdminDashboard />} />
            <Route path="/dashboard/super-admin/users" element={<SuperAdminUsersPage />} />
            <Route path="/dashboard/user-management" element={<SuperAdminUsersPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedProfiles={["ADMIN"]} />}> 
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/user-management" element={<SuperAdminUsersPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedProfiles={["MANAGEMENT"]} />}> 
            <Route path="/dashboard/management" element={<ManagementDashboard />} />
            <Route path="/dashboard/user-management" element={<SuperAdminUsersPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedProfiles={["TRAINER"]} />}> 
            <Route path="/dashboard/trainer" element={<TrainerDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedProfiles={["INTERVIEW_PANELIST"]} />}> 
            <Route path="/dashboard/interview-panelist" element={<InterviewPanelistDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedProfiles={["PLACEMENT"]} />}> 
            <Route path="/dashboard/placement" element={<PlacementDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedProfiles={["TRAINEE"]} />}> 
            <Route path="/dashboard/trainee" element={<TraineeDashboard />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App