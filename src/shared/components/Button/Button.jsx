import './Button.css'

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const getButtonClasses = () => {
    const baseClasses = 'btn'
    const variantClass = `btn-${variant}`
    const sizeClass = `btn-${size}`
    const disabledClass = disabled || loading ? 'btn-disabled' : ''
    const loadingClass = loading ? 'btn-loading' : ''
    
    return `${baseClasses} ${variantClass} ${sizeClass} ${disabledClass} ${loadingClass} ${className}`.trim()
  }

  return (
    <button
      type={type}
      className={getButtonClasses()}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <span className="btn-spinner"></span>}
      {children}
    </button>
  )
}

export default Button