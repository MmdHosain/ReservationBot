// src/features/customer/salon_dashboard/views/salon_dashboard.view.ts
import type { MyContext } from "../../../../core/types.ts";
import { getSalonDashboardMessages } from "./salon_dashboard.messages.ts";
import { buildSalonDashboardKeyboard } from "./salon_dashboard.keyboards.ts";

export const showDashboard = async (ctx: MyContext, salonName: string, category: string = 'generic') => {
  const m = getSalonDashboardMessages(category);
  const msg = m.welcome(salonName);
  const kb = buildSalonDashboardKeyboard(category);
  
  if (ctx.callbackQuery) {
    await ctx.editMessageText(msg, kb).catch(() => {});
  } else {
    await ctx.reply(msg, kb);
  }
};
