import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Tasks from "../pages/Tasks";
import Profile from "../pages/Profile";
import Productivity from "../pages/Productivity";
import Goals from "../pages/Goals";
import Ranking from "../pages/Ranking";
import { AuthContext } from "../context/AuthContext";

const Private = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Debug: verificar estado
  console.log("Private component:", {
    user: !!user,
    loading,
    hasToken: !!localStorage.getItem("ft_token"),
  });

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "1.1rem",
          color: "var(--text-light)",
        }}
      >
        Carregando...
      </div>
    );
  }

  // Se não há usuário mas há token, ainda está carregando
  const hasToken = localStorage.getItem("ft_token");
  if (!user && hasToken) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "1.1rem",
          color: "var(--text-light)",
        }}
      >
        Autenticando...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <Private>
            <Dashboard />
          </Private>
        }
      />
      <Route
        path="/tasks"
        element={
          <Private>
            <Tasks />
          </Private>
        }
      />
      <Route
        path="/profile"
        element={
          <Private>
            <Profile />
          </Private>
        }
      />
      <Route
        path="/productivity"
        element={
          <Private>
            <Productivity />
          </Private>
        }
      />
      <Route
        path="/goals"
        element={
          <Private>
            <Goals />
          </Private>
        }
      />
      <Route
        path="/ranking"
        element={
          <Private>
            <Ranking />
          </Private>
        }
      />
    </Routes>
  );
}