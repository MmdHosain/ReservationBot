// src/bot.ts
import { Telegraf, session } from "telegraf";
import type { MyContext } from "./types/index.ts";
import config from "./config.ts";

import { stage } from "./scenes/index.ts";
import { startHandler } from "./handlers/startHandler.ts";
import { managerHandler } from "./handlers/managerHandler.ts";
import { deleteHandler } from "./handlers/deleteHandler.ts";
import { myBookingsHandler } from "./handlers/myBookingsHandler.ts";
import { showCustomerDashboard, mySalonsHandler, deleteSalonHandler, showCustomerGuide } from "./handlers/customerDashboard.ts";
import { updateCalendarType } from "./db/user.repository.ts";
import { MESSAGES } from "./messages.ts";

import { initDB } from "./db/index.ts";
import { cancelAppointment } from "./db/appointment.repository.ts";
import { startCronJobs } from "./cron.ts";

const token: string = config.token;

const bot = new Telegraf<MyContext>(token, {
  telegram: {
    apiRoot: "https://tapi.bale.ai",
  },
});

bot.use(session());
bot.use(stage.middleware());

await initDB();
startCronJobs(bot);

bot.start(startHandler);
bot.command("manager", managerHandler);
bot.command("delete", deleteHandler);
bot.command("my_bookings", myBookingsHandler);

bot.command("shamsi", async (ctx) => {
  await updateCalendarType(ctx.from.id, 'shamsi');
  await ctx.reply(MESSAGES.calendarSetShamsi);
});

bot.command("miladi", async (ctx) => {
  await updateCalendarType(ctx.from.id, 'miladi');
  await ctx.reply(MESSAGES.calendarSetMiladi);
});

bot.action("view_my_bookings", myBookingsHandler);
bot.action("view_my_salons", mySalonsHandler);
bot.action("view_customer_guide", showCustomerGuide);
bot.action("back_to_customer_dashboard", showCustomerDashboard);
bot.action(/delete_salon_(\d+)/, deleteSalonHandler);

bot.action(/cancel_appt_(\d+)/, async (ctx) => {
  const apptId = parseInt(ctx.match[1]);
  await cancelAppointment(apptId, ctx.from!.id);
  await ctx.answerCbQuery("نوبت با موفقیت لغو شد.").catch(() => {});
  if (ctx.callbackQuery.message) {
      const msg = ctx.callbackQuery.message as any;
      await ctx.editMessageText(msg.text + "\n\n(لغو شده)").catch(() => {});
  }
});

bot.launch().then(() => {
  console.log("✨ Bot is running…");
}).catch((err: any) => {
  console.error("❌ Failed to launch the bot.");
  if (err?.response?.error_code === 401) {
    console.error("🚨 Error: 401 Unauthorized");
    console.error("================ DEBUG INFO ================");
    console.error("The BOT_TOKEN provided in your .env file is invalid or not recognized by the Bale API.");
    console.error(`🔑 Provided Token: "${token ? token.substring(0, 5) + '***' + token.slice(-5) : 'EMPTY'}"`);
    console.error("🌐 Target API: https://tapi.bale.ai");
    console.error("💡 FIX: Open your Bale messenger, go to @BotFather, copy the exact token for your bot, and paste it into BOT_TOKEN inside your .env file.");
    console.error("============================================");
  } else {
    console.error("Unknown Error:", err);
  }
  process.exit(1);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
