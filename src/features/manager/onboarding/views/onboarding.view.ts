// src/features/manager/onboarding/views/onboarding.view.ts
import { OnboardingMessages } from "./onboarding.messages.ts";
import { buildStartKeyboard, buildBusinessCategoryKeyboard, buildCategoryKeyboard, buildDurationKeyboard, buildDaysKeyboard, buildGoToDashboardKeyboard } from "./onboarding.keyboards.ts";
import type { OnboardingContext } from "../types/onboarding.types.ts";

export const showWelcome = async (ctx: OnboardingContext, isNewUser: boolean) => {
  if (isNewUser) {
    const kb = buildStartKeyboard();
    if (ctx.callbackQuery) await ctx.editMessageText(OnboardingMessages.welcome, kb);
    else await ctx.reply(OnboardingMessages.welcome, kb);
  } else {
    const kb = buildStartKeyboard();
    if (ctx.callbackQuery) await ctx.editMessageText(OnboardingMessages.addNewServicePrompt, kb);
    else await ctx.reply(OnboardingMessages.addNewServicePrompt, kb);
  }
};

export const showAskBusinessCategory = async (ctx: OnboardingContext) => {
  const kb = buildBusinessCategoryKeyboard();
  if (ctx.callbackQuery) await ctx.editMessageText(OnboardingMessages.askBusinessCategory, kb);
  else await ctx.reply(OnboardingMessages.askBusinessCategory, kb);
};

export const showAskCategory = async (ctx: OnboardingContext, categories: any[]) => {
  const kb = buildCategoryKeyboard(categories);
  if (ctx.callbackQuery) await ctx.editMessageText(OnboardingMessages.askCategory, kb);
  else await ctx.reply(OnboardingMessages.askCategory, kb);
};

export const showAskServiceName = async (ctx: OnboardingContext) => {
  if (ctx.callbackQuery) await ctx.editMessageText(OnboardingMessages.askServiceName);
  else await ctx.reply(OnboardingMessages.askServiceName);
};

export const showAskDuration = async (ctx: OnboardingContext) => {
  await ctx.reply(OnboardingMessages.askServiceDuration, buildDurationKeyboard());
};

export const showAskDays = async (ctx: OnboardingContext, draftDays: string[]) => {
  const selectedText = draftDays.length > 0 ? OnboardingMessages.selectedDays(draftDays.join("، ")) : "";
  const kb = buildDaysKeyboard(draftDays);
  if (ctx.callbackQuery) await ctx.editMessageText(OnboardingMessages.chooseDayPrompt(selectedText), kb);
  else await ctx.reply(OnboardingMessages.chooseDayPrompt(selectedText), kb);
};

export const showConfirmation = async (ctx: OnboardingContext, serviceName: string, duration: number, days: string[], askSalon: boolean) => {
  const text = OnboardingMessages.serviceRegistered(serviceName, duration) + OnboardingMessages.selectedDaysConfirmation(days.join("، "));
  if (askSalon) {
    await ctx.editMessageText(text + "\n\n" + OnboardingMessages.askSalonName);
  } else {
    await ctx.editMessageText(text);
  }
};

export const showAskSalonName = async (ctx: OnboardingContext) => {
  await ctx.reply(OnboardingMessages.askSalonName);
};

export const showComplete = async (ctx: OnboardingContext, salonName: string) => {
  await ctx.reply(OnboardingMessages.onboardingComplete(salonName), buildGoToDashboardKeyboard());
};

export const showAlert = async (ctx: OnboardingContext, text: string) => {
  if (ctx.callbackQuery) await ctx.answerCbQuery(text, { show_alert: true });
  else await ctx.reply(text);
};
