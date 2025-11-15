import React, { useState } from 'react'
import '../styles/TaskCard.css'

export default function TaskCard({ task, onDelete, onUpdate }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que quer deletar a tarefa "${task.title}"?`)) {
      setIsDeleting(true)
      try {
        await onDelete(task.id)
      } catch (error) {
        console.error('Erro ao deletar tarefa:', error)
        alert('Erro ao deletar tarefa')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleStatusChange = async () => {
    const newStatus = task.status === 'PENDENTE' ? 'CONCLUIDA' : 'PENDENTE'
    try {
      await onUpdate(task.id, { status: newStatus })
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status')
    }
  }

  const getPriorityColor = (priority) => {
    if (!priority) return 'gray'
    const colors = {
      BAIXA: '#4CAF50',
      MEDIA: '#FFC107',
      ALTA: '#F44336'
    }
    return colors[priority] || 'gray'
  }

  const isOverdue = new Date(task.dueDate) < new Date() && task.status === 'PENDENTE'

  return (
    <div className={`task-card ${task.status === 'CONCLUIDA' ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span className="task-priority" style={{ backgroundColor: getPriorityColor(task.priority) }}>
          {task.priority || 'Sem prioridade'}
        </span>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        {task.subject && (
          <span className="task-subject">📚 {task.subject}</span>
        )}
        <span className="task-duedate">
          📅 {new Date(task.dueDate).toLocaleDateString('pt-BR')}
        </span>
      </div>

      <div className="task-actions">
        <button
          className={`btn-status ${task.status === 'CONCLUIDA' ? 'completed' : ''}`}
          onClick={handleStatusChange}
          title={task.status === 'PENDENTE' ? 'Marcar como concluída' : 'Marcar como pendente'}
        >
          {task.status === 'PENDENTE' ? '✓ Concluir' : '↩ Reabrir'}
        </button>

        <button
          className="btn-delete"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Deletar tarefa"
        >
          {isDeleting ? '⏳ Deletando...' : '🗑 Deletar'}
        </button>
      </div>
    </div>
  )
}
