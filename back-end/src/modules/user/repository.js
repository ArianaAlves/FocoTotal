import { prisma } from "../../database/prismaClient.js";

export const userRepository = {
  findByEmail: (email) => prisma.user.findUnique({ where: { email } }),

  create: (data) => prisma.user.create({ data }),
};
