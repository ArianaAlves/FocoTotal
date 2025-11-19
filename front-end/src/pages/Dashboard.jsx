import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen">
      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-content">
            <div className="dashboard-top-row">
              <div className="rank-panel" aria-label="Ranking de Habilidades">
                <div className="rank-grid">
                  <div className="rank-item second">
                    <div className="rank-avatar" aria-hidden>
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=fernanda&mouth=smile&hairColor=0000FF&skinColor=F1C27D"
                        alt="Avatar de Fernando Araujo"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="name-chip">Fernando Araujo</div>
                    <div className="podium-card second">
                      <div className="medal">🥈</div>
                      <div className="podium-value">22</div>
                      <div className="podium-label">Habilidades</div>
                    </div>
                  </div>
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
                  <div className="rank-item third">
                    <div className="rank-avatar" aria-hidden>
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=robson-fun&mouth=twinkle&hairColor=7D3C98&skinColor=F1C27D"
                        alt="Avatar de Robson Campelo"
                        crossOrigin="anonymous"
                      />
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
                <h3>{t('dashboard.myTasks')}</h3>
                <p>
                  {t('dashboard.myTasksDesc')}
                </p>
                <Link to="/tasks" className="dashboard-link-btn">
                  {t('dashboard.accessTasks')} →
                </Link>
              </div>
            </div>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <div className="card-icon">👤</div>
                <h3>{t('dashboard.myProfile')}</h3>
                <p>{t('dashboard.myProfileDesc')}</p>
                <Link to="/profile" className="dashboard-link-btn">
                  {t('dashboard.viewProfile')} →
                </Link>
              </div>
              <div className="dashboard-card">
                <div className="card-icon">⚡</div>
                <h3>{t('dashboard.productivity')}</h3>
                <p>{t('dashboard.productivityDesc')}</p>
                <Link to="/productivity" className="dashboard-link-btn">
                  {t('dashboard.accessProductivity')} →
                </Link>
              </div>

              <div className="dashboard-card">
                <div className="card-icon">🎯</div>
                <h3>{t('dashboard.goals')}</h3>
                <p>{t('dashboard.goalsDesc')}</p>
                <Link to="/goals" className="dashboard-link-btn">
                  {t('dashboard.accessGoals')} →
                </Link>
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
