// src/features/admin/views/admin.view.ts
import type { AdminContext } from "../types/admin.types.ts";
import { AdminMessages } from "./admin.messages.ts";
import { buildAdminDashboardKeyboard } from "./admin.keyboards.ts";

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
    await ctx.editMessageText(msg, { parse_mode: "Markdown", ...kb }).catch(() => {});
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
