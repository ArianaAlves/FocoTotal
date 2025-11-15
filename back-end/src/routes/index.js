import { Router } from "express";
import taskRoutes from "../modules/tasks/routes.js";
import userRoutes from "../modules/user/routes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);

export default router;
