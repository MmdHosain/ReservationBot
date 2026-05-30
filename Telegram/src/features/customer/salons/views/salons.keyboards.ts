// src/features/customer/salons/views/salons.keyboards.ts
import { Markup } from "telegraf";
import { SalonMessages } from "./salons.messages.ts";

export const buildSalonsListKeyboard = (salons: any[]) => {
  const buttons = salons.map((s) => [
    Markup.button.callback(`🏪 ${s.salon_name || SalonMessages.unknownUser}`, `select_salon_${s.salon_user_id}`)
  ]);
  
  buttons.push([Markup.button.callback(SalonMessages.backBtn, "back_to_customer_dashboard")]);
  
  return Markup.inlineKeyboard(buttons);
};

export const buildSalonActionKeyboard = (salonUserId: number) => {
  return Markup.inlineKeyboard([
    [Markup.button.callback(SalonMessages.reserveBtn, `reserve_salon_${salonUserId}`)],
    [Markup.button.callback(SalonMessages.sendMsgBtn, `send_msg_${salonUserId}`)],
    [Markup.button.callback(SalonMessages.deleteBtn, `delete_salon_${salonUserId}`)],
    [Markup.button.callback(SalonMessages.backToSalonsBtn, "back_to_salons")]
  ]);
};

export const buildBackToSalonsKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback(SalonMessages.backToSalonsBtn, "back_to_salons")]
  ]);
};
