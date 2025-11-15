import { taskRepository } from "./repository.js";

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

  delete: async (id) => {
    return taskRepository.delete(id);
  },
};
