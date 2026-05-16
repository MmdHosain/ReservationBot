// src/features/manager/dashboard/dashboard.scene.ts
import { Scenes } from "telegraf";
import * as controller from "./controllers/dashboard.controller.ts";
import type { DashboardContext } from "./types/dashboard.types.ts";
import { subscriptionGuard } from "../../../core/middlewares/subscription.guard.ts";

export const SCENE_ID = "MANAGER_DASHBOARD_SCENE";
export const Scene = new Scenes.BaseScene<DashboardContext>(SCENE_ID);

Scene.use(subscriptionGuard);

Scene.enter(controller.handleEnter);
Scene.action("dash_main", controller.handleMain);
Scene.action("dash_appointments", controller.handleAppointments);
Scene.action("dash_services", controller.handleServices);
Scene.action("dash_staff", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.scene.enter("MANAGER_STAFF_SCENE");
});
Scene.action("dash_settings", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.scene.enter("MANAGER_SETTINGS_SCENE");
});
Scene.action("dash_inbox", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.scene.enter("MANAGER_INBOX_SCENE");
});
Scene.action("dash_guide", controller.handleGuide);
Scene.action(/edit_svc_(\d+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const serviceId = parseInt(ctx.match[1]);
  await ctx.scene.enter("MANAGER_SERVICES_SCENE", { serviceId });
});
Scene.action("add_svc", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.scene.enter("MANAGER_ONBOARDING_SCENE");
});
Scene.action("dash_restart", controller.handleRestart);
Scene.action("dash_exit", controller.handleExit);
