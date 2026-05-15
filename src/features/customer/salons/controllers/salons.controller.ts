// src/features/customer/salons/controllers/salons.controller.ts
import type { MyContext } from "../../../../core/types.ts";
import * as service from "../services/salons.service.ts";
import * as view from "../views/salons.view.ts";

export const handleEnter = async (ctx: MyContext) => {
  if (ctx.callbackQuery) await ctx.answerCbQuery().catch(() => {});
  const telegramId = ctx.from!.id;
  const salons = await service.getSalons(telegramId);
  await view.showSalons(ctx, salons);
};

export const handleDelete = async (ctx: MyContext) => {
  if (!ctx.match) return;
  const salonUserId = parseInt(ctx.match[1]);
  await service.removeSalon(ctx.from!.id, salonUserId);
  await view.showDeleteSuccess(ctx);
  await handleEnter(ctx);
};

export const handleBack = async (ctx: MyContext) => {
  await ctx.scene.enter("CUSTOMER_DASHBOARD_SCENE");
};
