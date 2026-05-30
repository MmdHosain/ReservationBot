// src/features/customer/guide/controllers/guide.controller.ts
import type { MyContext } from "../../../../core/types.ts";
import * as view from "../views/guide.view.ts";

export const handleEnter = async (ctx: MyContext) => {
  if (ctx.callbackQuery) await ctx.answerCbQuery().catch(() => {});
  await view.showGuide(ctx);
};

export const handleBack = async (ctx: MyContext) => {
  await ctx.scene.enter("CUSTOMER_DASHBOARD_SCENE");
};
