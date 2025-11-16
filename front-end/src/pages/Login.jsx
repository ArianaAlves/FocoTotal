import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = email.trim() !== "" && password.trim() !== "" && isEmailValid;

  const handle = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setError("Por favor, preencha email e senha corretamente");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await login(email, password);
      nav("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-bg-decoration auth-bg-decoration-1"></div>
      <div className="auth-bg-decoration auth-bg-decoration-2"></div>
      
      <div className="auth-form-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Bem-vindo</h1>
            <p className="auth-subtitle">Acesse sua conta FocoTotal</p>
          </div>

          <form onSubmit={handle} className="auth-form">
            {error && <div className="auth-error">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="email">
                E-mail <span className="required">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => setTouched({ ...touched, email: true })}
                className={touched.email && !isEmailValid ? "input-error" : ""}
              />
              {touched.email && !isEmailValid && email.trim() !== "" && (
                <span className="error-text">Email inválido</span>
              )}
              {touched.email && email.trim() === "" && (
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
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  className={touched.password && password.trim() === "" ? "input-error" : ""}
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
              {touched.password && password.trim() === "" && (
                <span className="error-text">Senha é obrigatória</span>
              )}
            </div>

            <button 
              type="submit" 
              className="auth-submit-btn" 
              disabled={loading || !isFormValid}
            >
              <span>{loading ? "⏳ Entrando..." : "↗ Entrar"}</span>
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              Não tem conta?{" "}
              <Link to="/register" className="auth-footer-link">
                Cadastre-se aqui
              </Link>
            </p>
          </div>

          <div className="auth-info">
            Use suas credenciais para acessar o painel de controle do FocoTotal
          </div>
        </div>
      </div>
    </div>
  );
}
