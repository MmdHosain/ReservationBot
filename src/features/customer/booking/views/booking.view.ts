import type { BookingContext } from "../types/booking.types.ts";
import { BookingMessages } from "./booking.messages.ts";
import {
  buildRootServicesKeyboard,
  buildCategoryServicesKeyboard,
  buildDatesKeyboard,
  buildTimesKeyboard,
  buildConfirmKeyboard
} from "./booking.keyboards.ts";

export const showNoServices = async (ctx: BookingContext) => {
  await ctx.reply(BookingMessages.noServices);
};

export const showRootServices = async (ctx: BookingContext, categories: any[], uncategorizedServices: any[]) => {
  const msg = BookingMessages.selectCategoryOrService;
  const kb = buildRootServicesKeyboard(categories, uncategorizedServices);
  if (ctx.callbackQuery) await ctx.editMessageText(msg, kb).catch(() => {});
  else await ctx.reply(msg, kb);
};

export const showCategoryServices = async (ctx: BookingContext, catName: string, services: any[]) => {
  const msg = BookingMessages.servicesInCategory(catName);
  const kb = buildCategoryServicesKeyboard(services);
  if (ctx.callbackQuery) await ctx.editMessageText(msg, kb).catch(() => {});
  else await ctx.reply(msg, kb);
};

export const showDates = async (ctx: BookingContext, days: any[], page: number) => {
  const kb = buildDatesKeyboard(days, page);
  await ctx.editMessageText(BookingMessages.selectDate, kb).catch(() => {});
};

export const showNoSlots = async (ctx: BookingContext) => {
  await ctx.answerCbQuery(BookingMessages.noSlots, { show_alert: true }).catch(() => {});
};

export const showTimes = async (ctx: BookingContext, slots: string[]) => {
  const kb = buildTimesKeyboard(slots);
  await ctx.editMessageText(BookingMessages.selectTime, kb).catch(() => {});
};

export const showConfirm = async (ctx: BookingContext, svc: string, date: string, time: string, isManager: boolean, customerName?: string) => {
  const text = isManager 
    ? BookingMessages.confirmPromptManager(customerName || "مشتری", svc, date, time)
    : BookingMessages.confirmPrompt(svc, date, time);
  await ctx.editMessageText(text, buildConfirmKeyboard()).catch(() => {});
};

export const showSuccess = async (ctx: BookingContext, isManager: boolean) => {
  const text = isManager ? BookingMessages.successManager : BookingMessages.success;
  await ctx.editMessageText(text).catch(() => {});
};
