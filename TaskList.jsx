import { useEffect, useState } from "react";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [titleSearch, setTitleSearch] = useState("");
  const [statusSearch, setStatusSearch] = useState("");

  // Carregar todas as tarefas
  useEffect(() => {
    fetch("http://localhost:3001/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  // Fazer busca
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (titleSearch) params.append("title", titleSearch);
    if (statusSearch) params.append("status", statusSearch);

    fetch(`http://localhost:3001/tasks/search?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setTasks(data));
  };

  return (
    <div className="container">
      <h1>Minhas Tarefas</h1>

      <div className="searchBox">
        <input
          type="text"
          placeholder="Buscar por título..."
          value={titleSearch}
          onChange={(e) => setTitleSearch(e.target.value)}
        />

        <select
          value={statusSearch}
          onChange={(e) => setStatusSearch(e.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="em andamento">Em andamento</option>
          <option value="concluída">Concluída</option>
        </select>

        <button onClick={handleSearch}>Buscar</button>
      </div>

      <ul className="taskList">
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong>
            <span>Status: {task.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
