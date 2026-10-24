// src/features/customer/salon_dashboard/views/salon_dashboard.keyboards.ts
import { Markup } from "telegraf";
import { getSalonDashboardMessages } from "./salon_dashboard.messages.ts";

export const buildSalonDashboardKeyboard = (category: string = 'generic') => {
  const m = getSalonDashboardMessages(category);
  return Markup.inlineKeyboard([
    [Markup.button.callback(m.bookBtn, "start_booking")],
    [Markup.button.callback(m.backBtn, "back_to_main")]
  ]);
};
