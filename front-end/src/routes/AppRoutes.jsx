import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Tasks from "../pages/Tasks";
import Profile from "../pages/Profile";
import Productivity from "../pages/Productivity"; 
import Goals from "../pages/Goals";
import { AuthContext } from "../context/AuthContext";


const Private = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
      <Route path="/tasks" element={<Private><Tasks /></Private>} />
      <Route path="/profile" element={<Private><Profile /></Private>} />
      
      <Route path="/productivity" element={<Private><Productivity /></Private>} /> 
      <Route path="/goals" element={<Private><Goals /></Private>} />
    </Routes>
  );
}