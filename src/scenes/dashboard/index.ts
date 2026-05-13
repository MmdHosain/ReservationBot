// src/scenes/dashboard/index.ts
import { Scenes } from "telegraf";
import type { DashboardContext } from "./types.ts";
import * as middleware from "./middleware.ts";
import { MESSAGES } from "../../messages.ts";
import { deleteUserByTelegramId } from "../../db/user.repository.ts";

export const DASHBOARD_SCENE_ID = "dashboard";

const dashboard = new Scenes.BaseScene<DashboardContext>(DASHBOARD_SCENE_ID);

dashboard.enter(middleware.enterDashboard);

dashboard.action("dash_main", async (ctx) => {
  await ctx.answerCbQuery();
  await middleware.enterDashboard(ctx);
});

dashboard.action("dash_appointments", async (ctx) => {
  await ctx.answerCbQuery();
  await middleware.showAppointments(ctx);
});

dashboard.action("dash_services", async (ctx) => {
  await ctx.answerCbQuery();
  await middleware.showServices(ctx);
});

dashboard.action("dash_staff", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.scene.enter("staff_manage");
});

dashboard.action("dash_settings", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.scene.enter("settings");
});

dashboard.action("dash_guide", async (ctx) => {
  await ctx.answerCbQuery();
  await middleware.showManagerGuide(ctx);
});

dashboard.action(/edit_svc_(\d+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const serviceId = parseInt(ctx.match[1]);
  await ctx.scene.enter("service_edit", { serviceId });
});

dashboard.action("add_svc", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.scene.enter("onboarding");
});

dashboard.action("dash_restart", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(MESSAGES.deletingUser);
  const result = await deleteUserByTelegramId(ctx.from!.id);
  await ctx.reply(result.success ? `✅ ${result.message}` : `❌ ${result.message}`);
  await ctx.scene.leave();
});

dashboard.action("dash_exit", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(MESSAGES.panelExited);
  await ctx.scene.leave();
});

export const dashboardScene = dashboard as unknown as Scenes.BaseScene<any>;
