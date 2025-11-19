import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "../api/api";
import { useTranslation } from "react-i18next";
import "../styles/Tasks.css";

/* eslint-disable react-hooks/set-state-in-effect */
export default function Tasks() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [titleSearch, setTitleSearch] = useState("");
  const [statusSearch, setStatusSearch] = useState("");
  const hasInitialized = useRef(false);

  const [editingTask, setEditingTask] = useState(null);

  const initialNewTaskState = {
    title: "",
    description: "",
    dueDate: "",
    status: "PENDENTE",
    priority: "ALTA",
  };

  const [currentTaskForm, setCurrentTaskForm] = useState(initialNewTaskState);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      const localTasks = JSON.parse(
        localStorage.getItem("ft_local_tasks") || "[]"
      );
      setTasks(localTasks);
    }
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const localTasks = JSON.parse(
      localStorage.getItem("ft_local_tasks") || "[]"
    );
    
    if (localTasks.length === 0) {
      const exampleTasks = [
        {
          id: 1,
          title: "Estudar React",
          description: "Revisar conceitos de hooks e componentes",
          dueDate: "2025-11-20",
          status: "PENDENTE",
          priority: "ALTA",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          title: "Fazer exercícios",
          description: "30 minutos de caminhada",
          dueDate: "2025-11-18",
          status: "CONCLUIDA",
          priority: "MEDIA",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 3,
          title: "Reunião de equipe",
          description: "Discussão sobre o projeto",
          dueDate: "2025-11-15",
          status: "PENDENTE",
          priority: "ALTA",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem("ft_local_tasks", JSON.stringify(exampleTasks));
      setTasks(exampleTasks);
    } else {
      setTasks(localTasks);
    }
    
    fetchTasks();
  }, [fetchTasks]);

  const resetForm = () => {
    setCurrentTaskForm(initialNewTaskState);
    setEditingTask(null);
  };

  const handleSaveTask = async () => {
    if (!currentTaskForm.title || !currentTaskForm.dueDate) {
      alert(t('tasks.requiredFields'));
      return;
    }

    try {
      if (editingTask) {
        // Tentar atualizar via API
        await api.put(`/tasks/${editingTask.id}`, currentTaskForm);
        alert(t('tasks.updatedSuccess'));
      } else {
        // Tentar criar via API
        await api.post("/tasks", currentTaskForm);
        alert(t('tasks.createdSuccess'));
      }

      resetForm();
      fetchTasks();
    } catch (error) {
      console.error(
        `Erro ao ${editingTask ? "atualizar" : "criar"} tarefa:`,
        error
      );

      // Fallback: usar armazenamento local
      const localTasks = JSON.parse(
        localStorage.getItem("ft_local_tasks") || "[]"
      );

      if (editingTask) {
        // Atualizar tarefa local
        const updatedTasks = localTasks.map((task) =>
          task.id === editingTask.id ? { ...task, ...currentTaskForm } : task
        );
        localStorage.setItem("ft_local_tasks", JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
        alert("Tarefa atualizada localmente!");
      } else {
        // Criar nova tarefa local
        const newTask = {
          id: Date.now(),
          ...currentTaskForm,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updatedTasks = [...localTasks, newTask];
        localStorage.setItem("ft_local_tasks", JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
        alert("Tarefa criada localmente!");
      }

      resetForm();
    }
  };

  const handleEdit = (task) => {
    const formattedDate = task.dueDate
      ? new Date(task.dueDate).toISOString().split("T")[0]
      : "";

    setEditingTask(task);

    setCurrentTaskForm({
      title: task.title,
      description: task.description || "",
      dueDate: formattedDate,
      status: task.status,
      priority: task.priority,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
      if (editingTask && editingTask.id === id) {
        resetForm();
      }
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);

      // Fallback: deletar do armazenamento local
      const localTasks = JSON.parse(
        localStorage.getItem("ft_local_tasks") || "[]"
      );
      const updatedTasks = localTasks.filter((task) => task.id !== id);
      localStorage.setItem("ft_local_tasks", JSON.stringify(updatedTasks));
      setTasks(updatedTasks);

      if (editingTask && editingTask.id === id) {
        resetForm();
      }

        alert(t('tasks.deletedSuccess'));
    }
  };

  const normalizeDate = (dateStr) => {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesTitle = task.title
      .toLowerCase()
      .includes(titleSearch.toLowerCase());
    const matchesStatus = statusSearch === "" || task.status === statusSearch;
    return matchesTitle && matchesStatus;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pendingTasks = filteredTasks.filter(
    (t) => t.status === "PENDENTE" && normalizeDate(t.dueDate) >= today
  );

  const concludedTasks = filteredTasks.filter((t) => t.status === "CONCLUIDA");

  const overdueTasks = filteredTasks.filter(
    (t) =>
      t.status === "ATRASADA" ||
      (t.status === "PENDENTE" && normalizeDate(t.dueDate) < today)
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentTaskForm((prev) => ({ ...prev, [name]: value }));
  };

  const renderTaskCard = (task) => (
    <div
      key={task.id}
      className={`task-card ${task.status === "CONCLUIDA" ? "completed" : ""} ${
        normalizeDate(task.dueDate) < today && task.status === "PENDENTE"
          ? "overdue"
          : ""
      }`}
    >
      <div className="task-inner">
        <div className="task-front">
          <span className="task-title">{task.title}</span>
          <span className="task-date">{task.priority}</span>
        </div>

        <div className="task-back">
          <span className="task-description">
            {task.description || "Sem descrição"}
          </span>
          <div className="task-actions">
            <button
              className="btn-edit"
              onClick={() => handleEdit(task)}
              title="Editar"
            >
              ✎
            </button>
            <button
              className="btn-delete"
              onClick={() => handleDelete(task.id)}
              title="Excluir"
            >
              ✖
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="tasks-container">
      <aside className="tasks-sidebar">
        <h2>{editingTask ? t('tasks.editTask') : t('tasks.createTask')}</h2>

        <input
          type="text"
          placeholder={t('tasks.title')}
          name="title"
          value={currentTaskForm.title}
          onChange={handleFormChange}
        />
        <input
          type="text"
          placeholder={t('tasks.description')}
          name="description"
          value={currentTaskForm.description}
          onChange={handleFormChange}
        />
        <input
          type="date"
          name="dueDate"
          value={currentTaskForm.dueDate}
          onChange={handleFormChange}
        />

        <select
          name="status"
          value={currentTaskForm.status}
          onChange={handleFormChange}
        >
          <option value="PENDENTE">{t('tasks.pending')}</option>
          <option value="ATRASADA">{t('tasks.overdue')}</option>
          <option value="CONCLUIDA">{t('tasks.completed')}</option>
        </select>

        <select
          name="priority"
          value={currentTaskForm.priority}
          onChange={handleFormChange}
        >
          <option value="BAIXA">{t('tasks.lowPriority')}</option>
          <option value="MEDIA">{t('tasks.mediumPriority')}</option>
          <option value="ALTA">{t('tasks.highPriority')}</option>
        </select>

        <button onClick={handleSaveTask}>
          {editingTask ? t('common.saveChanges') : t('tasks.addTask')}
        </button>
        {editingTask && (
          <button onClick={resetForm} className="btn-cancel-edit">
            {t('common.cancelEdit')}
          </button>
        )}

        <hr />

        <h3>{t('tasks.searchTasks')}</h3>
        <input
          type="text"
          placeholder={t('tasks.title')}
          value={titleSearch}
          onChange={(e) => setTitleSearch(e.target.value)}
        />
        <select
          value={statusSearch}
          onChange={(e) => setStatusSearch(e.target.value)}
        >
          <option value="">{t('tasks.allStatus')}</option>
          <option value="PENDENTE">{t('tasks.pending')}</option>
          <option value="ATRASADA">{t('tasks.overdue')}</option>
          <option value="CONCLUIDA">{t('tasks.completed')}</option>
        </select>
        <button onClick={fetchTasks}>{t('tasks.search')}</button>
      </aside>

      <main className="tasks-main">
        <div className="tasks-block-container">
          <div className="tasks-column">
            <h3>{t('tasks.pending')} ({pendingTasks.length})</h3>
            {pendingTasks.map(renderTaskCard)}
          </div>
          <div className="tasks-column">
            <h3>{t('tasks.completed')} ({concludedTasks.length})</h3>
            {concludedTasks.map(renderTaskCard)}
          </div>
          <div className="tasks-column">
            <h3>{t('tasks.overdue')} ({overdueTasks.length})</h3>
            {/*teste*/}
            {overdueTasks.map(renderTaskCard)}
          </div>
        </div>
      </main>
    </div>
  );
}
