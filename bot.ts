import "reflect-metadata";
import "dotenv/config";
import { startTelegramBot } from "./Telegram/src/bot.ts";
import { startInstagramBot } from "./Instagram/src/index.ts";

async function main() {
  console.log("🚀 Starting Reservation Bot System...");

  // 1. Start Telegram Bot & Initialize Shared Database
  await startTelegramBot();

  // 2. Start Instagram Webhook Express Server
  startInstagramBot();

  console.log("✅ All systems are running concurrently!");
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
