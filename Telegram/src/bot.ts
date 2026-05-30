// src/bot.ts
import { Telegraf, session } from "telegraf";
import type { MyContext } from "./core/types.ts";
import config from "./core/config.ts";

import { stage } from "./core/stage.ts";
import { botHandlers } from "./core/handlers.ts";

import { initDB } from "./db/index.ts";
import { startCronJobs } from "./core/cron.ts";
import { launchBot } from "./core/launcher.ts";
import { MESSAGES } from "./core/messages.ts";

const token: string = config.token;

const bot = new Telegraf<MyContext>(token, {
  telegram: {
    apiRoot: "https://tapi.bale.ai",
  },
});

bot.use(session());
bot.use(stage.middleware());
bot.use(botHandlers);

// --- Global Telegraf Error Handler ---
bot.catch((err: unknown, ctx: MyContext) => {
  console.error(`❌ [Bot Error] Error for update ${ctx.update?.update_id}:`, err);
  try {
    // Attempt to notify the user gracefully
    ctx.reply(MESSAGES.globalError).catch(() => {});
  } catch (e) {
    console.error("❌ [Bot Error] Failed to send fallback error message:", e);
  }
});

// --- Node.js Process Crash Prevention ---
process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 [Unhandled Rejection] at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("🚨 [Uncaught Exception]:", error);
});

await initDB();
startCronJobs(bot);

launchBot(bot, token);

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
