import { Router } from "express";
import taskRoutes from "../modules/tasks/routes.js";
import userRoutes from "../modules/user/routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ message: "API funcionando!", timestamp: new Date().toISOString() });
});

router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);

export default router;
