import { Link } from 'react-router-dom'
import FloatingElements from '../../../components/common/FloatingElements/FloatingElements'
import ThemeToggle from '../../../components/common/ThemeToggle/ThemeToggle'
import LogoSection from '../../../components/common/LogoSection/LogoSection'
import Footer from '../../../components/common/Footer/Footer'

const LandingPage = () => {
  return (
    <>
      <FloatingElements />
      <ThemeToggle />
      
      <div className="container landing-container">
        <LogoSection />
        
        <div className="landing-buttons">
          <Link to="/signup" className="btn-primary">Sign up</Link>
          <Link to="/login" className="btn-secondary">Login</Link>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default LandingPage