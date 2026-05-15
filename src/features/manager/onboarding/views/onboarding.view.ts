// src/features/manager/onboarding/views/onboarding.view.ts
import { OnboardingMessages } from "./onboarding.messages.ts";
import { buildStartKeyboard, buildDurationKeyboard, buildDaysKeyboard, buildGoToDashboardKeyboard } from "./onboarding.keyboards.ts";

export const showWelcome = async (ctx: any, isNewUser: boolean) => {
  if (isNewUser) {
    const kb = buildStartKeyboard();
    if (ctx.callbackQuery) await ctx.editMessageText(OnboardingMessages.welcome, kb);
    else await ctx.reply(OnboardingMessages.welcome, kb);
  } else {
    if (ctx.callbackQuery) await ctx.editMessageText(OnboardingMessages.addNewServicePrompt);
    else await ctx.reply(OnboardingMessages.addNewServicePrompt);
  }
};

export const showAskServiceName = async (ctx: any) => {
  if (ctx.callbackQuery) await ctx.editMessageText(OnboardingMessages.askServiceName);
  else await ctx.reply(OnboardingMessages.askServiceName);
};

export const showAskDuration = async (ctx: any) => {
  await ctx.reply(OnboardingMessages.askServiceDuration, buildDurationKeyboard());
};

export const showAskDays = async (ctx: any, draftDays: string[]) => {
  const selectedText = draftDays.length > 0 ? OnboardingMessages.selectedDays(draftDays.join("، ")) : "";
  const kb = buildDaysKeyboard(draftDays);
  if (ctx.callbackQuery) await ctx.editMessageText(OnboardingMessages.chooseDayPrompt(selectedText), kb);
  else await ctx.reply(OnboardingMessages.chooseDayPrompt(selectedText), kb);
};

export const showConfirmation = async (ctx: any, serviceName: string, duration: number, days: string[], askSalon: boolean) => {
  const text = OnboardingMessages.serviceRegistered(serviceName, duration) + OnboardingMessages.selectedDaysConfirmation(days.join("، "));
  if (askSalon) {
    await ctx.editMessageText(text + "\n\n" + OnboardingMessages.askSalonName);
  } else {
    await ctx.editMessageText(text);
  }
};

export const showAskSalonName = async (ctx: any) => {
  await ctx.reply(OnboardingMessages.askSalonName);
};

export const showComplete = async (ctx: any, salonName: string) => {
  await ctx.reply(OnboardingMessages.onboardingComplete(salonName), buildGoToDashboardKeyboard());
};

export const showAlert = async (ctx: any, text: string) => {
  if (ctx.callbackQuery) await ctx.answerCbQuery(text, { show_alert: true });
  else await ctx.reply(text);
};
