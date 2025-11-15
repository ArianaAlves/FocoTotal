import { taskService } from "./service.js";

export const taskController = {
  create: async (req, res, next) => {
    try {
      const result = await taskService.create(req.user.id, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  list: async (req, res, next) => {
    try {
      const result = await taskService.findAll(req.user.id, req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const result = await taskService.update(Number(req.params.id), req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  remove: async (req, res, next) => {
    try {
      await taskService.delete(Number(req.params.id));
      res.json({ message: "Tarefa removida com sucesso." });
    } catch (error) {
      next(error);
    }
  },
};
