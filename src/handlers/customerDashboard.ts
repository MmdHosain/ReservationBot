// src/handlers/customerDashboard.ts
import { Markup } from "telegraf";
import { MESSAGES } from "../messages.ts";
import { getCustomerSalons, removeCustomerSalon } from "../db/user.repository.ts";

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
