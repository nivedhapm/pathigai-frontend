import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FloatingElements, ThemeToggle, LogoSection, Footer } from '../../../components/layout'
import { PasswordInput, PasswordStrengthIndicator, Recaptcha } from '../../../components/ui'
import authService from '../../../shared/services/authService'

const SignupPage = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState('')

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }))
  }

  const handlePasswordChange = (e) => {
    setFormData(prev => ({
      ...prev,
      password: e.target.value
    }))
  }

  const handleConfirmPasswordChange = (e) => {
    setFormData(prev => ({
      ...prev,
      confirmPassword: e.target.value
    }))
  }

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token)
  }

  const validatePasswordStrength = (password) => {
    if (!password) return false;
    
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    return score >= 3; // At least medium strength required
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!validatePasswordStrength(formData.password)) {
      setError('Password must be at least medium strength')
      return
    }

    if (!formData.terms) {
      setError('Please accept the Terms & Conditions')
      return
    }

    try {
      setLoading(true)
      
      const authResponse = await authService.signup({
        ...formData,
        recaptchaToken
      })

      navigate('/sms-verification', {
        state: {
          userId: authResponse.userId,
          email: formData.email,
          phone: authService.normalizePhone(formData.phone),
          maskedPhone: authService.maskPhone(formData.phone),
          nextStep: authResponse.nextStep,
          context: 'SIGNUP',
          fullName: formData.fullName,
          developmentMode: true // Add this flag
        }
      })

    } catch (err) {
      console.error('Signup error:', err)
      setError(
        err?.message ||
        err?.data?.message ||
        err?.response?.data?.message ||
        'Signup failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page">
      <FloatingElements />
      <ThemeToggle />

      <main className="container">
        <LogoSection />

        <div className="form-box">
          <h2>Signup</h2>
          <p className="subtitle">Start your journey with Pathigai</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="fullName">Name*</label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              required
              value={formData.fullName}
              onChange={handleInputChange}
            />

            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              required
              value={formData.email}
              onChange={handleInputChange}
            />

            <label htmlFor="phone">Phone*</label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
              required
              value={formData.phone}
              onChange={handleInputChange}
            />

            <label htmlFor="password">Password*</label>
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handlePasswordChange}
            />
            
            <PasswordStrengthIndicator password={formData.password} />

            <label htmlFor="confirmPassword">Confirm Password*</label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Re-enter your password"
              required
              value={formData.confirmPassword}
              onChange={handleConfirmPasswordChange}
            />

            <div className="checkbox">
              <input
                type="checkbox"
                id="terms"
                required
                checked={formData.terms}
                onChange={handleInputChange}
              />
              <label htmlFor="terms">I agree to the <a href="#">Terms & Conditions</a></label>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <Recaptcha onVerify={handleRecaptchaChange} />
            </div>

            {error && (
              <div style={{ color: '#ff4d4f', marginTop: '8px' }}>{error}</div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>

            <div className="login-link">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SignupPage
