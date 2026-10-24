// src/features/manager/settings/views/settings.keyboards.ts
import { Markup } from "telegraf";
import { SettingsMessages } from "./settings.messages.ts";

export const buildBackKeyboard = () => Markup.inlineKeyboard([
  [Markup.button.callback(SettingsMessages.backBtn, "back_dash")]
]);
