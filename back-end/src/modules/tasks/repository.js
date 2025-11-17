import { prisma } from "../../database/prismaClient.js";
import { Prisma } from "@prisma/client"; 

const taskRepository = {
  create: (data) => prisma.task.create({ data }),

  findAllByUser: (userId, filters) => {
    const where = {
      userId,
      status: filters.status ?? undefined,
      subject: filters.subject ?? undefined,
      priority: filters.priority ?? undefined,
    };

    if (filters.title) {
      where.title = { contains: filters.title }; 
    }

    return prisma.task.findMany({
      where,
      orderBy: { dueDate: "asc" },
    });
  },

  
  update: (id, data) => prisma.task.update({ where: { id: Number(id) }, data }),

 
  delete: (id) => prisma.task.delete({ where: { id: Number(id) } }),

  getStatistics: async (userId) => {
    const statusCounts = await prisma.task.groupBy({
      by: ['status'],
      where: { userId },
      _count: { id: true },
    });

    const nearestTask = await prisma.task.findFirst({
      where: { userId, status: 'PENDENTE' },
      orderBy: { dueDate: 'asc' },
      select: { title: true, dueDate: true }, 
    });

    const totalTasks = await prisma.task.count({
      where: { userId },
    });

    return { statusCounts, nearestTask, totalTasks };
  },
  
  getWeeklyFocus: async (userId) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dateLimit = sevenDaysAgo.toISOString();

    const weeklyData = await prisma.$queryRaw(Prisma.sql`
        SELECT 
            DATE("completedAt") as day, 
            COUNT(id) as count
        FROM 
            "Task" 
        WHERE 
            "userId" = ${userId} AND 
            status = 'CONCLUIDA' AND 
            "completedAt" >= ${dateLimit}
        GROUP BY 
            day
        ORDER BY 
            day ASC
    `);

    return weeklyData;
  },
};

export { taskRepository };