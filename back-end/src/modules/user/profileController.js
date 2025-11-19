import { prisma } from "../../database/prismaClient.js";
import fs from "fs";
import path from "path";

export const profileController = {
  getProfile: async (req, res, next) => {
    try {
      const userId = Number(req.params.id);
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          coverImage: true,
          bio: true,
          points: true,
          level: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Usuário não encontrado",
        });
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const userId = Number(req.user.id);
      const { name, bio } = req.body;

      const updateData = {
        ...(name && { name }),
        ...(bio !== undefined && { bio }),
      };

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          coverImage: true,
          bio: true,
          points: true,
          level: true,
        },
      });

      res.json({
        success: true,
        message: "Perfil atualizado com sucesso",
        data: user,
      });
    } catch (error) {
      if (error.code === "P2002") {
        return res.status(400).json({
          success: false,
          error: "Email já está em uso",
        });
      }
      next(error);
    }
  },

  uploadAvatar: async (req, res, next) => {
    try {
      const userId = Number(req.user.id);

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "Nenhuma imagem foi enviada",
        });
      }

      // Obter usuário anterior para deletar avatar antigo
      const oldUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true },
      });

      // Deletar arquivo anterior se existir
      if (oldUser?.avatar) {
        const oldPath = path.join(process.cwd(), "public", oldUser.avatar);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // Salvar novo avatar
      const avatarPath = `/uploads/${req.file.filename}`;

      const user = await prisma.user.update({
        where: { id: userId },
        data: { avatar: avatarPath },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          coverImage: true,
          bio: true,
        },
      });

      res.json({
        success: true,
        message: "Avatar atualizado com sucesso",
        data: user,
      });
    } catch (error) {
      // Deletar arquivo enviado em caso de erro
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  },

  uploadCover: async (req, res, next) => {
    try {
      const userId = Number(req.user.id);

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "Nenhuma imagem foi enviada",
        });
      }

      // Obter usuário anterior para deletar capa antiga
      const oldUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { coverImage: true },
      });

      // Deletar arquivo anterior se existir
      if (oldUser?.coverImage) {
        const oldPath = path.join(process.cwd(), "public", oldUser.coverImage);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // Salvar nova capa
      const coverPath = `/uploads/${req.file.filename}`;

      const user = await prisma.user.update({
        where: { id: userId },
        data: { coverImage: coverPath },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          coverImage: true,
          bio: true,
        },
      });

      res.json({
        success: true,
        message: "Capa atualizada com sucesso",
        data: user,
      });
    } catch (error) {
      // Deletar arquivo enviado em caso de erro
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  },

  deleteProfileImage: async (req, res, next) => {
    try {
      const userId = Number(req.user.id);
      const { type } = req.params; // 'avatar' ou 'cover'

      const updateData = {};
      let imageField = "";

      if (type === "avatar") {
        updateData.avatar = null;
        imageField = "avatar";
      } else if (type === "cover") {
        updateData.coverImage = null;
        imageField = "coverImage";
      } else {
        return res.status(400).json({
          success: false,
          error: "Tipo de imagem inválido",
        });
      }

      // Obter imagem anterior para deletar
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { [imageField]: true },
      });

      // Deletar arquivo se existir
      if (user?.[imageField]) {
        const imagePath = path.join(process.cwd(), "public", user[imageField]);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          coverImage: true,
        },
      });

      res.json({
        success: true,
        message: "Imagem removida com sucesso",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },
};
