import { Telegraf, session } from "telegraf";
import type { MyContext } from "../../core/types.ts";
import config from "../../config/index.ts";
import { stage } from "../../core/stage.ts";
import { botHandlers } from "../../core/handlers.ts";
import { contextMiddleware } from "../../core/middlewares/context.middleware.ts";
import { getCoreMessages } from "../../core/messages.ts";
import { launchTelegramBot } from "./launcher.ts";

export const startTelegramBot = async () => {
  if (!config.platforms.telegram.enabled) {
    console.log("⚪ [Telegram Platform] Disabled via configuration.");
    return;
  }

  const token = config.platforms.telegram.token;
  if (!token) {
    console.error("❌ [Telegram Platform] TELEGRAM_BOT_TOKEN is missing in environment variables.");
    return;
  }

  console.log("🔵 [Telegram Platform] Starting bot on official Telegram API");

  const bot = new Telegraf<MyContext>(token);

  // Inject platform indicator into context
  bot.use(async (ctx, next) => {
    ctx.platform = "telegram";
    return next();
  });

  bot.use(session());
  bot.use(contextMiddleware);
  bot.use(stage.middleware());
  bot.use(botHandlers);

  bot.catch((err: unknown, ctx: MyContext) => {
    console.error(
      `❌ [Telegram Error] Error for update ${ctx.update?.update_id}:`,
      err
    );
    try {
      ctx.reply(getCoreMessages(ctx.businessCategory).globalError).catch(() => {});
    } catch (e) {
      console.error("❌ [Telegram Error] Failed to send fallback error message:", e);
    }
  });

  launchTelegramBot(bot, token);

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
