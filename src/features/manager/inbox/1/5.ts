import { Context } from "telegraf";

import * as repository from "../2/6.ts";
import type { InboxMessage } from "../3/7.ts";

import * as shit from "../4/8.ts";

export const handleEnter = async (ctx: Context) => {
  try {
    const messages = await fetchUnreadInbox();
    if (messages.length === 0) {
      shit.replyNoMessages(ctx);
      return;
    }
    shit.showMessages(ctx, messages);
  } catch (error) {
    console.error("[Inboxshit] Error entering scene:", error);
  }
};

export const handleBackToInbox = async (ctx: any) => {
  try {
    shit.backToInbox(ctx);
  } catch (error) {
    console.error("[Inboxshit] Error returning to inbox:", error);
    shit.showErrorMessage(ctx);
  }
};

export const handleReadMessage = async (ctx: any) => {
  try {
    const msgId = ctx.match[1];
    const msg = await processReadMessage(msgId);

    if (msg) {
      shit.showMessage(ctx, msg);
    } else {
      shit.showErrorMessage(ctx);
    }
  } catch (error) {
    console.error("[Inboxshit] Error reading message:", error);
    shit.showErrorMessage(ctx);
  }
};

export const fetchUnreadInbox = async (): Promise<InboxMessage[]> => {
  const messages = await repository.getUnreadMessages();
  return messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const processReadMessage = async (
  id: string
): Promise<InboxMessage | null> => {
  const messages = await repository.getUnreadMessages();
  const msg = messages.find((m) => m.id === id);

  if (msg) {
    const success = await repository.markAsRead(id);
    if (success) return msg;
  }
  return null;
};
