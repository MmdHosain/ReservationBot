// src/features/manager/onboarding/onboarding.scene.ts
import { Scenes } from "telegraf";
import * as controller from "./controllers/onboarding.controller.ts";
import type { OnboardingContext } from "./types/onboarding.types.ts";

export const SCENE_ID = "MANAGER_ONBOARDING_SCENE";
export const Scene = new Scenes.BaseScene<OnboardingContext>(SCENE_ID);

Scene.enter(controller.handleEnter);
Scene.action("start_service", controller.handleStart);
Scene.action(/sel_cat_(.+)/, controller.handleCategorySelection);
Scene.action(/dur_(\d+)/, (ctx) => controller.handleDuration(ctx, parseInt(ctx.match[1])));
Scene.action(/day_(.*)/, (ctx) => controller.handleDaySelection(ctx, ctx.match[1]));
Scene.action("confirm_days", controller.handleConfirmDays);
Scene.action("go_to_dashboard", async (ctx) => {
  await ctx.answerCbQuery().catch(() => {});
  await ctx.scene.enter("MANAGER_DASHBOARD_SCENE");
});
Scene.on("text", async (ctx) => {
  const step = ctx.scene.session.step;
  if (step === "ask_salon_name") await controller.handleSalonName(ctx);
  else if (step === "ask_service_name") await controller.handleServiceName(ctx);
  else if (step === "ask_duration") await controller.handleDurationText(ctx);
});
