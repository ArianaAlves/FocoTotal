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
      
      const result = await taskService.update(
        Number(req.params.id), 
        req.body, 
        req.user.id 
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  remove: async (req, res, next) => {
    try {
      await taskService.delete(Number(req.params.id), req.user.id);
      res.json({ message: "Tarefa removida com sucesso." });
    } catch (error) {
      next(error);
    }
  },
  
  getStatistics: async (req, res, next) => {
    try {
      const stats = await taskService.getStatistics(req.user.id);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  },

  getWeeklyFocus: async (req, res) => {
        try {
            
            const userId = req.user.id; 
            const focusData = await taskService.getWeeklyFocusData(userId);
            return res.status(200).json({ weeklyData: focusData });
        } catch (error) {
            console.error("Erro no controller getWeeklyFocus:", error);
            return res.status(500).json({ message: "Falha ao obter dados de foco." });
        }
    },
};