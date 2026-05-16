// src/features/manager/billing/controllers/billing.controller.ts
import type { MyContext } from "../../../../core/types.ts";
import * as view from "../views/billing.view.ts";
import * as service from "../services/billing.service.ts";
import { getUserByTelegramId } from "../../../../db/user.repository.ts";

export const handleEnter = async (ctx: MyContext) => {
  const user = await getUserByTelegramId(ctx.from!.id);
  if (!user) return;
  const isExpired = user.subscription_expires_at && new Date(user.subscription_expires_at) < new Date();
  await view.showPackages(ctx, !!isExpired, user.subscription_expires_at);
};

export const handleSelectPackage = async (ctx: MyContext) => {
  if (!ctx.match) return;
  const days = parseInt(ctx.match[1]);
  const amount = parseInt(ctx.match[2]);
  
  await ctx.answerCbQuery().catch(() => {});
  await view.showMockPayment(ctx, days, amount);
};

export const handleMockPaymentSuccess = async (ctx: MyContext) => {
  if (!ctx.match) return;
  const days = parseInt(ctx.match[1]);
  
  await ctx.answerCbQuery("پرداخت با موفقیت انجام شد!", { show_alert: true }).catch(() => {});
  
  const user = await getUserByTelegramId(ctx.from!.id);
  if (user) {
    await service.renew(user.id, days);
  }
  
  await view.showPaymentSuccess(ctx);
  await ctx.scene.enter("MANAGER_DASHBOARD_SCENE");
};
