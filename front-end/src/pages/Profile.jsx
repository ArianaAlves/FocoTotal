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
    joinDate: '',
    discord: '',
    instagram: '',
    linkedin: '',
    github: ''
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
          joinDate: new Date().toLocaleDateString('pt-BR'),
          discord: '',
          instagram: '',
          linkedin: '',
          github: ''
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

    const handleContactClick = () => {
      if (profile.discord) {
        window.open(`https://discord.com/users/${profile.discord}`, '_blank')
      } else {
        alert('Link do Discord não configurado. Adicione seu Discord nas redes sociais.')
      }
    }

  return (
    <div className="profile-container">
        <div className="profile-banner-clean">
          <div className="profile-banner-content">
            <div className="profile-avatar-clean">
              {profile.name ? profile.name.substring(0, 2).toUpperCase() : 'U'}
            </div>
          
            <div className="profile-info-section">
              <div className="profile-name-role">
                <h1 className="profile-name">{profile.name}</h1>
                <p className="profile-role">{profile.discipline || 'Desenvolvedor'}</p>
              </div>
            
              <div className="profile-contact-section">
                <button className="btn-contact" onClick={handleContactClick}>
                  Entre em contato
                </button>
              
                <div className="social-links">
                  <a 
                    href={profile.discord ? `https://discord.com/users/${profile.discord}` : '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link discord"
                    title="Discord"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    <span>{profile.discord || 'Discord'}</span>
                  </a>
                
                  <a 
                    href={profile.instagram ? `https://instagram.com/${profile.instagram}` : '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link instagram"
                    title="Instagram"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>{profile.instagram || 'Instagram'}</span>
                  </a>
                
                  <a 
                    href={profile.linkedin ? `https://linkedin.com/in/${profile.linkedin}` : '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link linkedin"
                    title="LinkedIn"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span>{profile.linkedin || 'LinkedIn'}</span>
                  </a>
                
                  <a 
                    href={profile.github ? `https://github.com/${profile.github}` : '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link github"
                    title="GitHub"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>{profile.github || 'GitHub'}</span>
                  </a>
                </div>
              </div>
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

              <div className="form-group">
                <label>Discord (ID ou Username)</label>
                <input
                  type="text"
                  name="discord"
                  value={profile.discord}
                  onChange={handleChange}
                  placeholder="seu_usuario"
                />
              </div>

              <div className="form-group">
                <label>WhatsApp (com código do país)</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={profile.whatsapp}
                  onChange={handleChange}
                  placeholder="5511999999999"
                />
              </div>

              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="text"
                  name="linkedin"
                  value={profile.linkedin}
                  onChange={handleChange}
                  placeholder="seu-usuario-linkedin"
                />
              </div>

              <div className="form-group">
                <label>Behance</label>
                <input
                  type="text"
                  name="behance"
                  value={profile.behance}
                  onChange={handleChange}
                  placeholder="seu_usuario"
                />
              </div>

              <div className="form-actions">
                  <label>Discord (ID ou Username)</label>
                  <input
                    type="text"
                    name="discord"
                    value={profile.discord}
                    onChange={handleChange}
                    placeholder="seu_usuario"
                  />
                </div>

                <div className="form-group">
                  <label>Instagram</label>
                  <input
                    type="text"
                    name="instagram"
                    value={profile.instagram}
                    onChange={handleChange}
                    placeholder="@seu_usuario"
                  />
                </div>

                <div className="form-group">
                  <label>LinkedIn</label>
                  <input
                    type="text"
                    name="linkedin"
                    value={profile.linkedin}
                    onChange={handleChange}
                    placeholder="seu-usuario-linkedin"
                  />
                </div>

                <div className="form-group">
                  <label>GitHub</label>
                  <input
                    type="text"
                    name="github"
                    value={profile.github}
                    onChange={handleChange}
                    placeholder="seu_usuario"
                  />
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
