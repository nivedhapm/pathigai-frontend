import { useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingElements from '../../../components/common/FloatingElements/FloatingElements'
import ThemeToggle from '../../../components/common/ThemeToggle/ThemeToggle'
import LogoSection from '../../../components/common/LogoSection/LogoSection'
import Footer from '../../../components/common/Footer/Footer'
import PasswordInput from '../../../components/ui/PasswordInput/PasswordInput'
import Recaptcha from '../../../components/ui/Recaptcha/Recaptcha'

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false
  })

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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Signup form submitted:', formData)
  }

  return (
    <>
      <FloatingElements />
      <ThemeToggle />

      <main className="container">
        <LogoSection />

        <div className="form-box">
          <h2>Signup</h2>
          <p className="subtitle">Start your journey with Pathigai</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="fullname">Name*</label>
            <input
              type="text"
              id="fullname"
              placeholder="John Doe"
              required
              value={formData.fullname}
              onChange={handleInputChange}
            />

            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              placeholder="person1@zoho.com"
              required
              value={formData.email}
              onChange={handleInputChange}
            />

            <label htmlFor="phone">Phone*</label>
            <input
              type="tel"
              id="phone"
              placeholder="98765 43210"
              required
              value={formData.phone}
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

            <label htmlFor="confirmPassword">Confirm Password*</label>
            <PasswordInput
              id="confirmPassword"
              placeholder="********"
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

            <Recaptcha />

            <button type="submit">Sign Up</button>

            <div className="login-link">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default SignupPage
