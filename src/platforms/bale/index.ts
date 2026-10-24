import { Telegraf, session } from "telegraf";
import type { MyContext } from "../../core/types.ts";
import config from "../../config/index.ts";
import { stage } from "../../core/stage.ts";
import { botHandlers } from "../../core/handlers.ts";
import { contextMiddleware } from "../../core/middlewares/context.middleware.ts";
import { getCoreMessages } from "../../core/messages.ts";
import { startCronJobs } from "../../core/cron.ts";
import { launchBaleBot } from "./launcher.ts";

export const startBaleBot = async () => {
  if (!config.platforms.bale.enabled) {
    console.log("⚪ [Bale Platform] Disabled via configuration.");
    return;
  }

  const token = config.platforms.bale.token;
  if (!token) {
    console.error("❌ [Bale Platform] BALE_BOT_TOKEN is missing in environment variables.");
    return;
  }

  console.log("🟢 [Bale Platform] Starting bot on", config.platforms.bale.apiRoot);

  const bot = new Telegraf<MyContext>(token, {
    telegram: {
      apiRoot: config.platforms.bale.apiRoot,
    },
  });

  // Inject platform indicator into context
  bot.use(async (ctx, next) => {
    ctx.platform = "bale";
    return next();
  });

  bot.use(session());
  bot.use(contextMiddleware);
  bot.use(stage.middleware());
  bot.use(botHandlers);

  bot.catch((err: unknown, ctx: MyContext) => {
    console.error(
      `❌ [Bale Error] Error for update ${ctx.update?.update_id}:`,
      err
    );
    try {
      ctx.reply(getCoreMessages(ctx.businessCategory).globalError).catch(() => {});
    } catch (e) {
      console.error("❌ [Bale Error] Failed to send fallback error message:", e);
    }
  });

  startCronJobs(bot);
  launchBaleBot(bot, token);

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
