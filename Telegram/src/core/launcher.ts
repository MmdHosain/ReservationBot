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
    } 
    else if (err?.response?.error_code === 404) {
      console.error("🚨 Error: 404 Not Found (getMe)");
      console.error("================ DEBUG INFO ================");
      console.error("The bot API endpoint could not be found. This usually happens because:");
      console.error("1. The BOT_TOKEN is malformed, has hidden spaces, newline characters, or is completely missing.");
      console.error("   (If a token is malformed, the API router tries to look up an invalid URL path and returns 404).");
      console.error("2. The Bale API Root (https://tapi.bale.ai) is temporarily down or unreachable from this network/Docker container.");
      console.error(`🔑 Provided Token: "${token ? token.substring(0, 5) + '***' + token.slice(-5) : 'EMPTY'}"`);
      console.error(`📏 Token Length: ${token ? token.length : 0} characters`);
      console.error("💡 FIX: Check your .env file and docker-compose.yml. Ensure BOT_TOKEN has no extra quotes, spaces, or line breaks.");
      console.error("============================================");
    }
    else {
      console.error("Unknown Error:", err);
    }
    process.exit(1);
  });
}
