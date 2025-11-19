import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import api from "../api/api";
import "../styles/Ranking.css";

export default function Ranking() {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const leaderRes = await api.get("/gamification/leaderboard?limit=20");
      setLeaderboard(leaderRes.data.data || []);

      if (user?.id) {
        try {
          const statsRes = await api.get(`/gamification/stats/${user.id}`);
          setUserStats(statsRes.data.data || null);
        } catch (err) {
          console.error("Erro ao buscar stats:", err);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro ao carregar dados do ranking");
    } finally {
      setLoading(false);
    }
  };

  const getRankingMedal = (position) => {
    if (position === 1) return "🥇";
    if (position === 2) return "🥈";
    if (position === 3) return "🥉";
    return `${position}º`;
  };

  const getLevelColor = (level) => {
    if (level >= 10) return "#FFD700";
    if (level >= 7) return "#C0C0C0";
    if (level >= 4) return "#CD7F32";
    return "#999";
  };

  if (loading) {
    return (
      <div className="ranking-container">
        <div className="loading">⏳ {t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="ranking-container">
      <header className="ranking-header">
        <h1>🏆 {t('ranking.title')}</h1>
        <p>{t('ranking.subtitle')}</p>
      </header>

      {error && <div className="error-message">⚠️ {error || t('common.error')}</div>}

      {userStats && (
        <div className="user-stats-card">
          <div className="stats-content">
            <div className="stats-item">
              <span className="stats-label">{t('ranking.points')}</span>
              <span className="stats-value">{userStats.points}</span>
            </div>
            <div className="stats-item">
              <span className="stats-label">{t('ranking.level')}</span>
              <span className="stats-value">{userStats.level}</span>
            </div>
            <div className="stats-item">
              <span className="stats-label">{t('ranking.tasks')}</span>
              <span className="stats-value">{userStats.tasksCompleted}</span>
            </div>
            <div className="stats-item">
              <span className="stats-label">{t('ranking.streak')}</span>
              <span className="stats-value">{userStats.streakDays}</span>
            </div>
          </div>
        </div>
      )}

      <div className="leaderboard-section">
        <h2>📊 {t('ranking.topRanking')}</h2>

        {leaderboard.length === 0 ? (
          <div className="empty-state">
            <p>{t('ranking.emptyState')}</p>
          </div>
        ) : (
          <div className="leaderboard-table">
            <div className="table-header">
              <div className="col-rank">{t('ranking.position')}</div>
              <div className="col-name">{t('ranking.user')}</div>
              <div className="col-level">{t('ranking.level')}</div>
              <div className="col-tasks">{t('ranking.tasks')}</div>
              <div className="col-streak">{t('ranking.streak')}</div>
              <div className="col-points">{t('ranking.points')}</div>
            </div>

            {leaderboard.map((entry) => (
              <div
                key={entry.id}
                className={`table-row ${user?.id === entry.userId ? "user-row" : ""}`}
              >
                <div className="col-rank">{getRankingMedal(entry.rank)}</div>
                <div className="col-name">
                  {entry.user.name}
                  {user?.id === entry.userId && (
                    <span className="user-badge">{t('common.you')}</span>
                  )}
                </div>
                <div className="col-level">
                  <span style={{ backgroundColor: getLevelColor(entry.user.level) }}>
                    Nv. {entry.user.level}
                  </span>
                </div>
                <div className="col-tasks">{entry.tasksCompleted}</div>
                <div className="col-streak">
                  {entry.currentStreak > 0 ? `${entry.currentStreak}🔥` : "-"}
                </div>
                <div className="col-points">{entry.totalPoints}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="refresh-button" onClick={loadData}>
        🔄 {t('common.refresh')}
      </button>
    </div>
  );
}
