import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FloatingElements from '../../../components/common/FloatingElements/FloatingElements'
import ThemeToggle from '../../../components/common/ThemeToggle/ThemeToggle'
import TopNav from '../../../components/common/TopNav/TopNav'
import LogoSection from '../../../components/common/LogoSection/LogoSection'
import Footer from '../../../components/common/Footer/Footer'
import authService from '../../../shared/services/authService'
import logo from '../../../assets/logo.svg'

const CompanyInfoPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const { userId, email, fullName } = location.state || {}

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companyWebsite: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.companyName || !formData.industry) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)

      const companyData = {
        userId,
        companyName: formData.companyName.trim(),
        industry: formData.industry.trim(),
        companyWebsite: formData.companyWebsite.trim() || null
      }

      const response = await authService.completeSignup(companyData)

      // Show success message and redirect to login
      alert('Account created successfully! Welcome to Pathigai!')
      // navigate('/login')
      // Don't navigate to login page here anymore

    } catch (err) {
      console.error('Company creation error:', err)
      setError(err.message || 'Failed to create company. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Redirect if no required data
  if (!userId) {
    navigate('/signup')
    return null
  }

  return (
    <div className="verification-page company-info-page">
      <FloatingElements />
      <TopNav />

      <div className="container">
        <div className="form-box">
          <div className="form-logo-section">
            <img src={logo} alt="PathIGAI Logo" />
            <h3>PATHIGAI</h3>
          </div>
          
          <h2>Company Information</h2>
          <p className="subtitle">
            Complete your profile by adding company details
          </p>


          <form onSubmit={handleSubmit}>
            <label htmlFor="companyName">Company Name*</label>
            <input
              type="text"
              id="companyName"
              placeholder="Enter your company name"
              required
              value={formData.companyName}
              onChange={handleInputChange}
            />

            <label htmlFor="industry">Industry*</label>
            <select
              id="industry"
              required
              value={formData.industry}
              onChange={handleInputChange}
            >
              <option value="">Select Industry</option>
              <option value="Education">Education</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail">Retail</option>
              <option value="Retail">Fashion</option>
              <option value="Retail">Construction</option>
              <option value="Retail">IT</option>
              <option value="Consulting">Consulting</option>
              <option value="Non-Profit">Non-Profit</option>
              <option value="Government">Government</option>
              <option value="Other">Other</option>
            </select>

            <label htmlFor="companyWebsite">Company Website*</label>
            <input
              type="url"
              id="companyWebsite"
              placeholder="https://www.company.com"
              value={formData.companyWebsite}
              onChange={handleInputChange}
            />

            {error && (
              <div style={{ color: '#ff4d4f', marginTop: '8px' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Complete Setup'}
            </button>
            
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CompanyInfoPage