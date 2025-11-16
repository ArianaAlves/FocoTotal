import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-content">
            {/* Top row: Rank panel (left) + Featured card (right) */}
            <div className="dashboard-top-row">
              <div className="rank-panel" aria-label="Ranking de Habilidades">
                <div className="rank-grid">
                  {/* Segundo lugar */}
                  <div className="rank-item second">
                    <div className="rank-avatar" aria-hidden>
                      <img src="https://api.dicebear.com/7.x/big-smile/svg?seed=fernanda" alt="Avatar de Fernanda Araujo" crossOrigin="anonymous" />
                    </div>
                    <div className="name-chip">Fernanda Araujo</div>
                    <div className="podium-card second">
                      <div className="medal">🥈</div>
                      <div className="podium-value">22</div>
                      <div className="podium-label">Habilidades</div>
                    </div>
                  </div>

                  {/* Primeiro lugar */}
                  <div className="rank-item first">
                    <div className="rank-avatar" aria-hidden>
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=karine&mouth=smile&hairColor=000000&skinColor=8D5524"
                        alt="Avatar de Karine Andrade"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="name-chip">Karine Andrade</div>
                    <div className="podium-card first">
                      <div className="medal">🏆</div>
                      <div className="podium-value">24</div>
                      <div className="podium-label">Habilidades</div>
                    </div>
                  </div>

                  {/* Terceiro lugar */}
                  <div className="rank-item third">
                    <div className="rank-avatar" aria-hidden>
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=robson-fun&mouth=twinkle&hairColor=7D3C98&skinColor=F1C27D" alt="Avatar de Robson Campelo" crossOrigin="anonymous" />
                    </div>
                    <div className="name-chip">Robson Campelo</div>
                    <div className="podium-card third">
                      <div className="medal">🥉</div>
                      <div className="podium-value">21</div>
                      <div className="podium-label">Habilidades</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-card featured">
                <div className="card-icon">📋</div>
                <h3>Minhas Tarefas</h3>
                <p>Gerencie, organize e acompanhe o progresso de todas as suas tarefas</p>
                <Link to="/tasks" className="dashboard-link-btn">
                  Acessar Tarefas →
                </Link>
              </div>
            </div>

            {/* Demais cards */}
            <div className="dashboard-grid">
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
                    <p>Marque tarefas como concluídas e veja suas estatísticas</p>
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
