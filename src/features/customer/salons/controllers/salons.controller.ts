// src/features/customer/salons/controllers/salons.controller.ts
import type { MyContext } from "../../../../core/types.ts";
import * as service from "../services/salons.service.ts";
import * as view from "../views/salons.view.ts";

export const handleEnter = async (ctx: MyContext) => {
  if (ctx.callbackQuery) await ctx.answerCbQuery().catch(() => {});
  const telegramId = ctx.from!.id;
  const salons = await service.getSalons(telegramId);
  await view.showSalonsList(ctx, salons);
};

export const handleSelectSalon = async (ctx: MyContext) => {
  if (!ctx.match) return;
  await ctx.answerCbQuery().catch(() => {});
  const salonUserId = parseInt(ctx.match[1]);
  const salons = await service.getSalons(ctx.from!.id);
  const salon = salons.find((s: any) => s.salon_user_id === salonUserId);
  if (salon) {
    await view.showSalonDetails(ctx, salon);
  }
};

export const handleDelete = async (ctx: MyContext) => {
  if (!ctx.match) return;
  const salonUserId = parseInt(ctx.match[1]);
  await service.removeSalon(ctx.from!.id, salonUserId);
  await view.showDeleteSuccess(ctx);
  await handleEnter(ctx);
};

export const handleReserve = async (ctx: MyContext) => {
  if (!ctx.match) return;
  await ctx.answerCbQuery().catch(() => {});
  const salonUserId = parseInt(ctx.match[1]);
  const salons = await service.getSalons(ctx.from!.id);
  const salon = salons.find((s: any) => s.salon_user_id === salonUserId);
  if (salon) {
    await ctx.scene.enter("CUSTOMER_BOOKING_WIZARD_SCENE", {
      salonId: salon.salon_user_id,
      salonName: salon.salon_name || "سالن"
    });
  }
};

export const handleSendMessage = async (ctx: MyContext) => {
  if (!ctx.match) return;
  await ctx.answerCbQuery().catch(() => {});
  const salonUserId = parseInt(ctx.match[1]);
  (ctx.scene.session as any).salonUserIdForMsg = salonUserId;
  await view.showTypeMessage(ctx);
};

export const handleText = async (ctx: MyContext) => {
  const salonUserId = (ctx.scene.session as any).salonUserIdForMsg;
  if (salonUserId && ctx.message && "text" in ctx.message) {
    const text = ctx.message.text.trim();
    await service.sendMessageToSalon(salonUserId, ctx.from!.id, ctx.from!.first_name || "کاربر", text);
    await view.showMsgSentSuccess(ctx);
    (ctx.scene.session as any).salonUserIdForMsg = undefined;
    await handleEnter(ctx);
  }
};

export const handleBack = async (ctx: MyContext) => {
  await ctx.scene.enter("CUSTOMER_DASHBOARD_SCENE");
};
