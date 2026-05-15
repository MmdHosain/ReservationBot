// src/features/manager/services/views/services.view.ts
import { ServicesMessages } from "./services.messages.ts";
import { buildMenuKeyboard, buildBackToMenuKeyboard, buildDurationKeyboard, buildDaysKeyboard } from "./services.keyboards.ts";

export const showMenu = async (ctx: any, name: string, duration: number, days: string[]) => {
  const msg = ServicesMessages.editTitle(name, duration, days.join("، "));
  const kb = buildMenuKeyboard();
  if (ctx.callbackQuery) await ctx.editMessageText(msg, kb).catch(() => {});
  else await ctx.reply(msg, kb);
};

export const showAskName = async (ctx: any) => {
  await ctx.editMessageText(ServicesMessages.typeNewName, buildBackToMenuKeyboard());
};

export const showAskDuration = async (ctx: any) => {
  await ctx.editMessageText(ServicesMessages.askServiceDuration, buildDurationKeyboard());
};

export const showAskDays = async (ctx: any, draftDays: string[]) => {
  const selectedText = draftDays.length > 0 ? ServicesMessages.selectedDays(draftDays.join("، ")) : "";
  await ctx.editMessageText(ServicesMessages.chooseDayPrompt(selectedText), buildDaysKeyboard(draftDays));
};

export const showSuccess = async (ctx: any, text: string) => {
  if (ctx.callbackQuery) await ctx.editMessageText(text).catch(() => {});
  else await ctx.reply(text);
};

export const showError = async (ctx: any, text: string) => {
  await ctx.reply(text);
};
