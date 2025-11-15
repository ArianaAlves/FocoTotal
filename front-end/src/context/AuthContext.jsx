import React, { createContext, useEffect, useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("ft_token");
    const storedUser = localStorage.getItem("ft_user");
    if (token && storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/users/login", { email, password });
    // backend returns { token, user } assumed
    const { token, user } = res.data;
    localStorage.setItem("ft_token", token);
    localStorage.setItem("ft_user", JSON.stringify(user));
    setUser(user);
    return user;
  };

  const register = async (data) => {
    const res = await api.post("/users/register", data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("ft_token");
    localStorage.removeItem("ft_user");
    setUser(null);
    nav("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
