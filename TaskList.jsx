import { useEffect, useState } from "react";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [titleSearch, setTitleSearch] = useState("");
  const [statusSearch, setStatusSearch] = useState("");

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "PENDENTE",
  });

  const fetchTasks = () => {
    fetch("http://localhost:3001/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
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
      await fetch("http://localhost:3001/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      setNewTask({ title: "", description: "", dueDate: "", status: "PENDENTE" });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
      await fetch(`http://localhost:3001/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (titleSearch) params.append("title", titleSearch);
    if (statusSearch) params.append("status", statusSearch);

    fetch(`http://localhost:3001/tasks/search?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setTasks(data));
  };

  const concludedTasks = tasks.filter((t) => t.status === "CONCLUIDA");
  const pendingTasks = tasks.filter((t) => t.status === "PENDENTE");
  const overdueTasks = tasks.filter(
    (t) => t.status === "PENDENTE" && new Date(t.dueDate) < new Date()
  );

  return (
    <div className="flex min-h-screen">

      <aside className="w-1/4 p-6 space-y-6 bg-white shadow-md rounded">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Criar Tarefa</h2>

        <input
          type="text"
          placeholder="Título"
          className="input-field"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />

        <input
          type="text"
          placeholder="Descrição"
          className="input-field"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />

        <input
          type="date"
          className="input-field"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />

        <select
          className="input-field"
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option value="PENDENTE">Pendente</option>
          <option value="CONCLUIDA">Concluída</option>
        </select>

        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
          onClick={handleAddTask}
        >
          Adicionar Tarefa
        </button>

        <hr className="my-4" />

        <h3 className="font-bold mb-2 text-gray-800">Buscar Tarefas</h3>
        <input
          type="text"
          placeholder="Título"
          className="input-field"
          value={titleSearch}
          onChange={(e) => setTitleSearch(e.target.value)}
        />
        <select
          className="input-field"
          value={statusSearch}
          onChange={(e) => setStatusSearch(e.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="PENDENTE">Pendente</option>
          <option value="CONCLUIDA">Concluída</option>
        </select>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-full"
          onClick={handleSearch}
        >
          Buscar
        </button>
      </aside>

      <main className="w-3/4 p-6 grid grid-cols-3 gap-4">
        <div className="bg-yellow-100 rounded p-4 shadow-sm">
          <h3 className="font-bold mb-2 text-gray-800">PENDENTES</h3>
          <ul>
            {pendingTasks.map((task) => (
              <li
                key={task.id}
                className="mb-2 flex justify-between items-center"
              >
                <span>{task.title}</span>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => handleDelete(task.id)}
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-green-100 rounded p-4 shadow-sm">
          <h3 className="font-bold mb-2 text-gray-800">CONCLUÍDAS</h3>
          <ul>
            {concludedTasks.map((task) => (
              <li
                key={task.id}
                className="mb-2 flex justify-between items-center"
              >
                <span>{task.title}</span>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => handleDelete(task.id)}
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-orange-100 rounded p-4 shadow-sm">
          <h3 className="font-bold mb-2 text-gray-800">ATRASADAS</h3>
          <ul>
            {overdueTasks.map((task) => (
              <li
                key={task.id}
                className="mb-2 flex justify-between items-center"
              >
                <span>{task.title}</span>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => handleDelete(task.id)}
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
