import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { api } from '../api/api'
import '../styles/Profile.css'

export default function Profile() {
  const { user } = useContext(AuthContext)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    discipline: '',
    joinDate: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    completionRate: 0
  })

  useEffect(() => {
    if (user) {
      // Simular carregamento do perfil
      setProfile({
        name: user.name || 'Usuário',
        email: user.email || '',
        bio: 'Estudante dedicado ao desenvolvimento pessoal',
        discipline: 'Desenvolvimento Web',
        joinDate: new Date().toLocaleDateString('pt-BR')
      })
      
      // Calcular estatísticas
      loadStats()
    }
  }, [user])

  const loadStats = async () => {
    try {
      const response = await api.get('/tasks')
      const tasks = response.data || []
      const completed = tasks.filter(t => t.status === 'CONCLUIDA').length
      const overdue = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status === 'PENDENTE').length
      
      setStats({
        totalTasks: tasks.length,
        completedTasks: completed,
        overdueTasks: overdue,
        completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setMessage({ type: '', text: '' })
      
      // Simular save do perfil
      setTimeout(() => {
        setMessage({ 
          type: 'success', 
          text: '✅ Perfil atualizado com sucesso!' 
        })
        setIsEditing(false)
        setLoading(false)
      }, 500)
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: '❌ Erro ao salvar perfil' 
      })
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setMessage({ type: '', text: '' })
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-banner"></div>
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="profile-info-quick">
            <h2>{profile.name}</h2>
            <p className="email-text">{profile.email}</p>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-content">
        {/* Estatísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <p className="stat-label">Total de Tarefas</p>
              <p className="stat-value">{stats.totalTasks}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <p className="stat-label">Concluídas</p>
              <p className="stat-value">{stats.completedTasks}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-info">
              <p className="stat-label">Atrasadas</p>
              <p className="stat-value">{stats.overdueTasks}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-info">
              <p className="stat-label">Taxa de Conclusão</p>
              <p className="stat-value">{stats.completionRate}%</p>
            </div>
          </div>
        </div>

        {/* Seção de Perfil */}
        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Informações Profissionais</h3>
            {!isEditing && (
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                ✏️ Editar
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="profile-form">
              <div className="form-group">
                <label>Nome Completo</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  maxLength="100"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  disabled
                  placeholder="seu@email.com"
                />
                <small>Email não pode ser alterado</small>
              </div>

              <div className="form-group">
                <label>Disciplina / Especialidade</label>
                <select
                  name="discipline"
                  value={profile.discipline}
                  onChange={handleChange}
                >
                  <option value="">Selecione uma disciplina</option>
                  <option value="Desenvolvimento Web">Desenvolvimento Web</option>
                  <option value="Design">Design</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Backend">Backend</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="form-group">
                <label>Bio / Sobre Você</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Conte um pouco sobre você..."
                  rows="4"
                  maxLength="500"
                />
                <small>{profile.bio.length}/500 caracteres</small>
              </div>

              <div className="form-actions">
                <button 
                  className="btn-save" 
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? '⏳ Salvando...' : '💾 Salvar Alterações'}
                </button>
                <button 
                  className="btn-cancel" 
                  onClick={handleCancel}
                  disabled={loading}
                >
                  ✕ Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-view">
              <div className="profile-field">
                <label>Nome Completo</label>
                <p>{profile.name}</p>
              </div>

              <div className="profile-field">
                <label>Email</label>
                <p>{profile.email}</p>
              </div>

              <div className="profile-field">
                <label>Disciplina / Especialidade</label>
                <p>{profile.discipline || 'Não informado'}</p>
              </div>

              <div className="profile-field">
                <label>Bio</label>
                <p>{profile.bio}</p>
              </div>

              <div className="profile-field">
                <label>Membro desde</label>
                <p>{profile.joinDate}</p>
              </div>
            </div>
          )}
        </div>

        {/* Seção de Objetivos */}
        <div className="profile-card">
          <h3>Metas e Objetivos</h3>
          <div className="objectives-list">
            <div className="objective-item">
              <span className="objective-icon">🎯</span>
              <div className="objective-content">
                <p className="objective-title">Completar 80% das tarefas</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${stats.completionRate}%` }}
                  ></div>
                </div>
                <p className="objective-progress">{stats.completionRate}% concluído</p>
              </div>
            </div>

            <div className="objective-item">
              <span className="objective-icon">📚</span>
              <div className="objective-content">
                <p className="objective-title">Aprender {profile.discipline}</p>
                <p className="objective-desc">Foco em desenvolvimento profissional</p>
              </div>
            </div>

            <div className="objective-item">
              <span className="objective-icon">⏰</span>
              <div className="objective-content">
                <p className="objective-title">Nenhuma tarefa atrasada</p>
                <p className="objective-desc">Tarefas atrasadas: {stats.overdueTasks}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
