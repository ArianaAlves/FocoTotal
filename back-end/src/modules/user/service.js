import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/generateToken.js";
import { userRepository } from "./repository.js";

export const userService = {
  register: async (data) => {
    // Validação básica
    if (!data.name || !data.email || !data.password) {
      throw new Error("Nome, email e senha são obrigatórios");
    }

    if (data.password.length < 6) {
      throw new Error("Senha deve ter pelo menos 6 caracteres");
    }

    const existing = await userRepository.findByEmail(data.email);

    if (existing) throw new Error("E-mail já cadastrado.");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    // Remover senha do retorno
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, message: "Usuário criado com sucesso" };
  },

  login: async ({ email, password }) => {
    try {
      // Validação básica
      if (!email || !password) {
        throw new Error("Email e senha são obrigatórios");
      }

      // Log para debug (sem dados sensíveis)
      console.log("🔐 Login attempt for email:", email.substring(0, 3) + "***");

      const user = await userRepository.findByEmail(email);

      if (!user) {
        console.log("❌ User not found for email:", email.substring(0, 3) + "***");
        throw new Error("Usuário não encontrado.");
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        console.log("❌ Invalid password for user:", user.id);
        throw new Error("Senha incorreta.");
      }

      const token = generateToken(user.id);
      console.log("✅ Login successful for user:", user.id);

      // Remover senha do retorno
      const { password: _, ...userWithoutPassword } = user;
      return { token, user: userWithoutPassword };
    } catch (error) {
      console.error("❌ Login service error:", error.message);
      throw error;
    }
  },
};
