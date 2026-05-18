// src/features/manager/inbox/views/inbox.view.ts
import { InboxMessages } from "./inbox.messages.ts";
import {
  buildInboxKeyboard,
  buildNoMessagesKeyboard,
  buildBackToInboxKeyboard,
  buildArchivedKeyboard,
  buildNoArchivedKeyboard,
  buildBackToArchiveKeyboard,
  buildReplyPromptKeyboard
} from "./inbox.keyboards.ts";
import type { InboxMessage } from "../types/inbox.types.ts";
import type { MyContext } from "../../../../core/types.ts";

export const replyNoMessages = async (ctx: MyContext) => {
  const kb = buildNoMessagesKeyboard();
  if (ctx.callbackQuery) {
    await ctx.editMessageText(InboxMessages.noMessages, kb).catch(() => {});
  } else {
    await ctx.reply(InboxMessages.noMessages, kb);
  }
};

export const showMessages = async (ctx: MyContext, messages: InboxMessage[]) => {
  const kb = buildInboxKeyboard(messages);
  if (ctx.callbackQuery) {
    await ctx.editMessageText(InboxMessages.welcome, kb).catch(() => {});
  } else {
    await ctx.reply(InboxMessages.welcome, kb);
  }
};

export const showMessageWithConversation = async (ctx: MyContext, messages: InboxMessage[], customerName: string) => {
  const history = messages.map(m => {
    const time = new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit' }).format(m.createdAt);
    if (m.senderType === 'salon') {
      return `🏪 سالن (${time}):\n${m.content}\n`;
    } else {
      return `🧑 ${customerName} (${time}):\n${m.content}\n`;
    }
  }).join("\n");

  await ctx.editMessageText(
    InboxMessages.conversationDetail(customerName, history),
    buildBackToInboxKeyboard(true)
  ).catch(() => {});
};

export const replyNoArchivedMessages = async (ctx: MyContext) => {
  const kb = buildNoArchivedKeyboard();
  if (ctx.callbackQuery) {
    await ctx.editMessageText(InboxMessages.noArchivedMessages, kb).catch(() => {});
  } else {
    await ctx.reply(InboxMessages.noArchivedMessages, kb);
  }
};

export const showArchivedMessages = async (ctx: MyContext, messages: InboxMessage[]) => {
  const kb = buildArchivedKeyboard(messages);
  if (ctx.callbackQuery) {
    await ctx.editMessageText(InboxMessages.archivedWelcome, kb).catch(() => {});
  } else {
    await ctx.reply(InboxMessages.archivedWelcome, kb);
  }
};

export const showArchivedMessageWithConversation = async (ctx: MyContext, messages: InboxMessage[], customerName: string) => {
  const history = messages.map(m => {
    const time = new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit' }).format(m.createdAt);
    if (m.senderType === 'salon') {
      return `🏪 سالن (${time}):\n${m.content}\n`;
    } else {
      return `🧑 ${customerName} (${time}):\n${m.content}\n`;
    }
  }).join("\n");

  await ctx.editMessageText(
    InboxMessages.conversationDetail(customerName, history),
    buildBackToArchiveKeyboard()
  ).catch(() => {});
};

export const backToInbox = async (ctx: MyContext) => {
  await ctx.answerCbQuery();
  await ctx.scene.reenter();
};

export const showErrorMessage = async (ctx: MyContext) => {
  await ctx.reply(InboxMessages.error);
  if (ctx.callbackQuery) await ctx.answerCbQuery();
};

export const showNotManager = async (ctx: MyContext) => {
  await ctx.reply(InboxMessages.notManager);
};

export const showReplyPrompt = async (ctx: MyContext, name: string) => {
  const kb = buildReplyPromptKeyboard();
  if (ctx.callbackQuery) {
    await ctx.editMessageText(InboxMessages.typeReplyPrompt(name), kb).catch(() => {});
  } else {
    await ctx.reply(InboxMessages.typeReplyPrompt(name), kb);
  }
};

export const showReplySuccess = async (ctx: MyContext) => {
  await ctx.reply(InboxMessages.replySentSuccess);
};
