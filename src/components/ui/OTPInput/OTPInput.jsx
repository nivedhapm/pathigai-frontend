import { useState, useRef, useEffect, useCallback } from 'react'

const OTPInput = ({ 
  length = 6, 
  onComplete, 
  onVerify, 
  loading = false,
  disabled = false,
  autoSubmit = true,
  showBackButton = false,
  onBack
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  useEffect(() => {
    if (!loading) {
      setSubmitted(false)
    }
  }, [loading])

  useEffect(() => {
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus()
    }
  }, [disabled])

  useEffect(() => {
    if (disabled) {
      setOtp(new Array(length).fill(''))
      setSubmitted(false)
    }
  }, [disabled, length])

  const handleChange = (index, e) => {
    if (disabled || loading) return

    const value = e.target.value
    if (!/^\d$/.test(value) && value !== '') return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
      setFocusedIndex(index + 1)
    }

    if (newOtp.every(digit => digit !== '') && !submitted && autoSubmit) {
      setSubmitted(true)
      onComplete?.(newOtp.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    if (disabled || loading) return

    if (e.key === 'Backspace') {
      e.preventDefault()
      const newOtp = [...otp]
      
      if (otp[index]) {
        newOtp[index] = ''
        setOtp(newOtp)
      } else if (index > 0) {
        newOtp[index - 1] = ''
        setOtp(newOtp)
        inputRefs.current[index - 1]?.focus()
        setFocusedIndex(index - 1)
      }
    } else if (e.key === 'Delete') {
      e.preventDefault()
      const newOtp = [...otp]
      newOtp[index] = ''
      setOtp(newOtp)
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
      setFocusedIndex(index - 1)
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
      setFocusedIndex(index + 1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handlePaste = useCallback((e) => {
    if (disabled || loading) return

    e.preventDefault()
    const pasteData = e.clipboardData.getData('text')
    const digits = pasteData.replace(/\D/g, '').slice(0, length)
    
    if (digits.length === 0) return

    const newOtp = new Array(length).fill('')
    digits.split('').forEach((digit, i) => {
      if (i < length) newOtp[i] = digit
    })
    setOtp(newOtp)

    const focusIndex = Math.min(digits.length, length - 1)
    inputRefs.current[focusIndex]?.focus()
    setFocusedIndex(focusIndex)

    if (digits.length === length && autoSubmit && !submitted) {
      setSubmitted(true)
      onComplete?.(newOtp.join(''))
    }
  }, [disabled, loading, length, autoSubmit, submitted, onComplete])

  const handleFocus = (index) => {
    setFocusedIndex(index)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (disabled || submitted || loading) return

    const otpValue = otp.join('')
    if (otpValue.length !== length) {
      const firstEmpty = otp.findIndex(digit => digit === '')
      if (firstEmpty !== -1) {
        inputRefs.current[firstEmpty]?.focus()
        setFocusedIndex(firstEmpty)
      }
      return
    }

    setSubmitted(true)
    onVerify?.(otpValue)
  }

  const clearOTP = useCallback(() => {
    setOtp(new Array(length).fill(''))
    setSubmitted(false)
    inputRefs.current[0]?.focus()
    setFocusedIndex(0)
  }, [length])

  const isComplete = otp.every(digit => digit !== '')

  return (
    <form onSubmit={handleSubmit}>
      <div className="otp-container" style={{ 
        display: 'flex', 
        gap: '8px', 
        justifyContent: 'center',
        marginBottom: '20px',
        transform: window.innerWidth <= 768 ? 'scale(0.8)' : 'scale(1)',
        transformOrigin: 'center'
      }}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            className="otp-input"
            maxLength="1"
            pattern="\d"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            onFocus={() => handleFocus(index)}
            disabled={disabled || loading}
            style={{
              width: '48px',
              height: '48px',
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: '600',
              border: `2px solid ${
                disabled ? '#e9ecef' :
                focusedIndex === index ? '#8FB7C6' :
                digit ? '#6BA3B5' : '#ced4da'
              }`,
              borderRadius: '8px',
              backgroundColor: disabled ? '#f8f9fa' : '#ffffff',
              color: disabled ? '#6c757d' : '#212529',
              cursor: disabled ? 'not-allowed' : 'text',
              transition: 'all 0.2s ease',
              outline: 'none',
              boxShadow: `0 2px 4px ${
                disabled ? 'rgba(0,0,0,0.1)' :
                focusedIndex === index ? 'rgba(143, 183, 198, 0.3)' :
                digit ? 'rgba(107, 163, 181, 0.2)' : 'rgba(0,0,0,0.1)'
              }`
            }}
          />
        ))}
      </div>

      {/* Verify Button - full width */}
      <button 
        type="submit" 
        disabled={!isComplete || loading || submitted || disabled}
        style={{
          width: '100%',
          backgroundColor: (!isComplete || loading || submitted || disabled) ? '#6c757d' : '#8FB7C6',
          color: '#ffffff',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: (!isComplete || loading || submitted || disabled) ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          minHeight: '48px'
        }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{
              width: '16px',
              height: '16px',
              border: '2px solid #ffffff',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></span>
            Verifying...
          </span>
        ) : (
          'Verify'
        )}
      </button>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  )
}

export default OTPInput