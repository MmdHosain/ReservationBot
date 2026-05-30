// src/features/customer/guide/views/guide.keyboards.ts
import { Markup } from "telegraf";
import { GuideMessages } from "./guide.messages.ts";

export const buildBackKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback(GuideMessages.backBtn, "back_to_customer_dashboard")]
  ]);
};
