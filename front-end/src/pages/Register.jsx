import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const nav = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isNameValid = form.name.trim().length >= 3;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isPasswordValid = form.password.trim().length >= 6;
  const isFormValid = isNameValid && isEmailValid && isPasswordValid;

  const handle = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setError("Por favor, preencha todos os campos corretamente");
      return;
    }

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
              <label htmlFor="name">
                Nome Completo <span className="required">*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={form.name}
                onChange={e => handleChange("name", e.target.value)}
                onBlur={() => setTouched({ ...touched, name: true })}
                className={touched.name && !isNameValid ? "input-error" : ""}
              />
              {touched.name && !isNameValid && form.name.trim() !== "" && (
                <span className="error-text">Nome deve ter pelo menos 3 caracteres</span>
              )}
              {touched.name && form.name.trim() === "" && (
                <span className="error-text">Nome é obrigatório</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                E-mail <span className="required">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={e => handleChange("email", e.target.value)}
                onBlur={() => setTouched({ ...touched, email: true })}
                className={touched.email && !isEmailValid ? "input-error" : ""}
              />
              {touched.email && !isEmailValid && form.email.trim() !== "" && (
                <span className="error-text">Email inválido</span>
              )}
              {touched.email && form.email.trim() === "" && (
                <span className="error-text">Email é obrigatório</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Senha <span className="required">*</span>
              </label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => handleChange("password", e.target.value)}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  className={touched.password && !isPasswordValid ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {touched.password && !isPasswordValid && form.password.trim() !== "" && (
                <span className="error-text">Senha deve ter pelo menos 6 caracteres</span>
              )}
              {touched.password && form.password.trim() === "" && (
                <span className="error-text">Senha é obrigatória</span>
              )}
            </div>

            <button 
              type="submit" 
              className="auth-submit-btn" 
              disabled={loading || !isFormValid}
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
