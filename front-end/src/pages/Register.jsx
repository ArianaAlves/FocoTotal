import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const nav = useNavigate();
  const [error, setError] = useState("");

  const handle = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      nav("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handle} className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4 text-primary dark:text-primaryLight">Criar conta</h1>
        {error && <div className="mb-3 text-red-500">{error}</div>}
        <input placeholder="Nome" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
          className="w-full mb-3 p-2 border rounded" required />
        <input type="email" placeholder="E-mail" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
          className="w-full mb-3 p-2 border rounded" required />
        <input type="password" placeholder="Senha" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
          className="w-full mb-4 p-2 border rounded" required />
        <button className="w-full py-2 bg-primary text-white rounded">Cadastrar</button>
      </form>
    </div>
  );
}
