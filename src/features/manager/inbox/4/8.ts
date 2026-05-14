import { InboxMessages } from "./9.ts";
import { buildInboxKeyboard, buildBackKeyboard } from "./10.ts";
import type { InboxMessage } from "../3/7.ts";

export const replyNoMessages = async (ctx: any) => {
  await ctx.reply(InboxMessages.noMessages);
};

export const showMessages = async (ctx: any, messages: InboxMessage[]) => {
  await ctx.reply(InboxMessages.welcome, buildInboxKeyboard(messages));
};

export const showMessage = async (ctx: any, msg: InboxMessage) => {
  await ctx.editMessageText(
    InboxMessages.messageDetail(msg.senderName, msg.content, msg.createdAt),
    buildBackKeyboard()
  );
};

export const backToInbox = async (ctx: any) => {
  await ctx.answerCbQuery();
  await (ctx as any).scene.reenter();
};

export const showErrorMessage = async (ctx: any) => {
  await ctx.reply(InboxMessages.error);
  await ctx.answerCbQuery();
};
