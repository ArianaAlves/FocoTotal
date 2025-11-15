import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { api } from '../api/api'
import TaskCard from '../components/TaskCard'
import '../styles/Tasks.css'

export default function Tasks() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    status: '',
    subject: '',
    priority: '',
    search: ''
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadTasks()
  }, [user, navigate])

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      
      if (filters.status) params.append('status', filters.status)
      if (filters.subject) params.append('subject', filters.subject)
      if (filters.priority) params.append('priority', filters.priority)
      if (filters.search) params.append('title', filters.search)

      const response = await api.get(`/tasks?${params.toString()}`)
      setTasks(response.data)
    } catch (err) {
      console.error('Erro ao carregar tarefas:', err)
      setError('Erro ao carregar tarefas')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`)
      setTasks(tasks.filter(t => t.id !== taskId))
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error)
      throw error
    }
  }

  const handleUpdate = async (taskId, data) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, data)
      setTasks(tasks.map(t => t.id === taskId ? response.data : t))
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
      throw error
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTasks()
    }, 500)
    return () => clearTimeout(timer)
  }, [filters])

  const completedCount = tasks.filter(t => t.status === 'CONCLUIDA').length
  const pendingCount = tasks.filter(t => t.status === 'PENDENTE').length
  const overdueCount = tasks.filter(
    t => new Date(t.dueDate) < new Date() && t.status === 'PENDENTE'
  ).length

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>Minhas Tarefas</h1>
        <div className="task-stats">
          <div className="stat">
            <span className="stat-label">Concluídas</span>
            <span className="stat-value">{completedCount}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Pendentes</span>
            <span className="stat-value">{pendingCount}</span>
          </div>
          <div className="stat warning">
            <span className="stat-label">Atrasadas</span>
            <span className="stat-value">{overdueCount}</span>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <input
          type="text"
          name="search"
          placeholder="🔍 Buscar por título..."
          value={filters.search}
          onChange={handleFilterChange}
          className="filter-input"
        />

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Todos os Status</option>
          <option value="PENDENTE">Pendente</option>
          <option value="CONCLUIDA">Concluída</option>
        </select>

        <select
          name="priority"
          value={filters.priority}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Todas as Prioridades</option>
          <option value="ALTA">Alta</option>
          <option value="MEDIA">Média</option>
          <option value="BAIXA">Baixa</option>
        </select>

        <input
          type="text"
          name="subject"
          placeholder="🎓 Disciplina/Tag..."
          value={filters.subject}
          onChange={handleFilterChange}
          className="filter-input"
        />

        <button className="btn-clear" onClick={() => {
          setFilters({ status: '', subject: '', priority: '', search: '' })
        }}>
          Limpar Filtros
        </button>
      </div>

      {loading && (
        <div className="loading">⏳ Carregando tarefas...</div>
      )}

      {error && (
        <div className="error">{error}</div>
      )}

      {!loading && tasks.length === 0 && (
        <div className="no-tasks">
          {Object.values(filters).some(v => v) 
            ? '❌ Nenhuma tarefa encontrada com esses filtros'
            : '✨ Você não tem tarefas! Comece criando uma nova.'}
        </div>
      )}

      {!loading && tasks.length > 0 && (
        <div className="tasks-list">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
