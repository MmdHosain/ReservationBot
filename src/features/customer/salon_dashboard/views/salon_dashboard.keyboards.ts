import { Markup } from "telegraf";
import { SalonDashboardMessages } from "./salon_dashboard.messages.ts";

export const buildSalonDashboardKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback(SalonDashboardMessages.bookBtn, "start_booking")],
    [Markup.button.callback(SalonDashboardMessages.backBtn, "back_to_main")]
  ]);
};
