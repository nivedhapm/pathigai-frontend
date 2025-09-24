import { useState } from 'react'

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
        <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
      </span>
    </div>
  )
}

export default PasswordInput