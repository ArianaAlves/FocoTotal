import app from "./app.js";
import { env } from "./config/env.js";

const start = async () => {
  const basePort = Number(env.PORT) || 3000;
  let port = basePort;
  const maxAttempts = 10;
  let attempts = 0;

  const tryListen = () =>
    new Promise((resolve, reject) => {
      const server = app
        .listen(port, () => {
          console.log(`Server running on PORT: ${port}...`);
          resolve(server);
        })
        .on("error", (err) => {
          if (err.code === "EADDRINUSE" && attempts < maxAttempts) {
            attempts++;
            port++;
            console.warn(
              `Port ${port - 1} in use. Trying port ${port} (attempt ${attempts}/${maxAttempts})...`
            );
            setTimeout(() => resolve(tryListen()), 100);
          } else {
            reject(err);
          }
        });
    });

  try {
    await tryListen();
  } catch (err) {
    console.error("Failed to start server:", err);
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
