// src/features/customer/salons/controllers/salons.controller.ts
import type { MyContext } from "../../../../core/types.ts";
import * as service from "../services/salons.service.ts";
import * as view from "../views/salons.view.ts";
import { getOrganizationByTelegramId } from "../../../../db/organization.repository.ts";

export const handleEnter = async (ctx: MyContext) => {
  if (ctx.callbackQuery) await ctx.answerCbQuery().catch(() => {});
  
  const state = ctx.scene.state as any;
  if (state && state.action === 'reply' && state.salonId) {
    (ctx.scene.session as any).salonUserIdForMsg = state.salonId;
    ctx.scene.state = {}; 
    const salons = await service.getSalons(ctx.from!.id);
    const salon = salons.find((s: any) => s.salon_user_id === state.salonId);
    const history = await service.getConversation(state.salonId, ctx.from!.id, 5);
    await view.showTypeMessage(ctx, salon?.salon_name, history, 'generic');
    return;
  }

  const telegramId = ctx.from!.id;
  const salons = await service.getSalons(telegramId);
  await view.showSalonsList(ctx, salons, 'generic');
};

export const handleSelectSalon = async (ctx: MyContext) => {
  if (!ctx.match) return;
  await ctx.answerCbQuery().catch(() => {});
  const salonUserId = parseInt(ctx.match[1]);
  const salons = await service.getSalons(ctx.from!.id);
  const salon = salons.find((s: any) => s.salon_user_id === salonUserId);
  if (salon) {
    await view.showSalonDetails(ctx, salon, 'generic');
  }
};

export const handleDelete = async (ctx: MyContext) => {
  if (!ctx.match) return;
  const salonUserId = parseInt(ctx.match[1]);
  await service.removeSalon(ctx.from!.id, salonUserId);
  await view.showDeleteSuccess(ctx, 'generic');
  await handleEnter(ctx);
};

export const handleReserve = async (ctx: MyContext) => {
  if (!ctx.match) return;
  await ctx.answerCbQuery().catch(() => {});
  const salonUserId = parseInt(ctx.match[1]);
  const salons = await service.getSalons(ctx.from!.id);
  const salon = salons.find((s: any) => s.salon_user_id === salonUserId);
  if (salon) {
    let category = 'generic';
    let targetOrgId = '';
    if (salon.salon_telegram_id) {
      const org = await getOrganizationByTelegramId(salon.salon_telegram_id);
      if (org) {
        category = org.business_category || 'generic';
        targetOrgId = org.id;
      }
    }
    
    if (!targetOrgId) {
        await ctx.answerCbQuery("این مجموعه هنوز سیستم رزرو جدید را فعال نکرده است.", { show_alert: true });
        return;
    }
    
    await ctx.scene.enter("CUSTOMER_BOOKING_WIZARD_SCENE", {
      salonId: targetOrgId,
      salonName: salon.salon_name || "مجموعه",
      category
    });
  }
};

export const handleSendMessage = async (ctx: MyContext) => {
  if (!ctx.match) return;
  await ctx.answerCbQuery().catch(() => {});
  const salonUserId = parseInt(ctx.match[1]);
  (ctx.scene.session as any).salonUserIdForMsg = salonUserId;
  const salons = await service.getSalons(ctx.from!.id);
  const salon = salons.find((s: any) => s.salon_user_id === salonUserId);
  const history = await service.getConversation(salonUserId, ctx.from!.id, 5);
  await view.showTypeMessage(ctx, salon?.salon_name, history, 'generic');
};

export const handleText = async (ctx: MyContext) => {
  const salonUserId = (ctx.scene.session as any).salonUserIdForMsg;
  if (salonUserId && ctx.message && "text" in ctx.message) {
    const text = ctx.message.text.trim();
    await service.sendMessageToSalon(salonUserId, ctx.from!.id, ctx.from!.first_name || "کاربر", text);
    await view.showMsgSentSuccess(ctx, 'generic');
    (ctx.scene.session as any).salonUserIdForMsg = undefined;
    await handleEnter(ctx);
  }
};

export const handleBack = async (ctx: MyContext) => {
  await ctx.scene.enter("CUSTOMER_DASHBOARD_SCENE");
};
