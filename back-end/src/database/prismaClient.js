import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty',
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Testar conexão ao inicializar com retry
const connectWithRetry = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      console.log("✅ Database connected successfully");
      return;
    } catch (error) {
      console.error(`❌ Database connection attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) {
        console.error("❌ All database connection attempts failed");
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
    }
  }
};

connectWithRetry().catch(console.error);

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
