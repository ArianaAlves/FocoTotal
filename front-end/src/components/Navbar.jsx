import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import LanguageSelector from "./LanguageSelector";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cycleTheme, getThemeIcon, getThemeLabel } =
    useContext(ThemeContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

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
          <Link to="/ranking" className="nav-link">
            🏆 Ranking
          </Link>
          <Link to="/profile" className="nav-link">
            👤 Perfil
          </Link>
        </div>

        <div className="navbar-user">
          <span className="user-name">{user.name}</span>
          <LanguageSelector />
          <button
            className="btn-theme-toggle"
            onClick={cycleTheme}
            title={getThemeLabel()}
            aria-label={getThemeLabel()}
          >
            {getThemeIcon()}
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            {t('navigation.logout')}
          </button>
        </div>
      </div>
    </nav>
  );
}
