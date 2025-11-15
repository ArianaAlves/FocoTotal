import { taskRepository } from "./repository.js";
import { prisma } from "../../database/prismaClient.js";

export const taskService = {
  create: async (userId, data) => {
    return taskRepository.create({
      ...data,
      userId,
      dueDate: new Date(data.dueDate),
      reminderDate: data.reminderDate
        ? new Date(data.reminderDate)
        : null,
    });
  },

  findAll: async (userId, filters) => {
    return taskRepository.findAllByUser(userId, filters);
  },

  update: async (id, data) => {
    return taskRepository.update(id, data);
  },

  delete: async (id, userId) => {
    // Verificar se a tarefa existe e pertence ao usuário
    const task = await prisma.task.findUnique({
      where: { id }
    });

    if (!task) {
      throw new Error("Tarefa não encontrada");
    }

    if (task.userId !== userId) {
      throw new Error("Você não tem permissão para deletar esta tarefa");
    }

    return taskRepository.delete(id);
  },
};
