import { useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingElements from '../../../components/common/FloatingElements/FloatingElements'
import ThemeToggle from '../../../components/common/ThemeToggle/ThemeToggle'
import LogoSection from '../../../components/common/LogoSection/LogoSection'
import Footer from '../../../components/common/Footer/Footer'
import PasswordInput from '../../../components/ui/PasswordInput/PasswordInput'
import Recaptcha from '../../../components/ui/Recaptcha/Recaptcha'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login form submitted:', formData)
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
              placeholder="********"
              required
              value={formData.password}
              onChange={handlePasswordChange}
            />

            <div className="forgot">
              <a href="#">Forgot Password?</a>
            </div>

            <Recaptcha />

            <button type="submit">Login</button>

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
