// src/features/customer/salons/views/salons.keyboards.ts
import { Markup } from "telegraf";
import { SalonMessages } from "./salons.messages.ts";

export const buildSalonsKeyboard = (salons: any[], botUsername: string) => {
  const buttons = salons.map((s) => [
    Markup.button.url(s.salon_name || SalonMessages.unknownUser, `https://ble.ir/${botUsername}?start=${s.salon_telegram_id}`),
    Markup.button.callback(SalonMessages.deleteBtn, `delete_salon_${s.salon_user_id}`)
  ]);
  buttons.push([Markup.button.callback(SalonMessages.backBtn, "back_to_customer_dashboard")]);
  return Markup.inlineKeyboard(buttons);
};

export const buildBackKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback(SalonMessages.backBtn, "back_to_customer_dashboard")]
  ]);
};
