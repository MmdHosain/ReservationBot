import { InboxMessages } from "./inbox.messages.ts";
import { buildInboxKeyboard, buildBackKeyboard } from "./inbox.keyboards.ts";
import type { InboxMessage, InboxContext } from "../types/inbox.types.ts";

export const replyNoMessages = async (ctx: InboxContext) => {
  await ctx.reply(InboxMessages.noMessages);
};

export const showMessages = async (ctx: InboxContext, messages: InboxMessage[]) => {
  await ctx.reply(InboxMessages.welcome, buildInboxKeyboard(messages));
};

export const showMessage = async (ctx: InboxContext, msg: InboxMessage) => {
  await ctx.editMessageText(
    InboxMessages.messageDetail(msg.senderName, msg.content, msg.createdAt),
    buildBackKeyboard()
  );
};

export const backToInbox = async (ctx: InboxContext) => {
  await ctx.answerCbQuery();
  await ctx.scene.reenter();
};

export const showErrorMessage = async (ctx: InboxContext) => {
  await ctx.reply(InboxMessages.error);
  await ctx.answerCbQuery();
};
