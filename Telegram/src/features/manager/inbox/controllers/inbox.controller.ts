// src/features/manager/inbox/controllers/inbox.controller.ts
import type { MyContext } from "../../../../core/types.ts";
import * as inboxService from "../services/inbox.service.ts";
import * as inboxView from "../views/inbox.view.ts";
import { getUserByTelegramId } from "../../../../db/user.repository.ts";

export const handleEnter = async (ctx: MyContext) => {
  try {
    const user = await getUserByTelegramId(ctx.from!.id);
    if (!user) return;
    const messages = await inboxService.fetchUnreadInbox(user.id);
    if (messages.length === 0) {
      await inboxView.replyNoMessages(ctx);
      return;
    }
    await inboxView.showMessages(ctx, messages);
  } catch (error) {
    console.error("[InboxController] Error entering scene:", error);
  }
};

export const handleBackToInbox = async (ctx: MyContext) => {
  try {
    (ctx.scene.session as any).replyCustomerId = undefined;
    (ctx.scene.session as any).replyCustomerName = undefined;
    await inboxView.backToInbox(ctx);
  } catch (error) {
    console.error("[InboxController] Error returning to inbox:", error);
    await inboxView.showErrorMessage(ctx);
  }
};

export const handleReadMessage = async (ctx: MyContext) => {
  try {
    const msgId = ctx.match?.[1];
    if (!msgId) {
      await inboxView.showErrorMessage(ctx);
      return;
    }

    const user = await getUserByTelegramId(ctx.from!.id);
    if (!user) return;

    const msg = await inboxService.processReadMessage(msgId, user.id);

    if (msg) {
      (ctx.scene.session as any).activeInboxMsg = msg;
      const conversation = await inboxService.fetchConversation(user.id, msg.customerTelegramId);
      await inboxView.showMessageWithConversation(ctx, conversation, msg.senderName);
    } else {
      await inboxView.showErrorMessage(ctx);
    }
  } catch (error) {
    console.error("[InboxController] Error reading message:", error);
    await inboxView.showErrorMessage(ctx);
  }
};

export const handleViewArchive = async (ctx: MyContext) => {
  try {
    await ctx.answerCbQuery().catch(() => {});
    const user = await getUserByTelegramId(ctx.from!.id);
    if (!user) return;
    
    const messages = await inboxService.fetchArchivedInbox(user.id);
    if (messages.length === 0) {
      await inboxView.replyNoArchivedMessages(ctx);
      return;
    }
    await inboxView.showArchivedMessages(ctx, messages);
  } catch (error) {
    console.error("[InboxController] Error viewing archive:", error);
    await inboxView.showErrorMessage(ctx);
  }
};

export const handleViewArchivedMessage = async (ctx: MyContext) => {
  try {
    const msgId = ctx.match?.[1];
    if (!msgId) {
      await inboxView.showErrorMessage(ctx);
      return;
    }

    const user = await getUserByTelegramId(ctx.from!.id);
    if (!user) return;

    const msg = await inboxService.getMessage(msgId, user.id);

    if (msg) {
      (ctx.scene.session as any).activeInboxMsg = msg;
      const conversation = await inboxService.fetchConversation(user.id, msg.customerTelegramId);
      await inboxView.showArchivedMessageWithConversation(ctx, conversation, msg.senderName);
    } else {
      await inboxView.showErrorMessage(ctx);
    }
  } catch (error) {
    console.error("[InboxController] Error reading archived message:", error);
    await inboxView.showErrorMessage(ctx);
  }
};

export const handleBackToDash = async (ctx: MyContext) => {
  await ctx.answerCbQuery().catch(() => {});
  await ctx.scene.enter("MANAGER_DASHBOARD_SCENE");
};

export const handleReplyToCustomer = async (ctx: MyContext) => {
  await ctx.answerCbQuery().catch(() => {});
  const msg = (ctx.scene.session as any).activeInboxMsg;
  if (msg) {
    (ctx.scene.session as any).replyCustomerId = msg.customerTelegramId;
    (ctx.scene.session as any).replyCustomerName = msg.senderName;
    await inboxView.showReplyPrompt(ctx, msg.senderName);
  }
};

export const handleText = async (ctx: MyContext) => {
  const session = ctx.scene.session as any;
  if (session.replyCustomerId && ctx.message && "text" in ctx.message) {
    const text = ctx.message.text.trim();
    const user = await getUserByTelegramId(ctx.from!.id);
    const salonName = user?.salon_name || "مدیریت سالن";

    try {
      await ctx.telegram.sendMessage(
        session.replyCustomerId,
        `📩 پیام جدید از طرف سالن «${salonName}»:\n\n${text}`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "↩️ پاسخ به سالن", callback_data: `reply_salon_${user.id}` }]
            ]
          }
        }
      );
      await inboxService.saveSalonReply(user.id, session.replyCustomerId, salonName, text);
      await inboxView.showReplySuccess(ctx);
    } catch (err) {
      await ctx.reply("❌ خطا در ارسال پیام به مشتری.");
    }
    
    session.replyCustomerId = undefined;
    session.replyCustomerName = undefined;
    await handleEnter(ctx);
  }
};
