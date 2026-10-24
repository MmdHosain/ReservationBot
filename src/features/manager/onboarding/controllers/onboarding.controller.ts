// src/features/manager/onboarding/controllers/onboarding.controller.ts
import * as service from "../services/onboarding.service.ts";
import * as view from "../views/onboarding.view.ts";
import { OnboardingMessages } from "../views/onboarding.messages.ts";
import type { OnboardingContext } from "../types/onboarding.types.ts";

export const handleEnter = async (ctx: OnboardingContext) => {
  ctx.scene.session.draft = { serviceName: undefined, duration: undefined, daysOfWeek: undefined, categoryId: undefined, businessCategory: undefined };
  ctx.scene.session.step = undefined;
  const status = await service.checkUserStatus(ctx.from!.id);
  await view.showWelcome(ctx, status.isNewUser);
};

export const handleStart = async (ctx: OnboardingContext) => {
  await ctx.answerCbQuery().catch(() => {});
  ctx.scene.session.draft = { serviceName: undefined, duration: undefined, daysOfWeek: undefined, categoryId: undefined, businessCategory: undefined };
  
  const status = await service.checkUserStatus(ctx.from!.id);
  
  if (status.isNewUser) {
    ctx.scene.session.step = "ask_business_category";
    await view.showAskBusinessCategory(ctx);
  } else {
    const categories = await service.getUserCategories(ctx.from!.id);
    if (categories.length > 0) {
      ctx.scene.session.step = "ask_category";
      await view.showAskCategory(ctx, categories);
    } else {
      ctx.scene.session.step = "ask_service_name";
      await view.showAskServiceName(ctx);
    }
  }
};

export const handleBusinessCategory = async (ctx: OnboardingContext) => {
  await ctx.answerCbQuery().catch(() => {});
  ctx.scene.session.draft.businessCategory = ctx.match[1];
  
  ctx.scene.session.step = "ask_service_name";
  await view.showAskServiceName(ctx);
};

export const handleCategorySelection = async (ctx: OnboardingContext) => {
  await ctx.answerCbQuery().catch(() => {});
  const val = ctx.match[1];
  ctx.scene.session.draft.categoryId = val === "none" ? null : val;
  ctx.scene.session.step = "ask_service_name";
  await view.showAskServiceName(ctx);
};

export const handleServiceName = async (ctx: OnboardingContext) => {
  if (!ctx.message || !("text" in ctx.message) || !ctx.message.text) return;
  const serviceName = ctx.message.text.trim();
  if (!serviceName) return view.showAskServiceName(ctx);
  ctx.scene.session.draft.serviceName = serviceName;
  ctx.scene.session.step = "ask_duration";
  await view.showAskDuration(ctx);
};

export const handleDurationText = async (ctx: OnboardingContext) => {
  if (!ctx.message || !("text" in ctx.message) || !ctx.message.text) return;
  const duration = parseInt(ctx.message.text.trim());
  if (isNaN(duration) || duration <= 0) {
    await view.showAlert(ctx, "لطفاً یک عدد معتبر برای مدت زمان وارد کنید.");
    return;
  }
  await handleDuration(ctx, duration);
};

export const handleDuration = async (ctx: OnboardingContext, duration: number) => {
  if (ctx.callbackQuery) await ctx.answerCbQuery().catch(() => {});
  ctx.scene.session.draft.duration = duration;
  ctx.scene.session.step = "ask_days";
  await view.showAskDays(ctx, ctx.scene.session.draft.daysOfWeek || []);
};

export const handleDaySelection = async (ctx: OnboardingContext, day: string) => {
  await ctx.answerCbQuery().catch(() => {});
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
  await ctx.answerCbQuery().catch(() => {});
  const status = await service.checkUserStatus(ctx.from!.id);
  
  if (status.hasSalonName) {
    await service.createService(ctx.from!.id, draft.serviceName, draft.duration, draft.daysOfWeek, draft.categoryId);
  }
  
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
  
  const fullName = ctx.from?.first_name || 'Manager';
  const draft = ctx.scene.session.draft;

  await service.registerSalon(status.userId, salonName, ctx.from!.id, fullName, draft);
  await view.showComplete(ctx, salonName);
};
