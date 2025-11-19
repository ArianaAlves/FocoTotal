import { Router } from "express";
import {
  getLeaderboardController,
  getUserStatsController,
  refreshLeaderboardController,
} from "./gamificationController.js";

const router = Router();

// GET /api/gamification/leaderboard - Buscar ranking
router.get("/leaderboard", getLeaderboardController);

// GET /api/gamification/stats/:id - Buscar stats do usuário
router.get("/stats/:id", getUserStatsController);

// POST /api/gamification/refresh-leaderboard - Atualizar ranking
router.post("/refresh-leaderboard", refreshLeaderboardController);

export default router;
