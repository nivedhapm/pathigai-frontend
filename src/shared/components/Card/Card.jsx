import './Card.css'

const Card = ({
  children,
  className = '',
  variant = 'default',
  padding = 'default',
  onClick,
  ...props
}) => {
  const getCardClasses = () => {
    const baseClasses = 'pathigai-card'
    const variantClass = `pathigai-card-${variant}`
    const paddingClass = `pathigai-card-padding-${padding}`
    
    return `${baseClasses} ${variantClass} ${paddingClass} ${className}`.trim()
  }

  return (
    <div
      className={getCardClasses()}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card