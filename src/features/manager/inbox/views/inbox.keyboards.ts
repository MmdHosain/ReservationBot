// src/features/manager/inbox/views/inbox.keyboards.ts
import { Markup } from "telegraf";
import type { InboxMessage } from "../types/inbox.types.ts";
import { InboxMessages } from "./inbox.messages.ts";

export const buildInboxKeyboard = (messages: InboxMessage[]) => {
  const buttons = messages.map((msg) =>
    [Markup.button.callback(`📩 ${msg.senderName}`, `read_msg_${msg.id}`)]
  );
  
  buttons.push([Markup.button.callback(InboxMessages.viewArchiveBtn, "view_archive")]);
  buttons.push([Markup.button.callback(InboxMessages.backToDashBtn, "back_dash")]);

  return Markup.inlineKeyboard(buttons);
};

export const buildNoMessagesKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback(InboxMessages.viewArchiveBtn, "view_archive")],
    [Markup.button.callback(InboxMessages.backToDashBtn, "back_to_dash")],
  ]);
};

export const buildArchivedKeyboard = (messages: InboxMessage[]) => {
  const buttons = messages.map((msg) =>
    [Markup.button.callback(`🗄 ${msg.senderName}`, `view_arc_msg_${msg.id}`)]
  );
  buttons.push([Markup.button.callback(InboxMessages.backToInboxBtn, "back_to_inbox")]);
  return Markup.inlineKeyboard(buttons);
};

export const buildNoArchivedKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback(InboxMessages.backToInboxBtn, "back_to_inbox")],
  ]);
};

export const buildBackToInboxKeyboard = (showBookBtn: boolean = false) => {
  const buttons = [];
  if (showBookBtn) {
    buttons.push([Markup.button.callback(InboxMessages.bookBtn, "book_for_customer")]);
  }
  buttons.push([Markup.button.callback(InboxMessages.backToInboxBtn, "back_to_inbox")]);
  return Markup.inlineKeyboard(buttons);
};

export const buildBackToArchiveKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback(InboxMessages.backToArchiveBtn, "view_archive")],
  ]);
};
