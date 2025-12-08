import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FloatingElements, ThemeToggle, TopNav, LogoSection, Footer } from '../../../components/layout'
import { CustomDropdown } from '../../../components/ui'
import authService from '../../../shared/services/authService'
import userService from '../../../shared/services/userService'
import { useToast } from '../../../components/ui/Toast/ToastProvider'
import logo from '../../../assets/logo.svg'

const CompanyInfoPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { showSuccess } = useToast()
  
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

      // Store user information and tokens if provided
      if (response.jwtToken) {
        authService.setTokens({
          authToken: response.jwtToken,
          refreshToken: response.refreshToken
        })
        
        // Store user data
        localStorage.setItem('user', JSON.stringify({
          userId: response.userId || userId,
          email: email,
          fullName: fullName
        }))
      }

      // Get user profile to determine dashboard route
      const userProfile = userService.getSimulatedUserProfile() // TODO: Get from API
      const dashboardRoute = userService.getDashboardRoute(userProfile.primaryProfile)

      // Show success message and redirect to dashboard
      showSuccess('Account created successfully! Welcome to Pathigai!')
      navigate(dashboardRoute, { replace: true })

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
            <CustomDropdown
              options={[
                { value: 'Education', label: 'Education' },
                { value: 'Technology', label: 'Technology' },
                { value: 'Healthcare', label: 'Healthcare' },
                { value: 'Finance', label: 'Finance' },
                { value: 'Manufacturing', label: 'Manufacturing' },
                { value: 'Retail', label: 'Retail' },
                { value: 'Fashion', label: 'Fashion' },
                { value: 'Construction', label: 'Construction' },
                { value: 'IT', label: 'IT' },
                { value: 'Food and Beverage', label: 'Food and Beverage' },
                { value: 'Consulting', label: 'Consulting' },
                { value: 'Non-Profit', label: 'Non-Profit' },
                { value: 'Government', label: 'Government' },
                { value: 'Other', label: 'Other' }
              ]}
              value={formData.industry}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  industry: e.target.value
                }))
              }}
              placeholder="Select Industry"
              name="industry"
            />

            <label htmlFor="companyWebsite">Company Website*</label>
            <input
              type="url"
              id="companyWebsite"
              placeholder="Enter your company website/url"
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
