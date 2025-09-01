import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './shared/contexts/ThemeContext'
import LandingPage from './modules/auth/pages/LandingPage'
import LoginPage from './modules/auth/pages/LoginPage'
import SignupPage from './modules/auth/pages/SignupPage'
import EmailVerificationPage from './modules/auth/pages/EmailVerificationPage'
import SMSVerificationPage from './modules/auth/pages/SMSVerificationPage'
import ResetPasswordPage from './modules/auth/pages/ResetPasswordPage'
import CompanyInfoPage from './modules/auth/pages/CompanyInfoPage'

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
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/company-info" element={<CompanyInfoPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App