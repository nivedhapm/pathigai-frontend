import React from 'react'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import logo from '../../../assets/logo.svg'

const TopNav = () => {
  return (
    <div className="top-nav">
      <div className="nav-logo">
        <img src={logo} alt="PathIGAI Logo" />
        <h3>PATHIGAI</h3>
      </div>
      <ThemeToggle />
    </div>
  )
}

export default TopNav
