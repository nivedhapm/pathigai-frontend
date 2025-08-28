import { useState } from 'react'
import FloatingElements from '../../../components/common/FloatingElements/FloatingElements'
import ThemeToggle from '../../../components/common/ThemeToggle/ThemeToggle'
import Footer from '../../../components/common/Footer/Footer'

const CompanyInfoPage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    portalName: '',
    industry: ''
  })

  const handleInputChange = (e) => {
    const { id, value } = e.target
    
    // Map hyphenated IDs to camelCase state properties
    const fieldMap = {
      'company-name': 'companyName',
      'website': 'website',
      'portal-name': 'portalName',
      'industry': 'industry'
    }
    
    const fieldName = fieldMap[id] || id
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.companyName || !formData.website || !formData.portalName || !formData.industry) {
      alert('Please fill in all required fields')
      return
    }

    const urlPattern = /^https?:\/\/.+/
    if (!urlPattern.test(formData.website)) {
      alert('Please enter a valid website URL (starting with http:// or https://)')
      return
    }

    console.log('Created account successfully, Welcome to Pathigai!', formData)
    
    // Here you would typically send the data to your backend
    // For now, just show success message
    alert('Created account successfully, Welcome to Pathigai!')
  }

  const industries = [
    { value: '', label: 'Select Industry' },
    { value: 'it-services', label: 'IT Services' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'finance', label: 'Finance' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'telecommunications', label: 'Telecommunications' },
    { value: 'media', label: 'Media & Entertainment' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'construction', label: 'Construction' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'logistics', label: 'Logistics & Transportation' },
    { value: 'government', label: 'Government' },
    { value: 'non-profit', label: 'Non-Profit' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div className="company-info-page">
      <FloatingElements />
      
      {/* Top Nav */}
      <div className="top-nav">
        <div className="nav-logo">
          <img src="/logo.svg" alt="Pathigai Logo" />
          <h3>PATHIGAI</h3>
        </div>
        <ThemeToggle isCompanyPage={true} />
      </div>

      {/* Main Content */}
      <main className="container">
        <div className="form-box">
          <h2>Company Information</h2>
          <p className="subtitle">Help us setup your account</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="company-name">Company Name*</label>
            <input
              type="text"
              id="company-name"
              placeholder="ABC"
              required
              value={formData.companyName}
              onChange={handleInputChange}
            />

            <label htmlFor="website">Company Website*</label>
            <input
              type="url"
              id="website"
              placeholder="https://www.abc.com"
              required
              value={formData.website}
              onChange={handleInputChange}
            />

            <label htmlFor="portal-name">Portal Name*</label>
            <input
              type="text"
              id="portal-name"
              placeholder="abcTrainees"
              required
              value={formData.portalName}
              onChange={handleInputChange}
            />

            <label htmlFor="industry">Industry*</label>
            <select
              id="industry"
              required
              value={formData.industry}
              onChange={handleInputChange}
            >
              {industries.map(industry => (
                <option key={industry.value} value={industry.value}>
                  {industry.label}
                </option>
              ))}
            </select>

            <button type="submit" style={{ width: '150px' }}>Save</button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CompanyInfoPage