import { Link } from 'react-router-dom'
import { FloatingElements, ThemeToggle, LogoSection, Footer } from '../../../components/layout'
import { Users, Target, TrendingUp, Shield, Calendar, Briefcase, ClipboardCheck, Award, AlignCenter } from 'lucide-react'
import './LandingPage.css'

const LandingPage = () => {
  const steps = [
    {
      icon: <Target size={28} />,
      step: 1,
      title: "Sign Up & Create Organization",
      description: "Get an account for your organization and set up your company profile to get started."
    },
    {
      icon: <Users size={28} />,
      step: 2,
      title: "Add Your Team Members",
      description: "Add your employees including trainers, HRs, managers, and the trainees to your organization."
    },
    {
      icon: <Award size={28} />,
      step: 3,
      title: "Create Training Batches",
      description: "Create a batch and add trainees, applicants, and HRs to organize your training program effectively."
    },
    {
      icon: <Calendar size={28} />,
      step: 4,
      title: "Schedule & Manage Interviews",
      description: "Schedule interviews to select the perfect applicants for your internship and manage the entire interview process."
    },
    {
      icon: <TrendingUp size={28} />,
      step: 5,
      title: "Track Performance",
      description: "Track the performance of trainees with comprehensive dashboards. Trainees can see their own performance while trainers and HRs can monitor all trainees."
    },
    {
      icon: <Briefcase size={28} />,
      step: 6,
      title: "Approve & Place Candidates",
      description: "Approve and move completed trainees for job recruitment placement opportunities and track which trainee got into which team or company."
    }
  ]

  return (
    <>
      <FloatingElements />
      <ThemeToggle />
      
      <div className="container landing-container">
        <LogoSection />
        
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">Track, Train, Transform</h1>
          <p className="hero-subtitle">
            Empower your organization with comprehensive student internship progress tracking, 
            seamless trainer management, and data-driven insights for excellence.
          </p>
          <div className="landing-buttons">
            <Link to="/signup" className="btn-primary">Signup</Link>
            <Link to="/login" className="btn-secondary">Login</Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2 className="section-title">Why Choose Pathigai?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Users size={32} />
              </div>
              <h3>Student Progress Tracking</h3>
              <p>Monitor and analyze student performance with real-time progress tracking and comprehensive assessments.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Target size={32} />
              </div>
              <h3>Trainer Management</h3>
              <p>Streamline trainer operations, assign courses, and manage teaching schedules efficiently.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Performance Analytics</h3>
              <p>Gain actionable insights with detailed analytics and reporting on student and organizational performance.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={32} />
              </div>
              <h3>Role-Based Access</h3>
              <p>Secure multi-level access control for admins, trainers, management, and trainees.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Calendar size={32} />
              </div>
              <h3>Interview Scheduling</h3>
              <p>Schedule and manage interviews seamlessly to select the perfect candidates for your programs.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Briefcase size={32} />
              </div>
              <h3>Placement Support</h3>
              <p>Connect trainees with placement opportunities and track interview progress seamlessly.</p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="how-it-works-section">
          <h2 className="section-title">How It Works</h2>
          <p className="section-description">
            Get started with Pathigai in six simple steps
          </p>
          
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-icon-wrapper">
                  {step.icon}
                </div>
                <div className="step-content">
                  <div className="step-number">Step {step.step}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="step-connector"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <h2>Ready to Transform Your Training Programs?</h2>
          <p>Join organizations that trust Pathigai for their training management needs.</p>
          <Link to="/signup" className="btn-primary btn-large">Get Started</Link>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default LandingPage
