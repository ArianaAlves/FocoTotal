import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = async (e) => {
    e.preventDefault();
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handle} className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4 text-primary dark:text-primaryLight">Entrar</h1>
        {error && <div className="mb-3 text-red-500">{error}</div>}
        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded" required />
        <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded" required />
        <button className="w-full py-2 bg-primary text-white rounded" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <p className="mt-4 text-sm text-muted">
          Não tem conta? <Link to="/register" className="text-primary">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}
