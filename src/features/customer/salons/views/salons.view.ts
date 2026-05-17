// src/features/customer/salons/views/salons.view.ts
import type { MyContext } from "../../../../core/types.ts";
import { SalonMessages } from "./salons.messages.ts";
import { buildSalonsListKeyboard, buildSalonActionKeyboard, buildBackToSalonsKeyboard } from "./salons.keyboards.ts";

export const showSalonsList = async (ctx: MyContext, salons: any[]) => {
  const kb = buildSalonsListKeyboard(salons);
  if (salons.length === 0) {
    if (ctx.callbackQuery) {
      return ctx.editMessageText(SalonMessages.noSalons, kb).catch(() => {});
    }
    return ctx.reply(SalonMessages.noSalons, kb);
  }

  if (ctx.callbackQuery) {
    await ctx.editMessageText(SalonMessages.header, kb).catch(() => {});
  } else {
    await ctx.reply(SalonMessages.header, kb);
  }
};

export const showSalonDetails = async (ctx: MyContext, salon: any) => {
  const salonName = salon.salon_name || SalonMessages.unknownUser;
  const msgText = SalonMessages.salonDetails(salonName);
  const kb = buildSalonActionKeyboard(salon.salon_user_id);

  if (ctx.callbackQuery) {
    await ctx.editMessageText(msgText, kb).catch(() => {});
  } else {
    await ctx.reply(msgText, kb);
  }
};

export const showDeleteSuccess = async (ctx: MyContext) => {
  await ctx.answerCbQuery(SalonMessages.deleteSuccess, { show_alert: true }).catch(() => {});
};

export const showTypeMessage = async (ctx: MyContext) => {
  const kb = buildBackToSalonsKeyboard();
  if (ctx.callbackQuery) {
    await ctx.editMessageText(SalonMessages.typeMessage, kb).catch(() => {});
  } else {
    await ctx.reply(SalonMessages.typeMessage, kb);
  }
};

export const showMsgSentSuccess = async (ctx: MyContext) => {
  await ctx.reply(SalonMessages.msgSent);
};
