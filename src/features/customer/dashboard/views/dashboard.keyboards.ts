// src/features/customer/dashboard/views/dashboard.keyboards.ts
import { Markup } from "telegraf";
import { getDashboardMessages } from "./dashboard.messages.ts";

export const buildDashboardKeyboard = (categoryStr: string = 'generic') => {
  const m = getDashboardMessages(categoryStr);
  return Markup.inlineKeyboard([
    [Markup.button.callback(m.myBookingsBtn, "view_my_bookings")],
    [Markup.button.callback(m.mySalonsBtn, "view_my_salons")],
    [Markup.button.callback(m.guideBtn, "view_customer_guide")]
  ]);
};
