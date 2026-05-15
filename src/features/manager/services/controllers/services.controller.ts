// src/features/manager/services/controllers/services.controller.ts
import * as service from "../services/services.service.ts";
import * as view from "../views/services.view.ts";
import { ServicesMessages } from "../views/services.messages.ts";

export const handleEnter = async (ctx: any) => {
  ctx.scene.session.serviceId = ctx.scene.state.serviceId;
  ctx.scene.session.action = "menu";
  await handleMenu(ctx);
};

export const handleMenu = async (ctx: any) => {
  const svc = await service.getService(ctx.scene.session.serviceId);
  if (!svc) {
    await view.showError(ctx, ServicesMessages.serviceNotFound);
    return ctx.scene.enter("MANAGER_DASHBOARD_SCENE");
  }
  await view.showMenu(ctx, svc.name, svc.duration, JSON.parse(svc.days));
};

export const askName = async (ctx: any) => {
  await ctx.answerCbQuery();
  ctx.scene.session.action = "name";
  await view.showAskName(ctx);
};

export const handleText = async (ctx: any) => {
  if (ctx.scene.session.action === "name") {
    const text = ctx.message.text.trim();
    if (text) {
      await service.updateServiceData(ctx.scene.session.serviceId, { name: text });
      await view.showSuccess(ctx, ServicesMessages.nameUpdated);
    }
    ctx.scene.session.action = "menu";
    await handleMenu(ctx);
  }
};

export const askDuration = async (ctx: any) => {
  await ctx.answerCbQuery();
  await view.showAskDuration(ctx);
};

export const handleDuration = async (ctx: any) => {
  await ctx.answerCbQuery();
  const duration = parseInt(ctx.match[1]);
  await service.updateServiceData(ctx.scene.session.serviceId, { duration });
  await view.showSuccess(ctx, ServicesMessages.durationUpdated);
  ctx.scene.session.action = "menu";
  await handleMenu(ctx);
};

export const askDays = async (ctx: any) => {
  await ctx.answerCbQuery();
  const svc = await service.getService(ctx.scene.session.serviceId);
  ctx.scene.session.draftDays = JSON.parse(svc.days);
  await view.showAskDays(ctx, ctx.scene.session.draftDays);
};

export const handleDay = async (ctx: any) => {
  await ctx.answerCbQuery();
  const day = ctx.match[1];
  let draft = ctx.scene.session.draftDays || [];
  const idx = draft.indexOf(day);
  if (idx > -1) draft.splice(idx, 1);
  else draft.push(day);
  ctx.scene.session.draftDays = draft;
  await view.showAskDays(ctx, draft);
};

export const saveDays = async (ctx: any) => {
  await ctx.answerCbQuery();
  const draft = ctx.scene.session.draftDays;
  if (!draft || draft.length === 0) return view.showError(ctx, ServicesMessages.pleaseSelectAtLeastOneDay);
  await service.updateServiceData(ctx.scene.session.serviceId, { days: JSON.stringify(draft) });
  await view.showSuccess(ctx, ServicesMessages.daysUpdated);
  ctx.scene.session.action = "menu";
  await handleMenu(ctx);
};

export const deleteSvc = async (ctx: any) => {
  await ctx.answerCbQuery();
  await service.removeService(ctx.scene.session.serviceId);
  await view.showSuccess(ctx, ServicesMessages.serviceDeleted);
  await ctx.scene.enter("MANAGER_DASHBOARD_SCENE");
};
