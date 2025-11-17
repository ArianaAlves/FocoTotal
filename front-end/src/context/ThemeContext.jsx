import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem("themeMode");
    return saved || "system"; 
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      let shouldBeDark = false;

      if (themeMode === "dark") {
        shouldBeDark = true;
      } else if (themeMode === "light") {
        shouldBeDark = false;
      } else {
        shouldBeDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
      }

      setIsDark(shouldBeDark);

      const root = document.documentElement;
      if (shouldBeDark) {
        root.classList.add("dark-mode");
        root.setAttribute("data-theme", "dark");
      } else {
        root.classList.remove("dark-mode");
        root.setAttribute("data-theme", "light");
      }
    };

    updateTheme();

    localStorage.setItem("themeMode", themeMode);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (themeMode === "system") {
        updateTheme();
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [themeMode]);

  const cycleTheme = () => {
    setThemeMode((current) => {
      if (current === "light") return "dark";
      if (current === "dark") return "system";
      return "light";
    });
  };

  const getThemeIcon = () => {
    if (themeMode === "light") {
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="5"
            stroke="#ffffff"
            strokeWidth="2"
            fill="#ffffff"
          />
          <path
            d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    }
    if (themeMode === "dark") {
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79Z"
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth="2"
          />
        </svg>
      );
    }
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="4"
          width="20"
          height="14"
          rx="2"
          stroke="#ffffff"
          strokeWidth="2"
          fill="none"
        />
        <rect x="8" y="21" width="8" height="2" rx="1" fill="#ffffff" />
        <path d="M12 17V21" stroke="#ffffff" strokeWidth="2" />
      </svg>
    );
  };

  const getThemeLabel = () => {
    if (themeMode === "light") return "Modo claro ativo - Clique para escuro";
    if (themeMode === "dark") return "Modo escuro ativo - Clique para sistema";
    return "Modo sistema ativo - Clique para claro";
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        themeMode,
        cycleTheme,
        getThemeIcon,
        getThemeLabel,
        toggleTheme: cycleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
