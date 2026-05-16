// src/features/manager/onboarding/controllers/onboarding.controller.ts
import * as service from "../services/onboarding.service.ts";
import * as view from "../views/onboarding.view.ts";
import { OnboardingMessages } from "../views/onboarding.messages.ts";
import type { OnboardingContext } from "../types/onboarding.types.ts";

export const handleEnter = async (ctx: OnboardingContext) => {
  ctx.scene.session.draft = { serviceName: undefined, duration: undefined, daysOfWeek: undefined };
  ctx.scene.session.step = undefined;
  const status = await service.checkUserStatus(ctx.from!.id);
  await view.showWelcome(ctx, status.isNewUser);
};

export const handleStart = async (ctx: OnboardingContext) => {
  await ctx.answerCbQuery();
  ctx.scene.session.draft = { serviceName: undefined, duration: undefined, daysOfWeek: undefined };
  await view.showAskServiceName(ctx);
};

export const handleServiceName = async (ctx: OnboardingContext) => {
  if (!ctx.message || !("text" in ctx.message) || !ctx.message.text) return;
  const serviceName = ctx.message.text.trim();
  if (!serviceName) return view.showAskServiceName(ctx);
  ctx.scene.session.draft.serviceName = serviceName;
  await view.showAskDuration(ctx);
};

export const handleDuration = async (ctx: OnboardingContext, duration: number) => {
  await ctx.answerCbQuery();
  ctx.scene.session.draft.duration = duration;
  await view.showAskDays(ctx, ctx.scene.session.draft.daysOfWeek || []);
};

export const handleDaySelection = async (ctx: OnboardingContext, day: string) => {
  await ctx.answerCbQuery();
  const draft = ctx.scene.session.draft;
  if (!draft.daysOfWeek) draft.daysOfWeek = [];
  const idx = draft.daysOfWeek.indexOf(day);
  if (idx > -1) draft.daysOfWeek.splice(idx, 1);
  else draft.daysOfWeek.push(day);
  await view.showAskDays(ctx, draft.daysOfWeek);
};

export const handleConfirmDays = async (ctx: OnboardingContext) => {
  const draft = ctx.scene.session.draft;
  if (!draft.daysOfWeek || draft.daysOfWeek.length === 0) {
    return view.showAlert(ctx, OnboardingMessages.pleaseSelectAtLeastOneDay);
  }
  if (!draft.serviceName || !draft.duration) {
    return view.showAlert(ctx, OnboardingMessages.pleaseProvideNameAndDuration);
  }
  await ctx.answerCbQuery();
  const status = await service.checkUserStatus(ctx.from!.id);
  await service.createService(status.userId, draft.serviceName, draft.duration, draft.daysOfWeek);
  
  await view.showConfirmation(ctx, draft.serviceName, draft.duration, draft.daysOfWeek, !status.hasSalonName);
  
  if (!status.hasSalonName) {
    ctx.scene.session.step = "ask_salon_name";
  } else {
    await ctx.scene.enter("MANAGER_DASHBOARD_SCENE");
  }
};

export const handleSalonName = async (ctx: OnboardingContext) => {
  if (!ctx.message || !("text" in ctx.message) || !ctx.message.text) return;
  const salonName = ctx.message.text.trim();
  if (!salonName) return view.showAskSalonName(ctx);
  const status = await service.checkUserStatus(ctx.from!.id);
  await service.registerSalon(status.userId, salonName);
  await view.showComplete(ctx, salonName);
};
