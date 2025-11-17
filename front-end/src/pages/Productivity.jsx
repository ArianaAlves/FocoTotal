import React, { useState, useEffect, useContext } from 'react';
import { api } from '../api/api';
import '../styles/Productivity.css'; 
import { ThemeContext } from "../context/ThemeContext"; 

const FocusChart = () => {
    const illustrativeData = [
        {"day": "Seg", "hours": 3.0},
        {"day": "Ter", "hours": 4.5},
        {"day": "Qua", "hours": 6.0},
        {"day": "Qui", "hours": 2.0},
        {"day": "Sex", "hours": 7.5},
        {"day": "Sáb", "hours": 1.0},
        {"day": "Dom", "hours": 5.0}
    ];
    const maxDataHour = illustrativeData.reduce(
        (max, item) => Math.max(max, item.hours),
        0
    );

    const MAX_HOURS_DISPLAY = maxDataHour > 0 ? maxDataHour * 1.2 : 1;
    
    return (
        <div className="mock-chart-card">
            <h3>Gráfico de Foco Semanal </h3>
            <div className="chart-bars-divider"></div> 
            <div className="chart-bars-container">
                {illustrativeData.map((item, index) => { 
                    const barHeight = Math.max(0, (item.hours / MAX_HOURS_DISPLAY) * 100);
                    
                    return (
                        <div key={index} className="chart-bar-item">
                            <span className="bar-value">
                                {item.hours > 0 ? `${item.hours.toFixed(1)}h` : ''}
                            </span>
                            <div 
                                className="chart-bar" 
                                style={{ 
                                    height: `${barHeight}%`,
                                    minHeight: item.hours > 0 ? '10px' : '0px'
                                }} 
                            ></div>
                            <span className="day-label">{item.day}</span>
                        </div>
                    );
                })}
            </div>
            <p style={{ marginTop: '1rem', color: 'var(--color-sub-heading)' }}>
                Eixo Y Máximo: {MAX_HOURS_DISPLAY.toFixed(1)} horas. 
            </p>
        </div>
    );
};

const StatCard = ({ label, value, icon, subValue, highlightClass = '' }) => (
  <div className={`stat-card ${highlightClass}`}>
    <div className="stat-card-header">
      <span>{icon}</span>
      <h3>{label}</h3>
    </div>
    <p>{value}</p>
    {subValue && <p>{subValue}</p>}
  </div>
);

const ProgressItem = ({ label, value, total, color }) => {
    const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
    return (
        <div>
            <div className="progress-header">
                <span>{label}</span>
                <span>{value} ({percentage}%)</span>
            </div>
            <div className="progress-bar-bg">
                <div 
                    className={`progress-bar ${color}`} 
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                ></div>
            </div>
        </div>
    );
};

const initialStats = {
    pendente: 0,
    concluida: 0,
    atrasada: 0,
    nearestTaskTitle: "Nenhuma",
    nearestTaskDate: null, 
    totalTasks: 0,
};

