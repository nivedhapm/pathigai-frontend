import { useEffect } from 'react'

const FloatingElements = () => {
  const icons = [
    'fas fa-book',
    'fas fa-notebook',
    'fas fa-clock',
    'fas fa-trophy',
    'fas fa-pen',
    'fas fa-pencil-alt',
    'fas fa-graduation-cap',
    'fas fa-globe'
  ]

  useEffect(() => {
    // Load Font Awesome if not already loaded
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css'
      document.head.appendChild(link)
    }
  }, [])

  return (
    <div className="floating-elements">
      {icons.map((iconClass, index) => (
        <div key={index} className="floating-element">
          <i className={iconClass}></i>
        </div>
      ))}
    </div>
  )
}

export default FloatingElements