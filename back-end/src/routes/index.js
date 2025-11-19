import { Router } from "express";
import taskRoutes from "../modules/tasks/routes.js";
import userRoutes from "../modules/user/routes.js";
import goalsRoutes from "../modules/goals/routes.js";
import gamificationRoutes from "../modules/gamification/gamificationRoutes.js";
import profileRoutes from "../modules/user/profileRoutes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ status: "ok", service: "FocoTotal API" });
});

router.get("/health", (req, res) => {
  res.json({
    message: "API funcionando!",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.use("/users", userRoutes);
router.use("/profile", profileRoutes);
router.use("/tasks", taskRoutes);
router.use("/goals", goalsRoutes);
router.use("/gamification", gamificationRoutes);

export default router;