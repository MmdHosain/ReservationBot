import { Telegraf } from "telegraf";

export function launchBaleBot(bot: Telegraf<any>, token: string) {
  bot.telegram.getMe().then((botInfo) => {
    console.log(`✨ [Bale Bot] Successfully connected as @${botInfo.username} and polling tapi.bale.ai...`);
  }).catch((_err) => {
    // Handled in bot.launch error block below
  });

  bot.launch().catch((err: any) => {
    console.error("❌ [Bale Bot] Failed to launch.");
    
    if (err?.response?.error_code === 401) {
      console.error("🚨 Error: 401 Unauthorized (Bale)");
      console.error("================ DEBUG INFO ================");
      console.error("The BALE_BOT_TOKEN provided in your .env file is invalid or not recognized by the Bale API.");
      console.error(`🔑 Provided Token: "${token ? token.substring(0, 5) + '***' + token.slice(-5) : 'EMPTY'}"`);
      console.error("🌐 Target API: https://tapi.bale.ai");
      console.error("💡 FIX: Open your Bale messenger, go to @BotFather, copy the exact token for your bot, and paste it into BALE_BOT_TOKEN inside your .env file.");
      console.error("============================================");
    } 
    else if (err?.response?.error_code === 404) {
      console.error("🚨 Error: 404 Not Found (Bale getMe)");
      console.error("================ DEBUG INFO ================");
      console.error("The Bale API endpoint could not be found. This usually happens because:");
      console.error("1. The BALE_BOT_TOKEN is malformed, has hidden spaces, newline characters, or is completely missing.");
      console.error("2. The Bale API Root (https://tapi.bale.ai) is temporarily down or unreachable from this network/Docker container.");
      console.error(`🔑 Provided Token: "${token ? token.substring(0, 5) + '***' + token.slice(-5) : 'EMPTY'}"`);
      console.error("💡 FIX: Check your .env file. Ensure BALE_BOT_TOKEN has no extra quotes, spaces, or line breaks.");
      console.error("============================================");
    }
    else if (err?.code === "ECONNRESET" || err?.message?.includes("TLS connection") || err?.message?.includes("socket disconnected")) {
      console.error("🚨 Error: Network TLS / Connection Reset (Bale tapi.bale.ai)");
      console.error("================ DEBUG INFO ================");
      console.error("The network socket disconnected before establishing a secure TLS handshake with tapi.bale.ai.");
      console.error("💡 CAUSE & FIX:");
      console.error("1. Bale API is hosted inside Iran. If you have a VPN, Proxy, or anti-filtering tool active, Bale's firewall frequently blocks or resets connections from foreign/VPN IPs.");
      console.error("2. Try disabling your VPN, or add '*.bale.ai' to your VPN's bypass / split-tunnel routing rules.");
      console.error("============================================");
    }
    else {
      console.error("Unknown Bale Launch Error:", err);
    }
  });
}
