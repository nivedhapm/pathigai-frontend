import { useState, useRef, useEffect } from 'react'

const OTPInput = ({ length = 6, onComplete, onVerify }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''))
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const handleChange = (index, e) => {
    const value = e.target.value
    if (!/^\d$/.test(value) && value !== '') return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every(digit => digit !== '')) {
      onComplete?.(newOtp.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text')
    const digits = pasteData.replace(/\D/g, '').slice(0, length)
    
    const newOtp = [...otp]
    digits.split('').forEach((digit, i) => {
      if (i < length) newOtp[i] = digit
    })
    setOtp(newOtp)

    if (digits.length > 0) {
      const focusIndex = Math.min(digits.length, length - 1)
      inputRefs.current[focusIndex]?.focus()
    }

    if (newOtp.every(digit => digit !== '')) {
      onComplete?.(newOtp.join(''))
    }
  }

  const handleResend = () => {
    setOtp(new Array(length).fill(''))
    setTimeLeft(60)
    setCanResend(false)
    inputRefs.current[0]?.focus()
    console.log('Resending OTP...')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const otpValue = otp.join('')
    if (otpValue.length !== length) {
      alert('Please enter the complete verification code')
      return
    }
    onVerify?.(otpValue)
  }

  const isComplete = otp.every(digit => digit !== '')

  return (
    <form onSubmit={handleSubmit}>
      <div className="otp-container">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            className="otp-input"
            maxLength="1"
            pattern="\d"
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
          />
        ))}
      </div>

      <div className="resend-timer">
        {canResend ? (
          <span 
            className="resend-link" 
            onClick={handleResend}
            style={{ cursor: 'pointer' }}
          >
            Resend OTP
          </span>
        ) : (
          `Resend OTP in ${timeLeft}s`
        )}
      </div>

      <button 
        type="submit" 
        disabled={!isComplete}
        className={isComplete ? 'enabled' : ''}
      >
        Verify
      </button>

      <div className="login-link">
        Didn't receive the code? <span className="resend-link-placeholder"></span>
      </div>
    </form>
  )
}

export default OTPInput