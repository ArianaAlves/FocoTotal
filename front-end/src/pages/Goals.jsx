import React, { useState, useEffect, useContext } from "react";
import { api } from "../api/api";
import "../styles/Goals.css";
import { ThemeContext } from "../context/ThemeContext";

// Componente GoalItem removido - usando tabela simples

const GoalForm = ({ isVisible, onClose, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target: "",
    dueDate: "",
    category: "Outros",
  });

  const categories = [
    "Desenvolvimento",
    "Finanças",
    "Saúde",
    "Pessoal",
    "Outros",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      title: "",
      description: "",
      target: "",
      dueDate: "",
      category: "Outros",
    });
  };

  if (!isVisible) return null;

  return (
    <div className="goal-modal-overlay">
      <div className="goal-form-card">
        <h2>➕ Criar Nova Meta</h2>
        <form onSubmit={handleSubmit}>
          <label>Título:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Descrição:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <label>Meta (Valor Numérico):</label>
          <input
            type="number"
            name="target"
            value={formData.target}
            onChange={handleChange}
            min="1"
            required
          />

          <label>Data Limite:</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />

          <label>Categoria:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar Meta"}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Goals() {
  const { theme } = useContext(ThemeContext);
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [error, setError] = useState(null);
  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/goals");
      // A API retorna {goals: [...], message: "...", count: x, source: "..."}
      setGoals(response.data.goals || []);
      setError(null);
    } catch (error) {
      console.error("Erro ao carregar metas:", error);
      setError(
        "Não foi possível carregar as metas. Verifique o servidor, a rota /goals (GET) e o token de autenticação."
      );
      setGoals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (newGoalData) => {
    setIsSaving(true);
    setError(null);
    try {
      await api.post("/goals", {
        ...newGoalData,
        currentProgress: 0,
      });

      await fetchGoals();
      setIsFormVisible(false);
    } catch (error) {
      console.error("Erro ao criar meta:", error);
      setError(
        "Falha ao salvar a meta. Verifique a rota /goals (POST) e os dados enviados."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // 🗑️ FUNÇÃO: Deletar Meta
  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm("Tem certeza que deseja deletar esta meta?")) return;
    setIsLoading(true);
    try {
      await api.delete(`/goals/${goalId}`);
      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
      setError(null);
    } catch (error) {
      console.error("Erro ao deletar meta:", error);
      setError(
        "Falha ao deletar a meta. Verifique a rota /goals/:id (DELETE)."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProgress = async (goalId) => {
    const goalToUpdate = goals.find((g) => g.id === goalId);
    if (!goalToUpdate) return;

    const currentTarget = goalToUpdate.target;
    const currentProgress = goalToUpdate.currentProgress;

    const newProgressStr = window.prompt(
      `Atualizar Progresso para: ${goalToUpdate.title}\n` +
        `Meta: ${currentTarget} | Progresso Atual: ${currentProgress}\n\n` +
        `Insira o NOVO valor de progresso:`
    );

    if (newProgressStr === null || newProgressStr.trim() === "") return;

    const newProgress = Number(newProgressStr);
    if (isNaN(newProgress) || newProgress < currentProgress) {
      alert(
        `Valor inválido. O progresso deve ser um número maior ou igual ao atual (${currentProgress}).`
      );
      return;
    }

    setIsLoading(true);
    try {
      await api.put(`/goals/progress/${goalId}`, { newProgress });

      await fetchGoals();
      setError(null);
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
      setError(
        "Falha ao atualizar o progresso. Verifique a rota /goals/progress/:id (PUT)."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditGoal = (goal) => {
    console.log(
      `Função de edição para meta: ${goal.title} será implementada (pré-preencher GoalForm).`
    );
  };

  const totalGoals = goals.length;
  const goalsInProgress = goals.filter(
    (g) => g.status === "Em Progresso"
  ).length;
  const goalsCompleted = goals.filter((g) => g.status === "Concluída").length;
  const goalsLate = goals.filter((g) => g.status === "Atrasada").length;

  return (
    <div className={`goals-container ${theme}`}>
      <GoalForm
        isVisible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        onSave={handleCreateGoal}
        isSaving={isSaving}
      />

      <header className="goals-header">
        <div>
          <h1>🏆 Gestão de Metas</h1>
          <p>Visualize seu progresso a longo prazo e mantenha o foco.</p>
        </div>
        <button
          className="btn-add-goal"
          onClick={() => setIsFormVisible(true)}
          disabled={isLoading || isSaving}
        >
          ➕ Adicionar Nova Meta
        </button>
      </header>

      {error && <p className="error-message">{error}</p>}

      <section className="goals-kpi-grid">
        <div className="kpi-card">
          <h3>Total de Metas</h3>
          <p>{totalGoals}</p>
        </div>
        <div className="kpi-card">
          <h3>Em Progresso</h3>
          <p className="progress-value">{goalsInProgress}</p>
        </div>
        <div className="kpi-card">
          <h3>Concluídas</h3>
          <p className="success-value">{goalsCompleted}</p>
        </div>
        <div className="kpi-card">
          <h3>Atrasadas</h3>
          <p className="late-value">{goalsLate}</p>
        </div>
      </section>

      <h2 className="section-title">
        Metas Ativas ({goalsInProgress + goalsLate})
      </h2>

      {isLoading ? (
        <div className="loading-message">Carregando metas...</div>
      ) : (
        <section className="goals-table-section">
          {goals.length > 0 ? (
            <table className="goals-table-clean">
              <thead>
                <tr>
                  <th>Meta</th>
                  <th>Categoria</th>
                  <th>Progresso</th>
                  <th>Status</th>
                  <th>Vencimento</th>
                </tr>
              </thead>
              <tbody>
                {goals.map((goal) => {
                  const progressPercentage =
                    goal.target > 0
                      ? ((goal.currentProgress / goal.target) * 100).toFixed(0)
                      : 0;

                  let statusClass;
                  if (goal.status === "Atrasada") {
                    statusClass = "status-late";
                  } else if (goal.status === "Concluída") {
                    statusClass = "status-completed";
                  } else {
                    statusClass = "status-progress";
                  }

                  const isCompleted = goal.status === "Concluída";

                  return (
                    <tr key={goal.id} className="goal-row">
                      <td className="goal-info">
                        <div className="goal-title-desc">
                          <strong>{goal.title}</strong>
                          <span className="goal-desc">{goal.description}</span>
                        </div>
                      </td>
                      <td className="goal-category">{goal.category}</td>
                      <td className="goal-progress">
                        <div className="progress-container">
                          <div className="progress-bar-bg">
                            <div
                              className="progress-bar"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                          <span className="progress-text">
                            {goal.currentProgress}/{goal.target} (
                            {progressPercentage}%)
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`goal-status ${statusClass}`}>
                          {goal.status}
                        </span>
                      </td>
                      <td className="goal-due-date">
                        {new Date(goal.dueDate).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="no-goals-message">
              Você não tem metas ativas. Clique em "Adicionar Nova Meta" para
              começar!
            </p>
          )}
        </section>
      )}
    </div>
  );
}
