// src/features/customer/dashboard/controllers/dashboard.controller.ts
import type { MyContext } from "../../../../core/types.ts";
import * as view from "../views/dashboard.view.ts";

export const handleEnter = async (ctx: MyContext) => {
  await view.showDashboard(ctx);
};

export const goToReservations = async (ctx: MyContext) => {
  await ctx.answerCbQuery().catch(() => {});
  await ctx.scene.enter("CUSTOMER_RESERVATIONS_SCENE");
};

export const goToSalons = async (ctx: MyContext) => {
  await ctx.answerCbQuery().catch(() => {});
  await ctx.scene.enter("CUSTOMER_SALONS_SCENE");
};

export const goToGuide = async (ctx: MyContext) => {
  await ctx.answerCbQuery().catch(() => {});
  await ctx.scene.enter("CUSTOMER_GUIDE_SCENE");
};
