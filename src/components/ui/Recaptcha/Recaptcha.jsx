

import { useEffect, useRef, useState, useCallback } from 'react'

const Recaptcha = ({ onVerify }) => {
  const recaptchaRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [widgetId, setWidgetId] = useState(null)
  const onVerifyRef = useRef(onVerify)

  // Update the ref when onVerify changes, but don't trigger re-render
  useEffect(() => {
    onVerifyRef.current = onVerify
  }, [onVerify])

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="recaptcha"]')
    
    if (!existingScript && !window.grecaptcha) {
      const script = document.createElement('script')
      script.src = 'https://www.google.com/recaptcha/api.js'
      script.async = true
      script.defer = true
      script.onload = () => setLoaded(true)
      document.head.appendChild(script)
    } else if (window.grecaptcha) {
      setLoaded(true)
    }

    return () => {
      // Clean up widget if it exists
      if (widgetId !== null && window.grecaptcha && window.grecaptcha.reset) {
        try {
          window.grecaptcha.reset(widgetId)
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }
  }, []) // Remove widgetId dependency

  useEffect(() => {
    if (loaded && recaptchaRef.current && window.grecaptcha && window.grecaptcha.render && widgetId === null) {
      try {        
        const id = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: '6LfD6L4rAAAAAKOD7OfmeRIWrIqd988nN2DpFFfQ',
          theme: 'light',
          callback: (token) => {
            if (onVerifyRef.current) onVerifyRef.current(token)
          },
          'expired-callback': () => {
            if (onVerifyRef.current) onVerifyRef.current('')
          }
        })
        setWidgetId(id)
      } catch (e) {
        console.error('reCAPTCHA render error:', e)
      }
    }
  }, [loaded, widgetId]) // Only depend on loaded and widgetId

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'flex-start', 
      alignItems: 'center',
      margin: '10px 0'
    }}>
      <div ref={recaptchaRef} style={{ 
        transform: window.innerWidth <= 768 ? 'scale(0.75)' : 'scale(0.85)', 
        transformOrigin: 'left center' 
      }}></div>
    </div>
  )
}

export default Recaptcha
