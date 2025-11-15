import { userService } from "./service.js";

export const userController = {
  register: async (req, res, next) => {
    try {
      const result = await userService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const result = await userService.login(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
