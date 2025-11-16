import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Verifica se há tema salvo no localStorage
    const savedTheme = localStorage.getItem("ft_theme");

    // Se não há tema salvo, usa o tema do sistema
    if (!savedTheme) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      return systemTheme;
    }

    return savedTheme;
  });

  useEffect(() => {
    // Aplica o tema no documento
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ft_theme", theme);
  }, [theme]);

  // Detecta mudanças no tema do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e) => {
      // Só muda automaticamente se o usuário não salvou uma preferência
      const savedTheme = localStorage.getItem("ft_theme");
      if (!savedTheme) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const setSystemTheme = () => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    setTheme(systemTheme);
    localStorage.removeItem("ft_theme"); // Remove preferência salva
  };

  const value = {
    theme,
    toggleTheme,
    setSystemTheme,
    isDark: theme === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
