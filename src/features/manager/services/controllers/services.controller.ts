// src/features/manager/services/controllers/services.controller.ts
import * as service from "../services/services.service.ts";
import * as view from "../views/services.view.ts";
import { ServicesMessages } from "../views/services.messages.ts";
import type { ServicesContext } from "../types/services.types.ts";

export const handleEnter = async (ctx: ServicesContext) => {
  ctx.scene.session.serviceId = (ctx.scene.state as any).serviceId;
  ctx.scene.session.orgId = ctx.orgId;
  ctx.scene.session.action = "menu";
  await handleMenu(ctx);
};

export const handleMenu = async (ctx: ServicesContext) => {
  if (!ctx.scene.session.serviceId) return;
  const svc = await service.getService(ctx.scene.session.serviceId);
  if (!svc) {
    await view.showError(ctx, ServicesMessages.serviceNotFound);
    return ctx.scene.enter("MANAGER_DASHBOARD_SCENE");
  }
  
  let catName = "ندارد";
  if (svc.category) {
    catName = svc.category.name;
  }
  
  await view.showMenu(ctx, svc.name, svc.duration_minutes, catName);
};

export const askName = async (ctx: ServicesContext) => {
  await ctx.answerCbQuery().catch(() => {});
  ctx.scene.session.action = "name";
  await view.showAskName(ctx);
};

export const handleText = async (ctx: ServicesContext) => {
  if (ctx.scene.session.action === "name") {
    if (ctx.message && "text" in ctx.message) {
      const text = ctx.message.text.trim();
      if (text && ctx.scene.session.serviceId) {
        await service.updateServiceData(ctx.scene.session.serviceId, { name: text });
        await view.showSuccess(ctx, ServicesMessages.nameUpdated);
      }
    }
    ctx.scene.session.action = "menu";
    await handleMenu(ctx);
  }
};

export const askCategory = async (ctx: ServicesContext) => {
  await ctx.answerCbQuery().catch(() => {});
  if (!ctx.scene.session.orgId) return;
  const categories = await service.getOrgCategories(ctx.scene.session.orgId);
  if (categories.length === 0) {
    return view.showError(ctx, "شما هیچ دسته‌بندی ندارید. ابتدا از بخش مدیریت دسته‌بندی‌ها، یک دسته ایجاد کنید.");
  }
  await view.showAskCategory(ctx, categories);
};

export const handleCategory = async (ctx: ServicesContext) => {
  await ctx.answerCbQuery().catch(() => {});
  const catId = ctx.match[1] === "none" ? null : ctx.match[1];
  if (ctx.scene.session.serviceId) {
    await service.updateServiceData(ctx.scene.session.serviceId, { categoryId: catId });
  }
  await view.showSuccess(ctx, ServicesMessages.categoryUpdated);
  ctx.scene.session.action = "menu";
  await handleMenu(ctx);
};

export const askDuration = async (ctx: ServicesContext) => {
  await ctx.answerCbQuery().catch(() => {});
  await view.showAskDuration(ctx);
};

export const handleDuration = async (ctx: ServicesContext) => {
  await ctx.answerCbQuery().catch(() => {});
  const duration = parseInt(ctx.match[1]);
  if (ctx.scene.session.serviceId) {
    await service.updateServiceData(ctx.scene.session.serviceId, { duration });
  }
  await view.showSuccess(ctx, ServicesMessages.durationUpdated);
  ctx.scene.session.action = "menu";
  await handleMenu(ctx);
};

export const deleteSvc = async (ctx: ServicesContext) => {
  await ctx.answerCbQuery().catch(() => {});
  if (ctx.scene.session.serviceId) {
    await service.removeService(ctx.scene.session.serviceId);
  }
  await view.showSuccess(ctx, ServicesMessages.serviceDeleted);
  await ctx.scene.enter("MANAGER_DASHBOARD_SCENE");
};
