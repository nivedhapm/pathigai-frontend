import { useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingElements from '../../../components/common/FloatingElements/FloatingElements'
import ThemeToggle from '../../../components/common/ThemeToggle/ThemeToggle'
import LogoSection from '../../../components/common/LogoSection/LogoSection'
import Footer from '../../../components/common/Footer/Footer'
import PasswordInput from '../../../components/ui/PasswordInput/PasswordInput'

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  const handlePasswordChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.newPassword || !formData.confirmPassword) {
      alert('Please fill in all fields')
      return
    }

    if (formData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    console.log('Password reset successful:', formData)
  }

  return (
    <>
      <FloatingElements />
      <ThemeToggle />

      <div className="container">
        <LogoSection />

        <div className="form-box">
          <h2>Reset Password</h2>
          <p className="subtitle">A one-time password will be sent to<br />+91 63******54</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="new-password">New Password</label>
            <PasswordInput
              id="new-password"
              placeholder="Enter new password"
              required
              value={formData.newPassword}
              onChange={handlePasswordChange('newPassword')}
            />

            <label htmlFor="confirm-password">Confirm Password</label>
            <PasswordInput
              id="confirm-password"
              placeholder="Enter confirm password"
              required
              value={formData.confirmPassword}
              onChange={handlePasswordChange('confirmPassword')}
            />

            <button type="submit">Submit</button>

            <div className="login-link">
              Remember your password? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default ResetPasswordPage