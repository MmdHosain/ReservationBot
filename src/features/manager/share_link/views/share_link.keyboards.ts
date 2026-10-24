// src/features/manager/share_link/views/share_link.keyboards.ts
import { Markup } from "telegraf";
import { ShareLinkMessages } from "./share_link.messages.ts";

export const buildBackKeyboard = () => Markup.inlineKeyboard([
  [Markup.button.callback(ShareLinkMessages.backBtn, "back_dash")]
]);
