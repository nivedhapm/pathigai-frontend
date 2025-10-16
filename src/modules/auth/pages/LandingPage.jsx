import { Link } from 'react-router-dom'
import { FloatingElements, ThemeToggle, LogoSection, Footer } from '../../../components/layout'

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
