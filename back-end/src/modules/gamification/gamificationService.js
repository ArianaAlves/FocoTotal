import { prisma } from "../../database/prismaClient.js";

// Pontos por ação
const POINTS_CONFIG = {
  TASK_COMPLETED: 10,
  TASK_COMPLETED_ON_TIME: 15,
  TASK_HIGH_PRIORITY: 5,
  GOAL_COMPLETED: 50,
  ACHIEVEMENT_UNLOCKED: 100,
  DAILY_STREAK: 5,
};

// Achievements pré-definidos
const ACHIEVEMENTS = [
  {
    name: "Primeira Tarefa",
    description: "Complete sua primeira tarefa",
    icon: "🎯",
    points: 10,
    condition: "1_TASK_COMPLETED",
  },
  {
    name: "Produtivo",
    description: "Complete 5 tarefas",
    icon: "⚡",
    points: 50,
    condition: "5_TASKS_COMPLETED",
  },
  {
    name: "Super Produtivo",
    description: "Complete 25 tarefas",
    icon: "🔥",
    points: 200,
    condition: "25_TASKS_COMPLETED",
  },
  {
    name: "Iniciante Foco",
    description: "Complete uma sequência de 3 dias",
    icon: "🌟",
    points: 30,
    condition: "3_DAY_STREAK",
  },
  {
    name: "Campeão Foco",
    description: "Complete uma sequência de 7 dias",
    icon: "👑",
    points: 100,
    condition: "7_DAY_STREAK",
  },
  {
    name: "Lendário",
    description: "Complete uma sequência de 30 dias",
    icon: "🏆",
    points: 500,
    condition: "30_DAY_STREAK",
  },
  {
    name: "Primeiro Objetivo",
    description: "Conclua seu primeiro objetivo",
    icon: "🎁",
    points: 75,
    condition: "1_GOAL_COMPLETED",
  },
];

export async function addPoints(userId, points, reason, reference = null) {
  try {
    // Adicionar à história de pontos
    const history = await prisma.pointsHistory.create({
      data: {
        userId,
        points,
        reason,
        reference: reference?.toString(),
      },
    });

    // Atualizar pontos do usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: points,
        },
      },
    });

    // Calcular nível (a cada 500 pontos)
    const newLevel = Math.floor(updatedUser.points / 500) + 1;
    if (newLevel > updatedUser.level) {
      await prisma.user.update({
        where: { id: userId },
        data: { level: newLevel },
      });
    }

    return { success: true, points: updatedUser.points };
  } catch (error) {
    console.error("Erro ao adicionar pontos:", error);
    throw error;
  }
}

export async function checkAndUnlockAchievements(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        achievements: true,
        tasks: true,
      },
    });

    if (!user) return [];

    const unlockedAchievements = [];
    const completedTasks = user.tasks.filter((t) => t.status === "CONCLUIDA").length;

    for (const achievement of ACHIEVEMENTS) {
      // Verificar se já foi desbloqueado
      const alreadyUnlocked = user.achievements.some(
        (a) => a.condition === achievement.condition
      );
      if (alreadyUnlocked) continue;

      let shouldUnlock = false;

      if (achievement.condition === "1_TASK_COMPLETED" && completedTasks >= 1) {
        shouldUnlock = true;
      } else if (
        achievement.condition === "5_TASKS_COMPLETED" &&
        completedTasks >= 5
      ) {
        shouldUnlock = true;
      } else if (
        achievement.condition === "25_TASKS_COMPLETED" &&
        completedTasks >= 25
      ) {
        shouldUnlock = true;
      } else if (
        achievement.condition === "3_DAY_STREAK" &&
        user.streakDays >= 3
      ) {
        shouldUnlock = true;
      } else if (
        achievement.condition === "7_DAY_STREAK" &&
        user.streakDays >= 7
      ) {
        shouldUnlock = true;
      } else if (
        achievement.condition === "30_DAY_STREAK" &&
        user.streakDays >= 30
      ) {
        shouldUnlock = true;
      }

      if (shouldUnlock) {
        const newAchievement = await prisma.achievement.create({
          data: {
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            points: achievement.points,
            condition: achievement.condition,
            userId,
          },
        });

        // Adicionar pontos do achievement
        await addPoints(
          userId,
          achievement.points,
          "ACHIEVEMENT_UNLOCKED",
          newAchievement.id
        );

        unlockedAchievements.push(newAchievement);
      }
    }

    return unlockedAchievements;
  } catch (error) {
    console.error("Erro ao verificar achievements:", error);
    return [];
  }
}

export async function updateLeaderboard() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        points: true,
        tasks: true,
        streakDays: true,
      },
    });

    // Ordenar por pontos
    const sorted = users
      .map((u) => ({
        userId: u.id,
        totalPoints: u.points,
        tasksCompleted: u.tasks.filter((t) => t.status === "CONCLUIDA").length,
        currentStreak: u.streakDays,
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints);

    // Atualizar leaderboard
    for (let i = 0; i < sorted.length; i++) {
      await prisma.leaderboard.upsert({
        where: { userId: sorted[i].userId },
        create: {
          userId: sorted[i].userId,
          rank: i + 1,
          totalPoints: sorted[i].totalPoints,
          tasksCompleted: sorted[i].tasksCompleted,
          currentStreak: sorted[i].currentStreak,
        },
        update: {
          rank: i + 1,
          totalPoints: sorted[i].totalPoints,
          tasksCompleted: sorted[i].tasksCompleted,
          currentStreak: sorted[i].currentStreak,
        },
      });
    }

    return sorted;
  } catch (error) {
    console.error("Erro ao atualizar leaderboard:", error);
    throw error;
  }
}

export async function getLeaderboard(limit = 10) {
  try {
    const leaderboard = await prisma.leaderboard.findMany({
      take: limit,
      orderBy: { rank: "asc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            level: true,
            points: true,
          },
        },
      },
    });

    return leaderboard;
  } catch (error) {
    console.error("Erro ao buscar leaderboard:", error);
    throw error;
  }
}

export async function getUserGameStats(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        achievements: true,
        pointsHistory: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
        leaderboard: true,
        tasks: true,
      },
    });

    if (!user) return null;

    const tasksCompleted = user.tasks.filter(
      (t) => t.status === "CONCLUIDA"
    ).length;

    return {
      id: user.id,
      name: user.name,
      points: user.points,
      level: user.level,
      streakDays: user.streakDays,
      achievements: user.achievements,
      tasksCompleted,
      leaderboardRank: user.leaderboard?.rank,
      recentActivity: user.pointsHistory,
    };
  } catch (error) {
    console.error("Erro ao buscar stats do usuário:", error);
    throw error;
  }
}

export const POINTS = POINTS_CONFIG;
