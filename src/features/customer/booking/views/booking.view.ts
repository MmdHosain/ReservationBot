// src/features/customer/booking/views/booking.view.ts
import type { BookingContext } from "../types/booking.types.ts";
import { getBookingMessages } from "./booking.messages.ts";
import {
  buildRootServicesKeyboard,
  buildCategoryServicesKeyboard,
  buildDatesKeyboard,
  buildTimesKeyboard,
  buildConfirmKeyboard
} from "./booking.keyboards.ts";

export const showNoServices = async (ctx: BookingContext, categoryStr: string = 'generic') => {
  await ctx.reply(getBookingMessages(categoryStr).noServices);
};

export const showRootServices = async (ctx: BookingContext, categories: any[], uncategorizedServices: any[], categoryStr: string = 'generic') => {
  const msg = getBookingMessages(categoryStr).selectCategoryOrService;
  const kb = buildRootServicesKeyboard(categories, uncategorizedServices, categoryStr);
  if (ctx.callbackQuery) await ctx.editMessageText(msg, kb).catch(() => {});
  else await ctx.reply(msg, kb);
};

export const showCategoryServices = async (ctx: BookingContext, catName: string, services: any[], categoryStr: string = 'generic') => {
  const msg = getBookingMessages(categoryStr).servicesInCategory(catName);
  const kb = buildCategoryServicesKeyboard(services, categoryStr);
  if (ctx.callbackQuery) await ctx.editMessageText(msg, kb).catch(() => {});
  else await ctx.reply(msg, kb);
};

export const showDates = async (ctx: BookingContext, days: any[], page: number, categoryStr: string = 'generic') => {
  const kb = buildDatesKeyboard(days, page, categoryStr);
  await ctx.editMessageText(getBookingMessages(categoryStr).selectDate, kb).catch(() => {});
};

export const showNoSlots = async (ctx: BookingContext, categoryStr: string = 'generic') => {
  await ctx.answerCbQuery(getBookingMessages(categoryStr).noSlots, { show_alert: true }).catch(() => {});
};

export const showTimes = async (ctx: BookingContext, slots: string[], categoryStr: string = 'generic') => {
  const kb = buildTimesKeyboard(slots, categoryStr);
  await ctx.editMessageText(getBookingMessages(categoryStr).selectTime, kb).catch(() => {});
};

export const showConfirm = async (ctx: BookingContext, svc: string, date: string, time: string, isManager: boolean, customerName?: string, categoryStr: string = 'generic') => {
  const m = getBookingMessages(categoryStr);
  const text = isManager 
    ? m.confirmPromptManager(customerName || "مشتری", svc, date, time)
    : m.confirmPrompt(svc, date, time);
  await ctx.editMessageText(text, buildConfirmKeyboard(categoryStr)).catch(() => {});
};

export const showSuccess = async (ctx: BookingContext, isManager: boolean, categoryStr: string = 'generic') => {
  const m = getBookingMessages(categoryStr);
  const text = isManager ? m.successManager : m.success;
  await ctx.editMessageText(text).catch(() => {});
};
