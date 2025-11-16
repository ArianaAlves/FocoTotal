import { useEffect, useState } from "react";
import { api } from "../api/api"; 
import "../styles/Tasks.css";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [titleSearch, setTitleSearch] = useState("");
  const [statusSearch, setStatusSearch] = useState("");

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "PENDENTE",
    priority: "ALTA",
  });

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.dueDate) {
      alert("Título e Data de Vencimento são obrigatórios!");
      return;
    }
    try {
      const response = await api.post("/tasks", newTask);
      console.log("Tarefa criada com sucesso:", response.data);
      setNewTask({ title: "", description: "", dueDate: "", status: "PENDENTE", priority: "ALTA" });
      fetchTasks();
      alert("Tarefa criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      if (error.response) {
        console.error("Detalhes do erro:", error.response.data);
        alert(`Erro ao criar tarefa: ${error.response.data.message || JSON.stringify(error.response.data)}`);
      } else {
        alert("Erro ao criar tarefa. Verifique se você está logado e se o servidor está rodando.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const concludedTasks = tasks.filter((t) => t.status === "CONCLUIDA");
  const pendingTasks = tasks.filter((t) => t.status === "PENDENTE" && new Date(t.dueDate) >= new Date());
  const overdueTasks = tasks.filter((t) => t.status === "ATRASADA" || (t.status === "PENDENTE" && new Date(t.dueDate) < new Date()));

  const renderTaskCard = (task) => (
    <div
      key={task.id}
      className={`task-card ${
        task.status === "CONCLUIDA" ? "completed" : ""
      } ${new Date(task.dueDate) < new Date() && task.status === "PENDENTE" ? "overdue" : ""}`}
    >
      <div className="task-inner">
        <div className="task-front">
          <span className="task-title">{task.title}</span>
          <span className="task-date">{task.priority}</span>
        </div>

        <div className="task-back">
          <span className="task-description">{task.description || "Sem descrição"}</span>
          <div className="task-actions">
            <button className="btn-edit" title="Editar">✎</button>
            <button className="btn-delete" onClick={() => handleDelete(task.id)} title="Excluir">✖</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="tasks-container">

      <aside className="tasks-sidebar">
        <h2>Criar Tarefa</h2>
        <input type="text" placeholder="Título" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
        <input type="text" placeholder="Descrição" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
        <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
        <select value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}>
          <option value="PENDENTE">Pendente</option>
          <option value="ATRASADA">Atrasada</option>
          <option value="CONCLUIDA">Concluída</option>
        </select>
        <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
          <option value="BAIXA">Baixa</option>
          <option value="MEDIA">Média</option>
          <option value="ALTA">Alta</option>
        </select>
        <button onClick={handleAddTask}>Adicionar</button>

        <hr />

        <h3>Buscar Tarefas</h3>
        <input type="text" placeholder="Título" value={titleSearch} onChange={(e) => setTitleSearch(e.target.value)} />
        <select value={statusSearch} onChange={(e) => setStatusSearch(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="PENDENTE">Pendente</option>
          <option value="ATRASADA">Atrasada</option>
          <option value="CONCLUIDA">Concluída</option>
        </select>
        <button onClick={fetchTasks}>Buscar</button>
      </aside>

      <main className="tasks-main">
        <div className="tasks-block-container">
          <div className="tasks-column">
            <h3>Pendentes</h3>
            {pendingTasks.map(renderTaskCard)}
          </div>
          <div className="tasks-column">
            <h3>Concluídas</h3>
            {concludedTasks.map(renderTaskCard)}
          </div>
          <div className="tasks-column">
            <h3>Atrasadas</h3>
            {overdueTasks.map(renderTaskCard)}
          </div>
        </div>
      </main>
    </div>
  );
}
