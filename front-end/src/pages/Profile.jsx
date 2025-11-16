import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api/api";
import "../styles/Profile.css";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(() => ({
    name: "",
    email: "",
    bio: "",
    discipline: "",
    joinDate: "",
    profileImage: localStorage.getItem("profileImage") || null,
    backgroundImage: localStorage.getItem("backgroundImage") || null,
  }));
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
  });
  const [profileImagePreview, setProfileImagePreview] = useState(() => {
    return localStorage.getItem("profileImage") || null;
  });
  const [backgroundImagePreview, setBackgroundImagePreview] = useState(() => {
    return localStorage.getItem("backgroundImage") || null;
  });

  // Carregar imagens salvas imediatamente quando o componente é montado
  useEffect(() => {
    const loadSavedImages = () => {
      const savedProfileImage = localStorage.getItem("profileImage");
      const savedBackgroundImage = localStorage.getItem("backgroundImage");

      console.log("🔍 Carregando imagens salvas:", {
        savedProfileImage: !!savedProfileImage,
        savedBackgroundImage: !!savedBackgroundImage,
      });

      if (savedProfileImage) {
        console.log("✅ Carregando profile image");
        setProfileImagePreview(savedProfileImage);
      }
      if (savedBackgroundImage) {
        console.log("✅ Carregando background image");
        setBackgroundImagePreview(savedBackgroundImage);
      }
    };

    // Carregar imagens imediatamente
    loadSavedImages();

    // Também carregar após um pequeno delay para garantir
    const timer = setTimeout(loadSavedImages, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      console.log("👤 Usuário carregado, atualizando dados do perfil");

      setProfile((prev) => ({
        ...prev,
        name: user.name || "Usuário",
        email: user.email || "",
        bio: prev.bio || "Estudante dedicado ao desenvolvimento pessoal",
        discipline: prev.discipline || "Desenvolvimento Web",
        joinDate: new Date().toLocaleDateString("pt-BR"),
      }));

      // Garantir que as previews das imagens sejam mantidas
      const savedProfileImage = localStorage.getItem("profileImage");
      const savedBackgroundImage = localStorage.getItem("backgroundImage");

      if (savedProfileImage && !profileImagePreview) {
        console.log("🔄 Re-carregando profile image preview");
        setProfileImagePreview(savedProfileImage);
      }
      if (savedBackgroundImage && !backgroundImagePreview) {
        console.log("🔄 Re-carregando background image preview");
        setBackgroundImagePreview(savedBackgroundImage);
      }

      // Calcular estatísticas
      loadStats();
    }
  }, [user, profileImagePreview, backgroundImagePreview]);

  const loadStats = async () => {
    try {
      const response = await api.get("/tasks");
      const tasks = response.data || [];
      const completed = tasks.filter((t) => t.status === "CONCLUIDA").length;
      const overdue = tasks.filter(
        (t) => new Date(t.dueDate) < new Date() && t.status === "PENDENTE"
      ).length;

      setStats({
        totalTasks: tasks.length,
        completedTasks: completed,
        overdueTasks: overdue,
        completionRate:
          tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e, imageType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setMessage({
        type: "error",
        text: "❌ Por favor, selecione uma imagem válida (JPG, PNG ou GIF)",
      });
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "❌ A imagem deve ter no máximo 5MB",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;

      if (imageType === "profile") {
        setProfileImagePreview(imageUrl);
        setProfile((prev) => ({ ...prev, profileImage: imageUrl }));
        // Salvar automaticamente no localStorage
        localStorage.setItem("profileImage", imageUrl);
      } else if (imageType === "background") {
        setBackgroundImagePreview(imageUrl);
        setProfile((prev) => ({ ...prev, backgroundImage: imageUrl }));
        // Salvar automaticamente no localStorage
        localStorage.setItem("backgroundImage", imageUrl);
      }

      setMessage({
        type: "success",
        text: "✅ Imagem carregada com sucesso!",
      });
    };

    reader.readAsDataURL(file);
  };

  const removeImage = (imageType) => {
    if (imageType === "profile") {
      setProfileImagePreview(null);
      setProfile((prev) => ({ ...prev, profileImage: null }));
      localStorage.removeItem("profileImage");
    } else if (imageType === "background") {
      setBackgroundImagePreview(null);
      setProfile((prev) => ({ ...prev, backgroundImage: null }));
      localStorage.removeItem("backgroundImage");
    }

    setMessage({
      type: "success",
      text: "✅ Imagem removida com sucesso!",
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      // Simular save do perfil
      setTimeout(() => {
        setMessage({
          type: "success",
          text: "✅ Perfil atualizado com sucesso!",
        });
        setIsEditing(false);
        setLoading(false);
      }, 500);
    } catch (error) {
      setMessage({
        type: "error",
        text: "❌ Erro ao salvar perfil",
      });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  console.log("🎨 RENDERIZAÇÃO:", {
    hasBackgroundImage: !!backgroundImagePreview,
    hasProfileImage: !!profileImagePreview,
    backgroundImageLength: backgroundImagePreview?.length || 0,
    profileImageLength: profileImagePreview?.length || 0,
  });

  return (
    <div className="profile-container">
      <div
        className="profile-header"
        style={{
          backgroundImage: backgroundImagePreview
            ? `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${backgroundImagePreview})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Botão único branco esfumaçado */}
        <label className="cover-upload-single">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "background")}
            style={{ display: "none" }}
          />
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 4H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="white"
              fillOpacity="0.8"
            />
            <path
              d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="white"
              fillOpacity="0.6"
            />
          </svg>
        </label>

        <div className="profile-avatar-section">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Foto de perfil"
                  className="profile-avatar-image"
                />
              ) : (
                <span className="profile-avatar-initial">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                </span>
              )}
            </div>
            <label className="profile-upload-btn">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "profile")}
                style={{ display: "none" }}
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 4H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="white"
                  fillOpacity="0.8"
                />
                <path
                  d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="white"
                  fillOpacity="0.6"
                />
              </svg>
            </label>
          </div>
          <div className="profile-info-quick">
            <h2 className="profile-name-text">{profile.name}</h2>
            <p className="email-text">{profile.email}</p>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
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
                  <option value="Desenvolvimento Web">
                    Desenvolvimento Web
                  </option>
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
                  {loading ? "⏳ Salvando..." : "💾 Salvar Alterações"}
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
                <p>{profile.discipline || "Não informado"}</p>
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
                <p className="objective-progress">
                  {stats.completionRate}% concluído
                </p>
              </div>
            </div>

            <div className="objective-item">
              <span className="objective-icon">📚</span>
              <div className="objective-content">
                <p className="objective-title">Aprender {profile.discipline}</p>
                <p className="objective-desc">
                  Foco em desenvolvimento profissional
                </p>
              </div>
            </div>

            <div className="objective-item">
              <span className="objective-icon">⏰</span>
              <div className="objective-content">
                <p className="objective-title">Nenhuma tarefa atrasada</p>
                <p className="objective-desc">
                  Tarefas atrasadas: {stats.overdueTasks}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
