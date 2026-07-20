// src/features/manager/dashboard/controllers/dashboard.controller.ts
import * as service from "../services/dashboard.service.ts";
import * as view from "../views/dashboard.view.ts";
import { getCoreMessages } from "../../../../core/messages.ts";
import type { DashboardContext } from "../types/dashboard.types.ts";
import type { MyContext } from "../../../../core/types.ts";

export const handleManagerCommand = async (ctx: MyContext) => {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  const user = await service.ensureUserAndGetInfo(telegramId);
  if (user?.onboarded_at) {
    if (user.subscription_expires_at && new Date(user.subscription_expires_at) < new Date()) {
      await ctx.reply("❌ اعتبار پنل شما به پایان رسیده است.");
      await ctx.scene.enter("MANAGER_BILLING_SCENE");
      return;
    }
    await ctx.reply(getCoreMessages(ctx.businessCategory).welcomeBack);
    await ctx.scene.enter("MANAGER_DASHBOARD_SCENE");
  } else {
    await ctx.scene.enter("MANAGER_ONBOARDING_SCENE");
  }
};

export const handleEnter = async (ctx: DashboardContext) => {
  const user = await service.getUserInfo(ctx.from!.id);
  const salonName = user?.salon_name || "مجموعه";
  await view.showDashboard(ctx, salonName);
};

export const handleMain = async (ctx: DashboardContext) => {
  await ctx.answerCbQuery();
  await handleEnter(ctx);
};

export const handleToolsMenu = async (ctx: DashboardContext) => {
  await ctx.answerCbQuery();
  await view.showToolsMenu(ctx);
};

export const handleAppointments = async (ctx: DashboardContext) => {
  await ctx.answerCbQuery();
  const user = await service.getUserInfo(ctx.from!.id);
  if (!user) return;
  const stats = await service.getAppointmentsStats(
    user.id,
    user.calendar_type as "shamsi" | "miladi"
  );
  await view.showAppointments(ctx, stats.count, stats.list);
};

export const handleServices = async (ctx: DashboardContext) => {
  await ctx.answerCbQuery();
  const user = await service.getUserInfo(ctx.from!.id);
  if (!user) return;
  const services = await service.getServices(user.id);
  await view.showServices(ctx, services);
};

export const handleGuide = async (ctx: DashboardContext) => {
  await ctx.answerCbQuery();
  await view.showGuide(ctx);
};

export const handleRestart = async (ctx: DashboardContext) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(getCoreMessages(ctx.businessCategory).deletingUser);
  const result = await service.restartSalon(ctx.from!.id);
  await view.showRestartResult(ctx, result.success, result.message);
  await ctx.scene.leave();
};

export const handleExit = async (ctx: DashboardContext) => {
  await ctx.answerCbQuery();
  await view.showExit(ctx);
  await ctx.scene.leave();
};
