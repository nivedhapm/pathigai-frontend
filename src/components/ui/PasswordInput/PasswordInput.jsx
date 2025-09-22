import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const PasswordInput = ({ id, placeholder, required = false, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="password-wrapper">
      <input
        type={showPassword ? "text" : "password"}
        id={id}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
      />
      <span className="toggle-password" onClick={togglePassword}>
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </span>
    </div>
  )
}

export default PasswordInput