import React, { useState } from 'react'
import '../styles/TaskCard.css'

export default function TaskCard({ task, onDelete, onUpdate }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLate, setIsLate] = useState(task.isLate || false)

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
    // Ciclo: PENDENTE -> ATRASADA -> CONCLUIDA -> PENDENTE
    const statusCycle = {
      'PENDENTE': 'ATRASADA',
      'ATRASADA': 'CONCLUIDA',
      'CONCLUIDA': 'PENDENTE'
    }
    const newStatus = statusCycle[task.status] || 'PENDENTE'
    try {
      await onUpdate(task.id, { status: newStatus })
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status')
    }
  }

  const handleMarkAsLate = async () => {
    const newIsLate = !isLate
    setIsLate(newIsLate)
    try {
      await onUpdate(task.id, { isLate: newIsLate })
    } catch (error) {
      console.error('Erro ao marcar como atrasada:', error)
      setIsLate(!newIsLate)
      alert('Erro ao marcar como atrasada')
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

  const getStatusLabel = () => {
    const labels = {
      'PENDENTE': '⏳ Pendente',
      'ATRASADA': '⏰ Atrasada',
      'CONCLUIDA': '✓ Concluída'
    }
    return labels[task.status] || task.status
  }

  const getStatusTitle = () => {
    const titles = {
      'PENDENTE': 'Clicar para marcar como atrasada',
      'ATRASADA': 'Clicar para marcar como concluída',
      'CONCLUIDA': 'Clicar para voltar a pendente'
    }
    return titles[task.status] || 'Mudar status'
  }

  return (
    <div className={`task-card ${task.status === 'CONCLUIDA' ? 'completed' : ''} ${isLate ? 'late' : ''} ${isOverdue ? 'overdue' : ''}`}>
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
          className={`btn-status ${task.status === 'CONCLUIDA' ? 'completed' : ''} ${task.status === 'ATRASADA' ? 'late' : ''}`}
          onClick={handleStatusChange}
          title={getStatusTitle()}
        >
          {getStatusLabel()}
        </button>

        <button
          className={`btn-late ${isLate ? 'marked' : ''}`}
          onClick={handleMarkAsLate}
          title={isLate ? 'Remover marcação de atrasada' : 'Marcar como atrasada'}
        >
          {isLate ? '⏰ Atrasada' : '⏰'}
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
