import React, { createContext, useEffect, useState } from "react";
import { api, setAuthToken } from "../api/api"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("ft_token");
    const storedUser = localStorage.getItem("ft_user");
    if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        setAuthToken(token); 
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/users/login", { email, password });
    const { token, user } = res.data;
    
    localStorage.setItem("ft_token", token);
    localStorage.setItem("ft_user", JSON.stringify(user));
    
    setAuthToken(token); 
    
    setUser(user);
    return user;
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
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};