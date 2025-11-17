import app from "./app.js";
import { env } from "./config/env.js";

const start = async () => {
  const port = Number(env.PORT) || 3000;
  const host = '0.0.0.0';

  try {
    app.listen(port, host, () => {
      console.log(`🚀 Server running on ${host}:${port}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

start();
