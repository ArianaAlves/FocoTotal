import {
  getLeaderboard,
  getUserGameStats,
  updateLeaderboard,
} from "./gamificationService.js";

export async function getLeaderboardController(req, res) {
  try {
    const { limit = 10 } = req.query;
    const leaderboard = await getLeaderboard(parseInt(limit));

    res.json({
      success: true,
      data: leaderboard,
      total: leaderboard.length,
    });
  } catch (error) {
    console.error("Erro ao buscar leaderboard:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar leaderboard",
    });
  }
}

export async function getUserStatsController(req, res) {
  try {
    const { id } = req.params;
    const stats = await getUserGameStats(parseInt(id));

    if (!stats) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Erro ao buscar stats:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar estatísticas",
    });
  }
}

export async function refreshLeaderboardController(req, res) {
  try {
    const leaderboard = await updateLeaderboard();

    res.json({
      success: true,
      message: "Leaderboard atualizado",
      data: leaderboard,
    });
  } catch (error) {
    console.error("Erro ao atualizar leaderboard:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao atualizar leaderboard",
    });
  }
}
