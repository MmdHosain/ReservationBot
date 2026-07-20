// src/features/customer/salons/views/salons.keyboards.ts
import { Markup } from "telegraf";
import { getSalonMessages } from "./salons.messages.ts";

export const buildSalonsListKeyboard = (salons: any[], categoryStr: string = 'generic') => {
  const m = getSalonMessages(categoryStr);
  const buttons = salons.map((s) => [
    Markup.button.callback(`🏪 ${s.salon_name || m.unknownUser}`, `select_salon_${s.salon_user_id}`)
  ]);
  
  buttons.push([Markup.button.callback(m.backBtn, "back_to_customer_dashboard")]);
  
  return Markup.inlineKeyboard(buttons);
};

export const buildSalonActionKeyboard = (salonUserId: number, categoryStr: string = 'generic') => {
  const m = getSalonMessages(categoryStr);
  return Markup.inlineKeyboard([
    [Markup.button.callback(m.reserveBtn, `reserve_salon_${salonUserId}`)],
    [Markup.button.callback(m.sendMsgBtn, `send_msg_${salonUserId}`)],
    [Markup.button.callback(m.deleteBtn, `delete_salon_${salonUserId}`)],
    [Markup.button.callback(m.backToSalonsBtn, "back_to_salons")]
  ]);
};

export const buildBackToSalonsKeyboard = (categoryStr: string = 'generic') => {
  const m = getSalonMessages(categoryStr);
  return Markup.inlineKeyboard([
    [Markup.button.callback(m.backToSalonsBtn, "back_to_salons")]
  ]);
};
