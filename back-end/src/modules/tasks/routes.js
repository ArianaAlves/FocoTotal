import { Router } from "express";
import { auth } from "../../middlewares/authMiddleware.js";
import { taskController } from "./controller.js";

const router = Router();

router.post("/", auth, taskController.create);
router.get("/", auth, taskController.list);
router.put("/:id", auth, taskController.update);
router.delete("/:id", auth, taskController.remove);

export default router;
