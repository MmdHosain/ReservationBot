// src/features/manager/settings/views/settings.view.ts
import { SettingsMessages } from "./settings.messages.ts";
import { buildBackKeyboard } from "./settings.keyboards.ts";
import type { SettingsContext } from "../types/settings.types.ts";

export const showPrompt = async (ctx: SettingsContext) => {
  await ctx.reply(SettingsMessages.prompt, buildBackKeyboard());
};

export const showSuccess = async (ctx: SettingsContext, text: string) => {
  await ctx.reply(text);
};

export const showError = async (ctx: SettingsContext) => {
  await ctx.reply(SettingsMessages.invalidFormat);
};
