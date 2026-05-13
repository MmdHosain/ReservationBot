// src/handlers/myBookingsHandler.ts
import { Markup } from "telegraf";
import { getAppointmentsForCustomer } from "../db/appointment.repository.ts";
import { getOrCreateUser } from "../db/user.repository.ts";
import { formatFriendlyDate } from "../utils/date.ts";
import { MESSAGES } from "../messages.ts";

export const myBookingsHandler = async (ctx: any) => {
  if (ctx.callbackQuery) {
    await ctx.answerCbQuery().catch(() => {});
  }
  
  const telegramId = ctx.from.id;
  const appointments = await getAppointmentsForCustomer(telegramId);
  const user = await getOrCreateUser(telegramId);
  const calendar = user.calendar_type || 'shamsi';

  const kb = Markup.inlineKeyboard([[Markup.button.callback(MESSAGES.backToCustomerDashboardBtn, "back_to_customer_dashboard")]]);

  if (appointments.length === 0) {
    if (ctx.callbackQuery) {
      return ctx.editMessageText(MESSAGES.customerNoBookings, kb).catch(() => {});
    }
    return ctx.reply(MESSAGES.customerNoBookings, kb);
  }

  await ctx.reply(MESSAGES.customerBookingsHeader);
  for (const a of appointments) {
    const timeStr = typeof a.appointment_time === "string" ? a.appointment_time.substring(0, 5) : a.appointment_time;
    const friendlyDate = formatFriendlyDate(a.appointment_date, calendar);
    
    let msgText = `${a.service_name} - ${friendlyDate} ساعت ${timeStr}`;
    if (a.staff_name) msgText += `\nپرسنل: ${a.staff_name}`;
    
    const inlineKb = Markup.inlineKeyboard([
[Markup.button.callback("❌ لغو نوبت", `cancel_appt_${a.id}`)]
    ]);
    await ctx.reply(msgText, inlineKb);
  }

  await ctx.reply("برای بازگشت به منو:", kb);
};
