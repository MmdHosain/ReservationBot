import { Markup } from "telegraf";
import type { InboxMessage } from "../3/7.ts";

export const buildInboxKeyboard = (messages: InboxMessage[]) => {
  if (messages.length === 0) return Markup.inlineKeyboard([]);

  const buttons = messages.map((msg) =>
    Markup.button.callback(`📩 ${msg.senderName}`, `read_msg_${msg.id}`)
  );

  return Markup.inlineKeyboard(buttons, { columns: 1 });
};

export const buildBackKeyboard = () => {
  return Markup.inlineKeyboard([
    Markup.button.callback("⬅️ Back to Inbox", "back_to_inbox"),
  ]);
};
