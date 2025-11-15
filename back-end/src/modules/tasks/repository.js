import { prisma } from "../../database/prismaClient.js";

export const taskRepository = {
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

  update: (id, data) => prisma.task.update({ where: { id }, data }),

  delete: (id) => prisma.task.delete({ where: { id } }),
};
