// src/features/manager/inbox/views/inbox.view.ts
import { InboxMessages } from "./inbox.messages.ts";
import { buildInboxKeyboard, buildBackKeyboard, buildNoMessagesKeyboard } from "./inbox.keyboards.ts";
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

export const showMessages = async (
  ctx: MyContext,
  messages: InboxMessage[]
) => {
  const kb = buildInboxKeyboard(messages);
  if (ctx.callbackQuery) {
    await ctx.editMessageText(InboxMessages.welcome, kb).catch(() => {});
  } else {
    await ctx.reply(InboxMessages.welcome, kb);
  }
};

export const showMessage = async (ctx: MyContext, msg: InboxMessage) => {
  await ctx.editMessageText(
    InboxMessages.messageDetail(msg.senderName, msg.content, msg.createdAt),
    buildBackKeyboard()
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
