// src/features/customer/reservations/views/reservations.view.ts
import type { MyContext } from "../../../../core/types.ts";
import { ReservationMessages } from "./reservations.messages.ts";
import {
  buildBackKeyboard,
  buildCancelKeyboard,
} from "./reservations.keyboards.ts";
import { formatFriendlyDate } from "../../../../core/utils/date.ts";

export const showReservations = async (
  ctx: MyContext,
  appointments: any[],
  calendar: string
) => {
  const kb = buildBackKeyboard();
  if (appointments.length === 0) {
    if (ctx.callbackQuery) {
      return ctx
        .editMessageText(ReservationMessages.noBookings, kb)
        .catch(() => {});
    }
    return ctx.reply(ReservationMessages.noBookings, kb);
  }

  await ctx.reply(ReservationMessages.bookingsHeader);
  for (const a of appointments) {
    const timeStr =
      typeof a.appointment_time === "string"
        ? a.appointment_time.substring(0, 5)
        : a.appointment_time;
    const friendlyDate = formatFriendlyDate(a.appointment_date, calendar);

    let msgText = `${a.service_name} - ${friendlyDate} ساعت ${timeStr}`;
    if (a.staff_name) msgText += `\nپرسنل: ${a.staff_name}`;

    await ctx.reply(msgText, buildCancelKeyboard(a.id));
  }
  await ctx.reply(ReservationMessages.backPrompt, kb);
};

export const showCancelSuccess = async (ctx: MyContext) => {
  await ctx.answerCbQuery(ReservationMessages.cancelSuccess).catch(() => {});
  if (ctx.callbackQuery && ctx.callbackQuery.message) {
    const msg = ctx.callbackQuery.message as any;
    if (msg.text) {
      await ctx
        .editMessageText(msg.text + "\n\n" + ReservationMessages.cancelledTag)
        .catch(() => {});
    }
  }
};
