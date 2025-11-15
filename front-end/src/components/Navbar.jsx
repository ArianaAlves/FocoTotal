import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/Navbar.css'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) return null

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🎯 Foco Total
        </Link>

        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link">
            📊 Dashboard
          </Link>
          <Link to="/tasks" className="nav-link">
            📋 Tarefas
          </Link>
          <Link to="/profile" className="nav-link">
            👤 Perfil
          </Link>
        </div>

        <div className="navbar-user">
          <span className="user-name">{user.name}</span>
          <button className="btn-logout" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>
    </nav>
  )
}
