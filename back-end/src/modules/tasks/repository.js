import { prisma } from "../../database/prismaClient.js";

export const taskRepository = {
  create: (data) => prisma.task.create({ data }),

  findAllByUser: (userId, filters) =>
    prisma.task.findMany({
      where: {
        userId,
        title: filters.title
          ? { contains: filters.title, mode: "insensitive" }
          : undefined,
        status: filters.status ?? undefined,
        subject: filters.subject ?? undefined,
        priority: filters.priority ?? undefined,
      },
      orderBy: { dueDate: "asc" },
    }),

  update: (id, data) =>
    prisma.task.update({ where: { id }, data }),

  delete: (id) =>
    prisma.task.delete({ where: { id } }),
};
