import React, { createContext, useEffect, useState } from "react";
import { api, setAuthToken } from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ft_token");
    const storedUser = localStorage.getItem("ft_user");

    console.log("AuthContext init:", {
      hasToken: !!token,
      hasUser: !!storedUser,
    });

    if (token && storedUser) {
      try {
        setAuthToken(token);
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log("User restored from localStorage:", userData.email);
      } catch (error) {
        console.log("Error parsing stored user data:", error);
        // Dados corrompidos, limpar
        localStorage.removeItem("ft_token");
        localStorage.removeItem("ft_user");
        setAuthToken(null);
        setUser(null);
      }
    } else {
      console.log("No token or user found in localStorage");
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/users/login", { email, password });
      const { token, user } = res.data;

      localStorage.setItem("ft_token", token);
      localStorage.setItem("ft_user", JSON.stringify(user));

      setAuthToken(token);
      setUser(user);

      console.log("Login successful for:", user.email);
      return user;
    } catch (error) {
      console.error("Login error:", error);

      // Se for erro de rede, melhorar a mensagem
      if (
        error.isNetworkError ||
        error.code === "NETWORK_ERROR" ||
        !error.response
      ) {
        throw new Error(
          "Erro de conexão com o servidor. Verifique sua internet."
        );
      }

      // Para outros erros, manter o comportamento original
      throw error;
    }
  };

  const register = async (data) => {
    const res = await api.post("/users/register", data);
    return res.data;
  };
  const logout = () => {
    setAuthToken(null);

    localStorage.removeItem("ft_token");
    localStorage.removeItem("ft_user");

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
