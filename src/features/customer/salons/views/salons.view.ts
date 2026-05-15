// src/features/customer/salons/views/salons.view.ts
import type { MyContext } from "../../../../../types/index.ts";
import { SalonMessages } from "./salons.messages.ts";
import { buildSalonsKeyboard, buildBackKeyboard } from "./salons.keyboards.ts";

export const showSalons = async (ctx: MyContext, salons: any[]) => {
  if (salons.length === 0) {
    const kb = buildBackKeyboard();
    if (ctx.callbackQuery) {
      return ctx.editMessageText(SalonMessages.noSalons, kb).catch(() => {});
    }
    return ctx.reply(SalonMessages.noSalons, kb);
  }

  const botUsername = ctx.botInfo.username;
  const kb = buildSalonsKeyboard(salons, botUsername);

  if (ctx.callbackQuery) {
    await ctx.editMessageText(SalonMessages.header, kb).catch(() => {});
  } else {
    await ctx.reply(SalonMessages.header, kb);
  }
};

export const showDeleteSuccess = async (ctx: MyContext) => {
  await ctx.answerCbQuery(SalonMessages.deleteSuccess).catch(() => {});
};
