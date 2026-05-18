// src/features/manager/services/services.scene.ts
import { Scenes } from "telegraf";
import * as controller from "./controllers/services.controller.ts";
import type { ServicesContext } from "./types/services.types.ts";
import { subscriptionGuard } from "../../../core/middlewares/subscription.guard.ts";

export const SCENE_ID = "MANAGER_SERVICES_SCENE";
export const Scene = new Scenes.BaseScene<ServicesContext>(SCENE_ID);

Scene.use(subscriptionGuard);

Scene.enter(controller.handleEnter);
Scene.action("menu", async (ctx) => {
  await ctx.answerCbQuery().catch(() => {});
  ctx.scene.session.action = "menu";
  await controller.handleMenu(ctx);
});
Scene.action("edit_name", controller.askName);
Scene.action("edit_category", controller.askCategory);
Scene.action(/set_cat_(.+)/, controller.handleCategory);
Scene.action("edit_duration", controller.askDuration);
Scene.action("edit_days", controller.askDays);
Scene.action("delete_service", controller.deleteSvc);
Scene.action(/dur_(\d+)/, controller.handleDuration);
Scene.action(/day_(.+)/, controller.handleDay);
Scene.action("confirm_days", controller.saveDays);
Scene.action("back_dash", async (ctx) => {
  await ctx.answerCbQuery().catch(() => {});
  await ctx.scene.enter("MANAGER_DASHBOARD_SCENE");
});
Scene.on("text", controller.handleText);
