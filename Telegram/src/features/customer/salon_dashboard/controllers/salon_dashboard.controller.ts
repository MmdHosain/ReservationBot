// src/features/customer/salon_dashboard/controllers/salon_dashboard.controller.ts
import type { MyContext } from "../../../../core/types.ts";
import * as view from "../views/salon_dashboard.view.ts";

export const handleEnter = async (ctx: MyContext) => {
  const state = ctx.scene.state as { salonId: number, salonName: string, category?: string };
  (ctx.scene.session as any).salonId = state.salonId;
  (ctx.scene.session as any).salonName = state.salonName;
  (ctx.scene.session as any).category = state.category || 'generic';
  await view.showDashboard(ctx, state.salonName, (ctx.scene.session as any).category);
};

export const goToBooking = async (ctx: MyContext) => {
  await ctx.answerCbQuery().catch(() => {});
  const s = ctx.scene.session as any;
  await ctx.scene.enter("CUSTOMER_BOOKING_WIZARD_SCENE", { salonId: s.salonId, salonName: s.salonName, category: s.category });
};

export const goBack = async (ctx: MyContext) => {
  await ctx.answerCbQuery().catch(() => {});
  await ctx.scene.enter("CUSTOMER_DASHBOARD_SCENE");
};
