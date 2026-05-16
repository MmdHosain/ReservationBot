// src/features/admin/controllers/admin.controller.ts
import type { AdminContext } from "../types/admin.types.ts";
import * as service from "../services/admin.service.ts";
import * as view from "../views/admin.view.ts";
import config from "../../../core/config.ts";
import type { MyContext } from "../../../core/types.ts";

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
