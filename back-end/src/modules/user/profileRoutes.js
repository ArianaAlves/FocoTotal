import { Router } from "express";
import { profileController } from "./profileController.js";
import { auth } from "../../middlewares/authMiddleware.js";
import { upload } from "../../middlewares/uploadMiddleware.js";

const router = Router();

// Obter perfil de um usuário
router.get("/:id", profileController.getProfile);

// Atualizar perfil (requer autenticação)
router.put("/", auth, profileController.updateProfile);

// Upload de avatar (requer autenticação)
router.post("/upload/avatar", auth, upload.single("avatar"), profileController.uploadAvatar);

// Upload de capa (requer autenticação)
router.post("/upload/cover", auth, upload.single("cover"), profileController.uploadCover);

// Deletar imagem do perfil
router.delete("/:type", auth, profileController.deleteProfileImage);

export default router;
