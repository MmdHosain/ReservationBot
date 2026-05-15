// src/features/manager/inbox/views/inbox.keyboards.ts
import { Markup } from "telegraf";
import type { InboxMessage } from "../types/inbox.types.ts";
import { InboxMessages } from "./inbox.messages.ts";

export const buildInboxKeyboard = (messages: InboxMessage[]) => {
  const buttons = messages.map((msg) =>
    [Markup.button.callback(`📩 ${msg.senderName}`, `read_msg_${msg.id}`)]
  );
  
  buttons.push([Markup.button.callback(InboxMessages.backToDashBtn, "back_to_dash")]);

  return Markup.inlineKeyboard(buttons);
};

export const buildBackKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback(InboxMessages.backToInboxBtn, "back_to_inbox")],
  ]);
};

export const buildNoMessagesKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback(InboxMessages.backToDashBtn, "back_to_dash")],
  ]);
};
