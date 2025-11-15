import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/generateToken.js";
import { userRepository } from "./repository.js";

export const userService = {
  register: async (data) => {
    const existing = await userRepository.findByEmail(data.email);

    if (existing) throw new Error("E-mail já cadastrado.");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return user;
  },

  login: async ({ email, password }) => {
    const user = await userRepository.findByEmail(email);

    if (!user) throw new Error("Usuário não encontrado.");

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new Error("Senha incorreta.");

    const token = generateToken(user.id);

    return { token, user };
  },
};
