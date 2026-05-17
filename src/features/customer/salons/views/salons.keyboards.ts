// src/features/customer/salons/views/salons.keyboards.ts
import { Markup } from "telegraf";
import { SalonMessages } from "./salons.messages.ts";

export const buildSalonKeyboard = (salonUserId: number) => {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(SalonMessages.sendMsgBtn, `send_msg_${salonUserId}`),
      Markup.button.callback(SalonMessages.reserveBtn, `reserve_salon_${salonUserId}`),
      Markup.button.callback(SalonMessages.deleteBtn, `delete_salon_${salonUserId}`)
    ]
  ]);
};

export const buildBackKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback(SalonMessages.backBtn, "back_to_customer_dashboard")]
  ]);
};
