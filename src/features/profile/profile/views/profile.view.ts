// src/features/profile/profile/views/profile.view.ts
import type { MyContext } from "../../../../core/types.ts";
import { ProfileMessages } from "./profile.messages.ts";
import { buildProfileKeyboard } from "./profile.keyboards.ts";

export const showProfile = async (ctx: MyContext, currentCalendar: string) => {
  const msg =
    ProfileMessages.profileMenu +
    "\n\n" +
    ProfileMessages.currentCalendar(currentCalendar);
  const kb = buildProfileKeyboard(currentCalendar);

  if (ctx.callbackQuery) {
    await ctx.editMessageText(msg, kb).catch(() => {});
  } else {
    await ctx.reply(msg, kb);
  }
};

export const showCalendarUpdated = async (ctx: MyContext, type: string) => {
  const text =
    type === "shamsi"
      ? ProfileMessages.calendarSetShamsi
      : ProfileMessages.calendarSetMiladi;
  await ctx.answerCbQuery(text).catch(() => {});
};

export const closeProfile = async (ctx: MyContext) => {
  if (ctx.callbackQuery) {
    await ctx.editMessageText(ProfileMessages.closed).catch(() => {});
  } else {
    await ctx.reply(ProfileMessages.closed);
  }
};
