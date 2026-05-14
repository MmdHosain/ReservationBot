// src/bot.ts
import { Telegraf, session } from "telegraf";
import type { MyContext } from "./types/index.ts";
import config from "./config.ts";

import { stage } from "./scenes/index.ts";
import { botHandlers } from "./handlers/index.ts";

import { initDB } from "./db/index.ts";
import { startCronJobs } from "./cron.ts";
import { launchBot } from "./utils/launcher.ts";

const token: string = config.token;

const bot = new Telegraf<MyContext>(token, {
  telegram: {
    apiRoot: "https://tapi.bale.ai",
  },
});

bot.use(session());
bot.use(stage.middleware());
bot.use(botHandlers);

await initDB();
startCronJobs(bot);

launchBot(bot, token);

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
