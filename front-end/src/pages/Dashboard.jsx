import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen">
      <main className="dashboard-main" data-theme={theme}>
        <div className="container">
          <div className="dashboard-content">
            <div className="dashboard-header">
              <h2 className="dashboard-title">Painel de Controle</h2>
              <p className="dashboard-subtitle">
                Organize seus projetos e tarefas de forma eficiente
              </p>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card featured">
                <div className="card-icon">📋</div>
                <h3>Minhas Tarefas</h3>
                <p>
                  Gerencie, organize e acompanhe o progresso de todas as suas
                  tarefas
                </p>
                <Link to="/tasks" className="dashboard-link-btn">
                  Acessar Tarefas →
                </Link>
              </div>

              <div className="dashboard-card">
                <div className="card-icon">👤</div>
                <h3>Meu Perfil</h3>
                <p>Veja e edite suas informações pessoais e estatísticas</p>
                <Link to="/profile" className="dashboard-link-btn">
                  Ver Perfil →
                </Link>
              </div>

              <div className="dashboard-card">
                <div className="card-icon">⚡</div>
                <h3>Produtividade</h3>
                <p>Monitore seu progresso e melhore sua produtividade</p>
                <p className="dashboard-stats">Em desenvolvimento</p>
              </div>

              <div className="dashboard-card">
                <div className="card-icon">🎯</div>
                <h3>Metas</h3>
                <p>Defina e acompanhe suas metas pessoais e profissionais</p>
                <p className="dashboard-stats">Em desenvolvimento</p>
              </div>
            </div>

            <div className="quick-start-section">
              <h3>🚀 Primeiros Passos</h3>
              <div className="quick-start-steps">
                <div className="step">
                  <span className="step-number">1</span>
                  <div>
                    <strong>Crie sua primeira tarefa</strong>
                    <p>Acesse "Minhas Tarefas" e crie uma nova tarefa</p>
                  </div>
                </div>
                <div className="step">
                  <span className="step-number">2</span>
                  <div>
                    <strong>Organize por prioridade</strong>
                    <p>Defina prioridades para melhor gerenciamento</p>
                  </div>
                </div>
                <div className="step">
                  <span className="step-number">3</span>
                  <div>
                    <strong>Acompanhe seu progresso</strong>
                    <p>
                      Marque tarefas como concluídas e veja suas estatísticas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
