import { useEffect, useState } from "react";
import { api } from "../api/api"; 
import "../styles/Tasks.css";

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [titleSearch, setTitleSearch] = useState("");
    const [statusSearch, setStatusSearch] = useState("");
    
    const [editingTask, setEditingTask] = useState(null); 

    const initialNewTaskState = {
        title: "",
        description: "",
        dueDate: "",
        status: "PENDENTE",
        priority: "ALTA",
    };
  
    const [currentTaskForm, setCurrentTaskForm] = useState(initialNewTaskState);

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
    
   
    const resetForm = () => {
        setCurrentTaskForm(initialNewTaskState);
        setEditingTask(null);
    };

 
    const handleSaveTask = async () => {
        if (!currentTaskForm.title || !currentTaskForm.dueDate) {
            alert("Título e Data de Vencimento são obrigatórios!");
            return;
        }

        try {
            if (editingTask) {
            
                await api.put(`/tasks/${editingTask.id}`, currentTaskForm);
                alert("Tarefa atualizada com sucesso!");
            } else {
          
                await api.post("/tasks", currentTaskForm);
                alert("Tarefa criada com sucesso!");
            }
            
            resetForm();
            fetchTasks(); 
        } catch (error) {
            console.error(`Erro ao ${editingTask ? 'atualizar' : 'criar'} tarefa:`, error);
            alert(`Erro ao ${editingTask ? 'atualizar' : 'criar'} tarefa.`);
        }
    };


    const handleEdit = (task) => {

        const formattedDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
        

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
        }
    };

    const normalizeDate = (dateStr) => {
        const d = new Date(dateStr);
        d.setHours(0,0,0,0);
        return d;
    }
    

    
    const filteredTasks = tasks.filter((task) => {
        const matchesTitle = task.title.toLowerCase().includes(titleSearch.toLowerCase());
        const matchesStatus = statusSearch === "" || task.status === statusSearch;
        return matchesTitle && matchesStatus;
    });

    const today = new Date();
    today.setHours(0,0,0,0);

    const pendingTasks = filteredTasks.filter(
        (t) => t.status === "PENDENTE" && normalizeDate(t.dueDate) >= today
    );

    const concludedTasks = filteredTasks.filter(
        (t) => t.status === "CONCLUIDA"
    );

    const overdueTasks = filteredTasks.filter(
      
        (t) => t.status === "ATRASADA" || (t.status === "PENDENTE" && normalizeDate(t.dueDate) < today)
    );

 
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setCurrentTaskForm((prev) => ({ ...prev, [name]: value }));
    };

    const renderTaskCard = (task) => (
        <div
            key={task.id}
            className={`task-card ${
                task.status === "CONCLUIDA" ? "completed" : ""
            } ${normalizeDate(task.dueDate) < today && task.status === "PENDENTE" ? "overdue" : ""}`}
        >
            <div className="task-inner">
                <div className="task-front">
                    <span className="task-title">{task.title}</span>
                    <span className="task-date">{task.priority}</span>
                </div>

                <div className="task-back">
                    <span className="task-description">{task.description || "Sem descrição"}</span>
                    <div className="task-actions">
                      
                        <button className="btn-edit" onClick={() => handleEdit(task)} title="Editar">✎</button>
                        <button className="btn-delete" onClick={() => handleDelete(task.id)} title="Excluir">✖</button>
                    </div>
                </div>
            </div>
        </div>
    );



    return (
        <div className="tasks-container">

            <aside className="tasks-sidebar">
     
                <h2>{editingTask ? 'Editar Tarefa' : 'Criar Tarefa'}</h2>
                

                <input 
                    type="text" 
                    placeholder="Título" 
                    name="title" 
                    value={currentTaskForm.title} 
                    onChange={handleFormChange} 
                />
                <input 
                    type="text" 
                    placeholder="Descrição" 
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
                    <option value="PENDENTE">Pendente</option>
                    <option value="ATRASADA">Atrasada</option>
                    <option value="CONCLUIDA">Concluída</option>
                </select>
                
                <select 
                    name="priority" 
                    value={currentTaskForm.priority} 
                    onChange={handleFormChange}
                >
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Média</option>
                    <option value="ALTA">Alta</option>
                </select>
                
 
                <button onClick={handleSaveTask}>
                    {editingTask ? 'Salvar Alterações' : 'Adicionar Tarefa'}
                </button>
                {editingTask && (
                    <button onClick={resetForm} className="btn-cancel-edit">
                        Cancelar Edição
                    </button>
                )}

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
                        <h3>Pendentes ({pendingTasks.length})</h3>
                        {pendingTasks.map(renderTaskCard)}
                    </div>
                    <div className="tasks-column">
                        <h3>Concluídas ({concludedTasks.length})</h3>
                        {concludedTasks.map(renderTaskCard)}
                    </div>
                    <div className="tasks-column">
                        <h3>Atrasadas ({overdueTasks.length})</h3>
                        {/*teste*/}
                        {overdueTasks.map(renderTaskCard)}
                    </div>
                </div>
            </main>
            
        </div>
    );
}