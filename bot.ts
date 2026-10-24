import "reflect-metadata";
import "dotenv/config";
import { initDB } from "./src/db/index.ts";
import config from "./src/config/index.ts";
import { startBaleBot } from "./src/platforms/bale/index.ts";
import { startTelegramBot } from "./src/platforms/telegram/index.ts";
import { startInstagramBot } from "./src/platforms/instagram/index.ts";

async function main() {
  console.log("🚀 Initializing Reservation Bot System...");

  // 1. Initialize Shared PostgreSQL Connection
  await initDB();

  // 2. Conditionally Start Platforms
  if (config.platforms.bale.enabled) {
    await startBaleBot();
  }

  if (config.platforms.telegram.enabled) {
    await startTelegramBot();
  }

  if (config.platforms.instagram.enabled) {
    startInstagramBot();
  }

  console.log("✅ Active platform services are operational.");
}

// --- Global Node.js Process Crash Prevention ---
process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 [Unhandled Rejection] at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("🚨 [Uncaught Exception]:", error);
});

main().catch((err) => {
  console.error("❌ Fatal Startup Error:", err);
  process.exit(1);
});
