import { Router } from "express";
import taskRoutes from "../modules/tasks/routes.js";
import userRoutes from "../modules/user/routes.js";
import goalsRoutes from "../modules/goals/routes.js"; 

const router = Router();

router.get("/api/", (req, res) => {
  res.json({ status: "ok", service: "FocoTotal API" });
});

router.get("/api/health", (req, res) => {
  res.json({
    message: "API funcionando!",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.use("/api/users", userRoutes);
router.use("/api/tasks", taskRoutes);
router.use("/api/goals", goalsRoutes); 

export default router;