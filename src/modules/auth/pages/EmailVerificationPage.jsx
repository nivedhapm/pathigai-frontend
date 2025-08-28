import FloatingElements from '../../../components/common/FloatingElements/FloatingElements'
import ThemeToggle from '../../../components/common/ThemeToggle/ThemeToggle'
import LogoSection from '../../../components/common/LogoSection/LogoSection'
import Footer from '../../../components/common/Footer/Footer'
import OTPInput from '../../../components/ui/OTPInput/OTPInput'

const EmailVerificationPage = () => {
  const handleOTPComplete = (otp) => {
    console.log('OTP entered:', otp)
  }

  const handleVerify = (otp) => {
    console.log('Email OTP verified:', otp)
  }

  return (
    <>
      <FloatingElements />
      <ThemeToggle />

      <div className="container">
        <LogoSection />

        <div className="form-box">
          <h2>Verify your Signup</h2>
          <p className="subtitle">
            Enter the one-time password sent to
            <br /> person1@zohocorp.com
            <a href="#" className="change-link">change</a>
          </p>

          <OTPInput 
            length={6}
            onComplete={handleOTPComplete}
            onVerify={handleVerify}
          />
        </div>
      </div>

      <Footer />
    </>
  )
}

export default EmailVerificationPage