import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || "fallback-secret-key-for-development",
  DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db",
};
