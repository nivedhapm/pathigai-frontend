import { useEffect, useRef } from 'react'
import { useTheme } from '../../../shared/contexts/ThemeContext'

const Recaptcha = () => {
  const { isDark } = useTheme()
  const recaptchaRef = useRef(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (recaptchaRef.current) {
      recaptchaRef.current.setAttribute('data-theme', isDark ? 'dark' : 'light')
    }
  }, [isDark])

  return (
    <div
      ref={recaptchaRef}
      className="g-recaptcha"
      data-sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      data-theme={isDark ? 'dark' : 'light'}
    ></div>
  )
}

export default Recaptcha
