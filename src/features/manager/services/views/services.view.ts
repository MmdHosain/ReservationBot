// src/features/manager/services/views/services.view.ts
import { ServicesMessages } from "./services.messages.ts";
import { buildMenuKeyboard, buildBackToMenuKeyboard, buildCategoryKeyboard, buildDurationKeyboard } from "./services.keyboards.ts";
import type { ServicesContext } from "../types/services.types.ts";

export const showMenu = async (ctx: ServicesContext, name: string, duration: number, catName: string) => {
  const msg = ServicesMessages.editTitle(name, duration, catName);
  const kb = buildMenuKeyboard();
  if (ctx.callbackQuery) await ctx.editMessageText(msg, kb).catch(() => {});
  else await ctx.reply(msg, kb);
};

export const showAskName = async (ctx: ServicesContext) => {
  await ctx.editMessageText(ServicesMessages.typeNewName, buildBackToMenuKeyboard()).catch(() => {});
};

export const showAskCategory = async (ctx: ServicesContext, categories: any[]) => {
  await ctx.editMessageText(ServicesMessages.askCategory, buildCategoryKeyboard(categories)).catch(() => {});
};

export const showAskDuration = async (ctx: ServicesContext) => {
  await ctx.editMessageText(ServicesMessages.askServiceDuration, buildDurationKeyboard()).catch(() => {});
};

export const showSuccess = async (ctx: ServicesContext, text: string) => {
  if (ctx.callbackQuery) await ctx.editMessageText(text).catch(() => {});
  else await ctx.reply(text);
};

export const showError = async (ctx: ServicesContext, text: string) => {
  if (ctx.callbackQuery) await ctx.answerCbQuery(text, { show_alert: true }).catch(() => {});
  else await ctx.reply(text);
};
