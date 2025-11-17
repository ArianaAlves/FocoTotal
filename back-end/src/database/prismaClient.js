import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

// Testar conexão ao inicializar
prisma.$connect()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((error) => console.error("❌ Database connection failed:", error));
