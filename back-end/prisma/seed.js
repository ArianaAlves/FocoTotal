import { prisma } from "../src/database/prismaClient.js";

async function main() {
  console.log("Iniciando seed do banco de dados...");

  try {
    // Verificar se existem usuários
    const users = await prisma.user.findMany();
    console.log(`Encontrados ${users.length} usuários`);

    // Inicializar leaderboard para usuários existentes
    for (const user of users) {
      const existing = await prisma.leaderboard.findUnique({
        where: { userId: user.id },
      });

      if (!existing) {
        await prisma.leaderboard.create({
          data: {
            userId: user.id,
            rank: users.length,
            totalPoints: user.points,
            tasksCompleted: 0,
            currentStreak: user.streakDays,
          },
        });
        console.log(`✅ Leaderboard criado para usuário ${user.name}`);
      }
    }

    console.log("✅ Seed concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
