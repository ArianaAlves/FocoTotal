import { Router } from "express";
import { userController } from "./controller.js";
import { sanitize } from "../../middlewares/sanitize.js";
import { validate } from "../../middlewares/validate.js";
import { registerSchema, loginSchema } from  "./user.schema.js"

const router = Router();

router.post(
  "/register",
  sanitize,
  validate(registerSchema),
  userController.register
);

router.post(
  "/login",
  sanitize,
  validate(loginSchema),
  userController.login
);

export default router;