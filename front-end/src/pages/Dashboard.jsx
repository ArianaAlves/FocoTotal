import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="p-6">
        <h2 className="text-xl mb-4">Painel</h2>
        <p>Bem-vindo ao FocoTotal. Use o menu para gerenciar seus agendamentos / tarefas.</p>
        <div className="mt-6">
          <Link to="/tasks" className="inline-block px-4 py-2 bg-primary text-white rounded">Minhas Tarefas</Link>
        </div>
      </main>
    </div>
  );
}
