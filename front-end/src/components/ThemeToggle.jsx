import React from "react";
import { useTheme } from "../context/ThemeContext";
import "../styles/ThemeToggle.css";

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={`Alternar para tema ${isDark ? "claro" : "escuro"}`}
      aria-label={`Alternar para tema ${isDark ? "claro" : "escuro"}`}
    >
      <div className="toggle-track">
        <div className="toggle-thumb">
          <span className="icon">{isDark ? "☀️" : "🌙"}</span>
        </div>
      </div>
    </button>
  );
}
