// src/features/manager/share_link/controllers/share_link.controller.ts
import type { MyContext } from "../../../../core/types.ts";
import * as view from "../views/share_link.view.ts";
import { getUserByTelegramId } from "../../../../db/user.repository.ts";

export const handleEnter = async (ctx: MyContext) => {
  if (ctx.callbackQuery) await ctx.answerCbQuery().catch(() => {});
  const user = await getUserByTelegramId(ctx.from!.id);
  const botUsername = ctx.botInfo?.username || "bot";
  
  if (user) {
    const link = `https://ble.ir/${botUsername}?start=${user.id}`;
    await view.showShareLink(ctx, link);
  }
};

export const handleBack = async (ctx: MyContext) => {
  if (ctx.callbackQuery) await ctx.answerCbQuery().catch(() => {});
  await ctx.scene.enter("MANAGER_DASHBOARD_SCENE");
};
