// src/scenes/customer/dashboard.ts
import { Markup } from "telegraf";
import { 
  getOrCreateUser, 
  getCustomerSalons, 
  removeCustomerSalon 
} from "../../db/user.repository.ts";
import { 
  getAppointmentsForCustomer, 
  cancelAppointment 
} from "../../db/appointment.repository.ts";
import { formatFriendlyDate } from "../../utils/date.ts";
import { MESSAGES } from "../../messages.ts";

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

export const showCustomerDashboard = async (ctx: any) => {
  if (ctx.callbackQuery) await ctx.answerCbQuery().catch(() => {});
  const msg = MESSAGES.customerGeneralWelcome;
  const kb = Markup.inlineKeyboard([
    [Markup.button.callback(MESSAGES.viewMyBookingsBtn, "view_my_bookings")],
    [Markup.button.callback(MESSAGES.viewMySalonsBtn, "view_my_salons")],
    [Markup.button.callback(MESSAGES.customerGuideBtn, "view_customer_guide")]
  ]);
  if (ctx.callbackQuery) {
    await ctx.editMessageText(msg, kb).catch(() => {});
  } else {
    await ctx.reply(msg, kb);
  }
};

export const showCustomerGuide = async (ctx: any) => {
  if (ctx.callbackQuery) await ctx.answerCbQuery().catch(() => {});
  const kb = Markup.inlineKeyboard([[Markup.button.callback(MESSAGES.dashboardBackBtn, "back_to_customer_dashboard")]]);
  await ctx.editMessageText(MESSAGES.customerGuide, { parse_mode: "Markdown", ...kb }).catch(() => {});
};

export const mySalonsHandler = async (ctx: any) => {
  if (ctx.callbackQuery) await ctx.answerCbQuery().catch(() => {});
  const salons = await getCustomerSalons(ctx.from.id);

  if (salons.length === 0) {
    const kb = Markup.inlineKeyboard([[Markup.button.callback(MESSAGES.backToCustomerDashboardBtn, "back_to_customer_dashboard")]]);
    if (ctx.callbackQuery) {
      return ctx.editMessageText(MESSAGES.customerNoSalons, kb).catch(() => {});
    }
    return ctx.reply(MESSAGES.customerNoSalons, kb);
  }

  const buttons = salons.map((s: any) =>[
    Markup.button.url(s.salon_name || MESSAGES.unknownUser, `https://ble.ir/${ctx.botInfo.username}?start=${s.salon_telegram_id}`),
    Markup.button.callback(MESSAGES.deleteSalonBtn, `delete_salon_${s.salon_user_id}`)
  ]);
  buttons.push([Markup.button.callback(MESSAGES.backToCustomerDashboardBtn, "back_to_customer_dashboard")]);

  if (ctx.callbackQuery) {
    await ctx.editMessageText(MESSAGES.customerSalonsHeader, Markup.inlineKeyboard(buttons)).catch(() => {});
  } else {
    await ctx.reply(MESSAGES.customerSalonsHeader, Markup.inlineKeyboard(buttons));
  }
};

export const deleteSalonHandler = async (ctx: any) => {
  const salonUserId = parseInt(ctx.match[1]);
  await removeCustomerSalon(ctx.from.id, salonUserId);
  await ctx.answerCbQuery(MESSAGES.salonDeleted).catch(() => {});
  await mySalonsHandler(ctx);
};

export async function cancelAppt(ctx: any) {
  if (!ctx.from || !("match" in ctx) || !(ctx as any).match) return;
  const apptId = parseInt((ctx as any).match[1]);
  await cancelAppointment(apptId, ctx.from.id);
  await ctx.answerCbQuery("نوبت با موفقیت لغو شد.").catch(() => {});
  if (ctx.callbackQuery && ctx.callbackQuery.message) {
      const msg = ctx.callbackQuery.message as any;
      if (msg.text) {
          await ctx.editMessageText(msg.text + "\n\n(لغو شده)").catch(() => {});
      }
  }
}
