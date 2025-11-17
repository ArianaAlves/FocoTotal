import { Router } from "express";
import { auth } from "../../middlewares/authMiddleware.js";
import { goalsController } from "./controller.js"; 

const router = Router();


router.get("/", auth, goalsController.listGoals);

router.post("/", auth, goalsController.createGoal);

router.put("/:id", auth, goalsController.updateGoal);

router.delete("/:id", auth, goalsController.removeGoal);

router.put("/progress/:id", auth, goalsController.updateProgress);


export default router;