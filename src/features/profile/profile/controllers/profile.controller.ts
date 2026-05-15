// src/features/profile/profile/controllers/profile.controller.ts
import type { MyContext } from "../../../../core/types.ts";
import * as service from "../services/profile.service.ts";
import * as view from "../views/profile.view.ts";

export const handleProfileCommand = async (ctx: MyContext) => {
  await ctx.scene.enter("PROFILE_SCENE");
};

export const handleEnter = async (ctx: MyContext) => {
  if (ctx.callbackQuery) await ctx.answerCbQuery().catch(() => {});
  const telegramId = ctx.from!.id;
  const { calendarType } = await service.getUserPreferences(telegramId);
  await view.showProfile(ctx, calendarType);
};

export const handleSetCalendar = async (ctx: MyContext) => {
  if (!ctx.match) return;
  const type = ctx.match[1] as "shamsi" | "miladi";
  const telegramId = ctx.from!.id;

  await service.setCalendarType(telegramId, type);
  await view.showCalendarUpdated(ctx, type);

  const { calendarType } = await service.getUserPreferences(telegramId);
  await view.showProfile(ctx, calendarType);
};

export const handleClose = async (ctx: MyContext) => {
  await ctx.answerCbQuery().catch(() => {});
  await view.closeProfile(ctx);
  await ctx.scene.leave();
};
