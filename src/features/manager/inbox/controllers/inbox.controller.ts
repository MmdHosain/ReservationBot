// import type { InboxContext } from "../types/inbox.types.ts";
import type { MyContext } from "../../../../types/index.ts";
import * as inboxService from "../services/inbox.service.ts";
import * as inboxView from "../views/inbox.view.ts";

export const handleEnter = async (ctx: InboxContext) => {
  try {
    const messages = await inboxService.fetchUnreadInbox();
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

    const msg = await inboxService.processReadMessage(msgId);

    if (msg) {
      await inboxView.showMessage(ctx, msg);
    } else {
      await inboxView.showErrorMessage(ctx);
    }
  } catch (error) {
    console.error("[InboxController] Error reading message:", error);
    await inboxView.showErrorMessage(ctx);
  }
};
