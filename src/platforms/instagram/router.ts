// src/platforms/instagram/router.ts
import { IGContext } from "./context.ts";
import { getOrganizationByIGPageId } from "../../db/organization.repository.ts";
import { getEventTypesByOrganization } from "../../db/event_type.repository.ts";

/**
 * The main entry point for Instagram Webhook events.
 * Similar to Telegraf's bot.use() or Composer.
 */
export const handleIGEvent = async (ctx: IGContext) => {
  console.log(`[Instagram Router] Processing event for ${ctx.from.id}. Step: ${ctx.session.step || 'None'}`);

  // Fetch the Organization linked to this IG Page
  const org = await getOrganizationByIGPageId("default_page");
  if (!org) {
    await ctx.reply("⚠️ System is currently unconfigured. No Organization found.");
    return;
  }

  // Handle Quick Replies / Postbacks (Equivalent to ctx.action)
  if (ctx.callbackQuery) {
    const payload = ctx.callbackQuery.data;
    
    if (payload === "BOOK_APPOINTMENT") {
      const eventTypes = await getEventTypesByOrganization(org.id);
      
      if (eventTypes.length === 0) {
        await ctx.reply("Sorry, there are no services available at the moment.");
        return;
      }
      
      // Enforce Meta's 13 button limit
      const buttons = eventTypes.slice(0, 13).map(et => ({
        title: et.name,
        payload: `BOOK_SVC_${et.id}`
      }));

      await ctx.replyWithKeyboard("Please select a service you'd like to book:", buttons);
      return;
    }

    if (payload.startsWith("BOOK_SVC_")) {
      const svcId = payload.replace("BOOK_SVC_", "");
      // Next steps would call getAvailableDaysV2 and send Quick Replies for dates.
      await ctx.reply(`✅ Service selected: ${svcId}. Date & Time selection flow will continue here in V2.`);
      return;
    }

    if (payload === "HELP_PAYLOAD") {
      await ctx.reply("ℹ️ This is the V2 Event-Driven Booking Bot. Type 'hi' to start over.");
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
      await ctx.replyWithKeyboard(`👋 Welcome to ${org.name}! What would you like to do?`, [
        { title: "🚀 Book Appointment", payload: "BOOK_APPOINTMENT" },
        { title: "ℹ️ Help", payload: "HELP_PAYLOAD" }
      ]);
      return;
    }

    await ctx.reply(`You said: ${text}\nType 'hi' to start.`);
  }
};
