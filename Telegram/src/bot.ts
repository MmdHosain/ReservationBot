// Telegram/src/bot.ts
import { Telegraf, session } from "telegraf";
import type { MyContext } from "./core/types.ts";
import config from "./core/config.ts";

import { stage } from "./core/stage.ts";
import { botHandlers } from "./core/handlers.ts";

import { initDB } from "./db/index.ts";
import { startCronJobs } from "./core/cron.ts";
import { launchBot } from "./core/launcher.ts";
import { MESSAGES } from "./core/messages.ts";

export const startTelegramBot = async () => {
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
      ctx.reply(MESSAGES.globalError).catch(() => {});
    } catch (e) {
      console.error("❌ [Bot Error] Failed to send fallback error message:", e);
    }
  });

  // Initialize Shared DB before accepting requests
  await initDB();
  startCronJobs(bot);

  launchBot(bot, token);

  // Enable graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
