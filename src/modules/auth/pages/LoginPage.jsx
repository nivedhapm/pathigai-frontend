import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FloatingElements from '../../../components/common/FloatingElements/FloatingElements'
import ThemeToggle from '../../../components/common/ThemeToggle/ThemeToggle'
import LogoSection from '../../../components/common/LogoSection/LogoSection'
import Footer from '../../../components/common/Footer/Footer'
import PasswordInput from '../../../components/ui/PasswordInput/PasswordInput'
import Recaptcha from '../../../components/ui/Recaptcha/Recaptcha'
import authService from '../../../shared/services/authService'

const LoginPage = () => {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState('')

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handlePasswordChange = (e) => {
    setFormData(prev => ({
      ...prev,
      password: e.target.value
    }))
  }

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      
      // Step 1: Authenticate credentials
      const authResponse = await authService.login({
        ...formData,
        recaptchaToken
      })

      // Navigate to verification page
      navigate('/sms-verification', {
        state: {
          userId: authResponse.userId,
          email: formData.email,
          phone: authResponse.phone,
          maskedPhone: authService.maskPhone(authResponse.phone),
          maskedEmail: authService.maskEmail(formData.email),
          nextStep: authResponse.nextStep,
          context: 'LOGIN',
          isTemporaryPassword: authResponse.temporaryPassword,
          fullName: authResponse.fullName
        }
      })

    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <FloatingElements />
      <ThemeToggle />

      <div className="container">
        <LogoSection />

        <div className="form-box">
          <h2>Login</h2>
          <p className="subtitle">to track, train, transform<br />with Pathigai</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              placeholder="person1@zoho.com"
              required
              value={formData.email}
              onChange={handleInputChange}
            />

            <label htmlFor="password">Password*</label>
            <PasswordInput
              id="password"
              placeholder="* * * * * * * *"
              required
              value={formData.password}
              onChange={handlePasswordChange}
            />

            <div className="forgot">
              <Link to="/reset-password">Forgot Password?</Link>
            </div>

            <Recaptcha onVerify={handleRecaptchaChange} />

            {error && (
              <div style={{ color: '#ff4d4f', marginTop: '8px' }}>{error}</div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="login-link">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default LoginPage