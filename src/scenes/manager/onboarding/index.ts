// src/scenes/onboarding/index.ts
import { Scenes } from "telegraf";
import type { OnboardingContext } from "./types.ts";
import * as middleware from "./middleware.ts";

export const ONBOARDING_SCENE_ID = "onboarding";

const onboarding = new Scenes.BaseScene<OnboardingContext>(ONBOARDING_SCENE_ID);

onboarding.enter(middleware.enterScene);

onboarding.action("start_service", async (ctx) => {
  await middleware.handleStartService(ctx);
});

onboarding.action(/dur_(\d+)/, async (ctx) => {
  await middleware.handleDuration(ctx, parseInt(ctx.match[1]));
});

onboarding.action(/day_(.*)/, async (ctx) => {
  const day = ctx.match[1];
  await middleware.handleDaySelection(ctx, day);
});

onboarding.action("confirm_days", async (ctx) => {
  await middleware.handleConfirmDays(ctx);
});

onboarding.action("go_to_dashboard", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.scene.enter("dashboard");
});

onboarding.on("text", async (ctx) => {
  const step = ctx.scene.session.step;
  const draft = ctx.scene.session.draft;
  if (step === "ask_salon_name") {
    await middleware.handleSalonName(ctx);
  } else if (!draft.serviceName) {
    await middleware.handleServiceName(ctx);
  }
});

export const onboardingScene = onboarding as unknown as Scenes.BaseScene<any>;
