// src/features/manager/settings/views/settings.view.ts
import { SettingsMessages } from "./settings.messages.ts";
import { buildBackKeyboard } from "./settings.keyboards.ts";

export const showPrompt = async (ctx: any) => {
  await ctx.reply(SettingsMessages.prompt, buildBackKeyboard());
};

export const showSuccess = async (ctx: any, text: string) => {
  await ctx.reply(text);
};

export const showError = async (ctx: any) => {
  await ctx.reply(SettingsMessages.invalidFormat);
};
