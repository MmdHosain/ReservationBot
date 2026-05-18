// src/features/manager/billing/controllers/billing.controller.ts
import type { MyContext } from "../../../../core/types.ts";
import * as view from "../views/billing.view.ts";
import * as service from "../services/billing.service.ts";
import { getUserByTelegramId } from "../../../../db/user.repository.ts";

export const handleEnter = async (ctx: MyContext) => {
  const user = await getUserByTelegramId(ctx.from!.id);
  if (!user) return;
  
  const isPending = await service.checkPendingTx(user.id);
  if (isPending) {
    await view.showPendingState(ctx);
    return;
  }
  
  const isExpired = user.subscription_expires_at && new Date(user.subscription_expires_at) < new Date();
  await view.showPackages(ctx, !!isExpired, user.subscription_expires_at);
};

export const handleSelectPackage = async (ctx: MyContext) => {
  if (!ctx.match) return;
  const days = parseInt(ctx.match[1]);
  const amount = parseInt(ctx.match[2]);
  
  await ctx.answerCbQuery().catch(() => {});
  
  (ctx.scene.session as any).expectedReceipt = { days, amount };
  await view.showPaymentInstructions(ctx, days, amount);
};

export const handleCancelReceipt = async (ctx: MyContext) => {
  await ctx.answerCbQuery().catch(() => {});
  (ctx.scene.session as any).expectedReceipt = undefined;
  await handleEnter(ctx);
};

export const handleReceiptPhoto = async (ctx: MyContext) => {
  const session = ctx.scene.session as any;
  if (!session.expectedReceipt) return;

  const photo = ctx.message && "photo" in ctx.message ? ctx.message.photo : null;
  if (!photo || photo.length === 0) return;

  const photoId = photo[photo.length - 1].file_id;
  const { days, amount } = session.expectedReceipt;

  const user = await getUserByTelegramId(ctx.from!.id);
  if (user) {
    await service.createPendingTx(user.id, amount, days, photoId);
  }

  session.expectedReceipt = undefined;
  await view.showReceiptSubmitted(ctx);
  await ctx.scene.enter("MANAGER_DASHBOARD_SCENE");
};

export const handleText = async (ctx: MyContext) => {
  const session = ctx.scene.session as any;
  if (session.expectedReceipt) {
    await ctx.reply("لطفاً فقط عکس رسید را ارسال کنید یا از دکمه انصراف استفاده کنید.");
  }
};
