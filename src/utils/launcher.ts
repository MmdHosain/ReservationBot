// src/utils/launcher.ts
import { Telegraf } from "telegraf";

export function launchBot(bot: Telegraf<any>, token: string) {
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
}
