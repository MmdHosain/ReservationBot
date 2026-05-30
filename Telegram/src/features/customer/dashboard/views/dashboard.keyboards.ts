// src/features/customer/dashboard/views/dashboard.keyboards.ts
import { Markup } from "telegraf";
import { DashboardMessages } from "./dashboard.messages.ts";

export const buildDashboardKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback(DashboardMessages.myBookingsBtn, "view_my_bookings")],
    [Markup.button.callback(DashboardMessages.mySalonsBtn, "view_my_salons")],
    [Markup.button.callback(DashboardMessages.guideBtn, "view_customer_guide")]
  ]);
};
