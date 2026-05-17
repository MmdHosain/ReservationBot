import type { MyContext } from "../../../../core/types.ts";
import { SalonDashboardMessages } from "./salon_dashboard.messages.ts";
import { buildSalonDashboardKeyboard } from "./salon_dashboard.keyboards.ts";

export const showDashboard = async (ctx: MyContext, salonName: string) => {
  const msg = SalonDashboardMessages.welcome(salonName);
  const kb = buildSalonDashboardKeyboard();
  
  if (ctx.callbackQuery) {
    await ctx.editMessageText(msg, kb).catch(() => {});
  } else {
    await ctx.reply(msg, kb);
  }
};
