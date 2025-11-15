import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const nav = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      nav("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <div className="auth-container">
      <div className="auth-bg-decoration auth-bg-decoration-1"></div>
      <div className="auth-bg-decoration auth-bg-decoration-2"></div>
      
      <div className="auth-form-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Criar Conta</h1>
            <p className="auth-subtitle">Comece a organizar suas tarefas</p>
          </div>

          <form onSubmit={handle} className="auth-form">
            {error && <div className="auth-error">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="name">Nome Completo</label>
              <input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={form.name}
                onChange={e => handleChange("name", e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={e => handleChange("email", e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => handleChange("password", e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="auth-submit-btn" 
              disabled={loading}
            >
              <span>{loading ? "⏳ Cadastrando..." : "✓ Criar Conta"}</span>
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              Já tem conta?{" "}
              <Link to="/login" className="auth-footer-link">
                Faça login aqui
              </Link>
            </p>
          </div>

          <div className="auth-info">
            Seus dados são protegidos e nunca serão compartilhados com terceiros
          </div>
        </div>
      </div>
    </div>
  );
}
