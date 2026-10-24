// src/features/admin/views/admin.view.ts
import type { AdminContext } from "../types/admin.types.ts";
import { AdminMessages } from "./admin.messages.ts";
import { buildAdminDashboardKeyboard, buildReceiptActionKeyboard } from "./admin.keyboards.ts";

export const askPassword = async (ctx: AdminContext) => {
  await ctx.reply(AdminMessages.askPassword);
};

export const showWrongPassword = async (ctx: AdminContext) => {
  await ctx.reply(AdminMessages.wrongPassword);
};

export const showDashboard = async (ctx: AdminContext, stats: any, isRefresh = false) => {
  const msg = AdminMessages.stats(stats.total_users, stats.total_salons, stats.total_appointments, stats.total_services);
  const kb = buildAdminDashboardKeyboard();
  
  if (isRefresh && ctx.callbackQuery) {
    try {
      await ctx.editMessageText(msg, { parse_mode: "Markdown", ...kb });
    } catch (e) {
      await ctx.deleteMessage().catch(() => {});
      await ctx.reply(msg, { parse_mode: "Markdown", ...kb });
    }
  } else {
    await ctx.reply(AdminMessages.welcome);
    await ctx.reply(msg, { parse_mode: "Markdown", ...kb });
  }
};

export const showExit = async (ctx: AdminContext) => {
  if (ctx.callbackQuery) {
    await ctx.editMessageText(AdminMessages.exited).catch(() => {});
  } else {
    await ctx.reply(AdminMessages.exited);
  }
};

export const showNoPendingReceipts = async (ctx: AdminContext) => {
  await ctx.deleteMessage().catch(() => {});
  await ctx.reply(AdminMessages.noPendingReceipts, {
    reply_markup: {
      inline_keyboard: [[{ text: AdminMessages.backBtn, callback_data: "admin_back" }]]
    }
  });
};

export const showPendingReceipt = async (ctx: AdminContext, tx: any) => {
  await ctx.deleteMessage().catch(() => {});
  const msg = AdminMessages.pendingReceiptDetails(tx.amount, tx.package_days, tx.salon_name || "نامشخص");
  const kb = buildReceiptActionKeyboard(tx.id);
  await ctx.replyWithPhoto(tx.receipt_photo_id, {
    caption: msg,
    ...kb
  });
};