export default function Productivity() {
    const { theme } = useContext(ThemeContext);

    const [stats, setStats] = useState(initialStats);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductivityData = async () => {
            setIsLoading(true);
            try {
                const statsResponse = await api.get('/tasks/statistics');
                api.get('/tasks/focus-trend').catch(err => {
                    console.warn("Aviso: Falha ao carregar dados de foco semanal.", err);
                });
                
                const statsData = statsResponse.data;
                setStats({
                    pendente: statsData.pendente || 0,
                    concluida: statsData.concluida || 0,
                    atrasada: statsData.atrasada || 0,
                    nearestTaskTitle: statsData.nearestTaskTitle || "Nenhuma",
                    nearestTaskDate: statsData.nearestTaskDate, 
                    totalTasks: statsData.totalTasks,
                });
                
            } catch (err) {
                console.error("Erro fatal ao buscar estatísticas principais:", err);
                const errorMessage = err.response?.status === 401 
                    ? "Sessão expirada. Por favor, faça login novamente." 
                    : err.message || "Falha ao buscar as estatísticas.";
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductivityData();
    }, []); 
        
    const totalTasks = stats.totalTasks;
    const successRate = totalTasks > 0 ? ((stats.concluida / totalTasks) * 100).toFixed(0) + '%' : '0%';
    
    const formatDate = (date) => {
      if (!date) return "Em breve";
      const d = new Date(date);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }); 
    };

    const kpis = [
        { label: "Taxa de Sucesso", value: successRate, icon: "✅", subValue: `Total de ${totalTasks} tarefas` },
        { 
          label: "Próxima Tarefa", 
          value: stats.nearestTaskTitle.length > 20 ? stats.nearestTaskTitle.substring(0, 20) + '...' : stats.nearestTaskTitle, 
          icon: "🚀", 
          subValue: `Vence ${formatDate(stats.nearestTaskDate)}` 
        },
        { label: "Tarefas Atrasadas", value: stats.atrasada, icon: "🚨", subValue: "Resolva urgentemente!", highlightClass: 'highlight-error' },
        { label: "Tarefas Pendentes", value: stats.pendente, icon: "⏳", subValue: `Mais ${stats.atrasada} atrasadas` },
    ];
    const taskDistribution = {
        completed: stats.concluida,
        pending: stats.pendente + stats.atrasada, 
    }

    if (isLoading) {
        return (
          <div className="loading-screen">
            <div className="spinner"></div>
            Carregando dados de produtividade...
          </div>
        );
    }

    if (error) {
        return (
          <div className="error-screen">
            <h1 className="error-title">Dashboard de Produtividade</h1>
            <div className="error-card">
              <p className="error-message">❌ Erro de Autenticação/API: {error}</p>
              <p className="error-tip">Certifique-se de que o backend está rodando e de que você fez login recentemente.</p>
            </div>
          </div>
        );
    }
    
    return (
        <div className={`productivity-container ${theme}`}>
          <header className="productivity-header">
            <h1>
              Dashboard de Produtividade
            </h1>
            
          </header>

          <section className="productivity-section">
            <h2 className="section-title">Visão Geral</h2>
            <div className="kpi-grid">
              {kpis.map((kpi, index) => (
                <StatCard key={index} {...kpi} />
              ))}
            </div>
          </section>

          <div className="layout-grid grid-small">
            
           
            <section className="chart-section">
              <h2 className="section-title">Tempo Focado Semanal</h2>
              <FocusChart />
            </section>

            <section className="analysis-section">
              <h2 className="section-title">Distribuição de Tarefas</h2>
              <div className="analysis-card">
                
                <h3>Status Atual (Total: {totalTasks})</h3>
                <div className="progress-group">
                    <ProgressItem 
                        label="✅ Concluídas" 
                        value={taskDistribution.completed} 
                        total={totalTasks} 
                        color="bg-green-500" 
                    />
                    <ProgressItem 
                        label="⏳ Não Concluídas (Pendente + Atrasada)" 
                        value={taskDistribution.pending} 
                        total={totalTasks} 
                        color="bg-red-500" 
                    /> 
                </div>

                <div className="priority-section">
                    <h3>Dados Adicionais (Futuro)</h3>
                    <p>Prioridade Alta: <span className="high">0</span></p>
                    <p>Tempo Focado Médio: <span className="low">0h</span></p>
                </div>
              </div>
            </section>
          </div>

          <section className="suggestion-card">
              <h2>💡 Sugestão de Produtividade</h2>
              <p>
                Sua **Taxa de Sucesso é de {successRate}**. Mantenha o foco! 
                Sua próxima tarefa urgente é **{stats.nearestTaskTitle}**, que vence em **{formatDate(stats.nearestTaskDate)}**.
              </p>
          </section>
        </div>
    );
}