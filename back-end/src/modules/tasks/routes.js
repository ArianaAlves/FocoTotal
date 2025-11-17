import { Router } from "express";
import { auth } from "../../middlewares/authMiddleware.js";
import { taskController } from "./controller.js";
import { validate } from "../../middlewares/validate.js";
import { createTaskSchema, updateTaskSchema } from "../tasks/task.schema.js"
import { sanitize } from "../../middlewares/sanitize.js"

const router = Router();

router.get("/statistics", auth, taskController.getStatistics); 
router.get("/focus-trend", auth, taskController.getWeeklyFocus); 

router.get("/", auth, taskController.list);

router.post(
  "/",
  auth,
  sanitize,
  validate(createTaskSchema),
  taskController.create
);

router.put(
  "/:id",
  auth,
  sanitize,
  validate(updateTaskSchema),
  taskController.update
);

router.delete("/:id", auth, taskController.remove);

export default router;