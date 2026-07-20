// src/features/customer/guide/views/guide.keyboards.ts
import { Markup } from "telegraf";
import { getGuideMessages } from "./guide.messages.ts";

export const buildBackKeyboard = (categoryStr: string = 'generic') => {
  const m = getGuideMessages(categoryStr);
  return Markup.inlineKeyboard([
    [Markup.button.callback(m.backBtn, "back_to_customer_dashboard")]
  ]);
};
