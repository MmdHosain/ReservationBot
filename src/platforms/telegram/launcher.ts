import { Telegraf } from "telegraf";

export function launchTelegramBot(bot: Telegraf<any>, token: string) {
  bot.telegram.getMe().then((botInfo) => {
    console.log(`✨ [Telegram Bot] Successfully connected as @${botInfo.username} and polling api.telegram.org...`);
  }).catch((_err) => {
    // Handled in launch catch block
  });

  bot.launch().catch((err: any) => {
    console.error("❌ [Telegram Bot] Failed to launch.", err);
  });
}
