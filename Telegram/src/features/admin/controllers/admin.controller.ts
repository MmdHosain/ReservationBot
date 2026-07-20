// src/features/admin/controllers/admin.controller.ts
import type { AdminContext } from "../types/admin.types.ts";
import * as service from "../services/admin.service.ts";
import * as view from "../views/admin.view.ts";
import config from "../../../core/config.ts";
import type { MyContext } from "../../../core/types.ts";
import * as txService from "../../../db/transaction.repository.ts";
import { renewSubscription } from "../../../db/user.repository.ts";
import { AppDataSource } from "../../../db/orm.config.ts";
import { V1User } from "../../../db/entities/v1/index.ts";

export const handleAdminCommand = async (ctx: MyContext) => {
  await ctx.scene.enter("ADMIN_SCENE");
};

export const handleEnter = async (ctx: AdminContext) => {
  if (ctx.scene.session.isAuthenticated) {
    await showStats(ctx, false);
  } else {
    await view.askPassword(ctx);
  }
};

export const handlePassword = async (ctx: AdminContext) => {
  if (!ctx.message || !("text" in ctx.message)) return;
  const text = ctx.message.text.trim();
  
  if (text === config.adminPassword) {
    ctx.scene.session.isAuthenticated = true;
    await showStats(ctx, false);
  } else {
    await view.showWrongPassword(ctx);
    await ctx.scene.leave();
  }
};

export const handleRefresh = async (ctx: AdminContext) => {
  await ctx.answerCbQuery().catch(() => {});
  await showStats(ctx, true);
};

export const handleExit = async (ctx: AdminContext) => {
  await ctx.answerCbQuery().catch(() => {});
  ctx.scene.session.isAuthenticated = false;
  await view.showExit(ctx);
  await ctx.scene.leave();
};

const showStats = async (ctx: AdminContext, isRefresh: boolean) => {
  const stats = await service.getBotStats();
  await view.showDashboard(ctx, stats, isRefresh);
};

export const handlePendingReceipts = async (ctx: AdminContext) => {
  await ctx.answerCbQuery().catch(() => {});
  const txs = await txService.getPendingTransactions();
  if (txs.length === 0) {
    await view.showNoPendingReceipts(ctx);
    return;
  }
  const tx = txs[0];
  await view.showPendingReceipt(ctx, tx);
};

export const handleApproveTx = async (ctx: AdminContext) => {
  await ctx.answerCbQuery("رسید تأیید شد.", { show_alert: true }).catch(() => {});
  if (!ctx.match) return;
  const txId = parseInt(ctx.match[1]);
  const tx = await txService.updateTransactionStatus(txId, 'approved');
  if (tx) {
    await renewSubscription(tx.user_id, tx.package_days);
    const user = await AppDataSource.getRepository(V1User).findOneBy({ id: tx.user_id });
    if (user) {
      await ctx.telegram.sendMessage(user.telegram_id, "✅ رسید پرداختی شما تأیید و اشتراک شما فعال شد.").catch(() => {});
    }
  }
  await handlePendingReceipts(ctx);
};

export const handleRejectTx = async (ctx: AdminContext) => {
  await ctx.answerCbQuery("رسید رد شد.", { show_alert: true }).catch(() => {});
  if (!ctx.match) return;
  const txId = parseInt(ctx.match[1]);
  const tx = await txService.updateTransactionStatus(txId, 'rejected');
  if (tx) {
    const user = await AppDataSource.getRepository(V1User).findOneBy({ id: tx.user_id });
    if (user) {
      await ctx.telegram.sendMessage(user.telegram_id, "❌ رسید پرداختی شما تأیید نشد. لطفاً مجدداً بررسی کنید.").catch(() => {});
    }
  }
  await handlePendingReceipts(ctx);
};

export const handleBack = async (ctx: AdminContext) => {
  await ctx.answerCbQuery().catch(() => {});
  await showStats(ctx, true);
};
