// src/features/customer/reservations/views/reservations.keyboards.ts
import { Markup } from "telegraf";
import { ReservationMessages } from "./reservations.messages.ts";

export const buildBackKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback(ReservationMessages.backBtn, "back_to_customer_dashboard")]
  ]);
};

export const buildCancelKeyboard = (apptId: string) => {
  return Markup.inlineKeyboard([
    [Markup.button.callback(ReservationMessages.cancelBtn, `cancel_appt_${apptId}`)]
  ]);
};
