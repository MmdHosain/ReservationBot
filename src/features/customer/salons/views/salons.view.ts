// src/features/customer/salons/views/salons.view.ts
import type { MyContext } from "../../../../core/types.ts";
import { SalonMessages } from "./salons.messages.ts";
import { buildSalonKeyboard, buildBackKeyboard } from "./salons.keyboards.ts";

export const showSalons = async (ctx: MyContext, salons: any[]) => {
  const kb = buildBackKeyboard();
  if (salons.length === 0) {
    if (ctx.callbackQuery) {
      return ctx.editMessageText(SalonMessages.noSalons, kb).catch(() => {});
    }
    return ctx.reply(SalonMessages.noSalons, kb);
  }

  if (ctx.callbackQuery) {
    await ctx.editMessageText(SalonMessages.header).catch(() => {});
  } else {
    await ctx.reply(SalonMessages.header);
  }

  for (const s of salons) {
    const salonName = s.salon_name || SalonMessages.unknownUser;
    const msgText = `🏪 ${salonName}`;
    await ctx.reply(msgText, buildSalonKeyboard(s.salon_user_id));
  }

  await ctx.reply(SalonMessages.backPrompt, kb);
};

export const showDeleteSuccess = async (ctx: MyContext) => {
  await ctx.answerCbQuery(SalonMessages.deleteSuccess).catch(() => {});
  if (ctx.callbackQuery && ctx.callbackQuery.message) {
    const msg = ctx.callbackQuery.message as any;
    if (msg.text) {
      await ctx
        .editMessageText(msg.text + "\n\n" + SalonMessages.deletedTag)
        .catch(() => {});
    }
  }
};

export const showTypeMessage = async (ctx: MyContext) => {
  const kb = buildBackKeyboard();
  if (ctx.callbackQuery) {
    await ctx.editMessageText(SalonMessages.typeMessage, kb).catch(() => {});
  } else {
    await ctx.reply(SalonMessages.typeMessage, kb);
  }
};

export const showMsgSentSuccess = async (ctx: MyContext) => {
  await ctx.reply(SalonMessages.msgSent);
};
