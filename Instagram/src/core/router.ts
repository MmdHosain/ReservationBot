// Instagram/src/core/router.ts
import { IGContext } from "./context.ts";

/**
 * The main entry point for Instagram Webhook events.
 * Similar to Telegraf's bot.use() or Composer.
 */
export const handleIGEvent = async (ctx: IGContext) => {
  console.log(`[Router] Processing event for ${ctx.from.id}. Step: ${ctx.session.step || 'None'}`);

  // Handle Quick Replies / Postbacks (Equivalent to ctx.action)
  if (ctx.callbackQuery) {
    const payload = ctx.callbackQuery.data;
    
    if (payload === "TEST_PAYLOAD") {
      await ctx.reply("✅ You clicked the test button!");
      return;
    }

    await ctx.reply(`You triggered an unknown action: ${payload}`);
    return;
  }

  // Handle Standard Text Messages (Equivalent to ctx.on('text'))
  if (ctx.message?.text) {
    const text = ctx.message.text;
    
    if (text === "/start" || text.toLowerCase() === "hi" || text.toLowerCase() === "سلام") {
      ctx.session = { step: "onboarding" };
      await ctx.replyWithKeyboard("👋 Welcome to the Instagram Reservation Bot! What would you like to do?", [
        { title: "🚀 Book Appointment", payload: "TEST_PAYLOAD" },
        { title: "ℹ️ Help", payload: "HELP_PAYLOAD" }
      ]);
      return;
    }

    await ctx.reply(`You said: ${text}\nType 'hi' to start.`);
  }
};
