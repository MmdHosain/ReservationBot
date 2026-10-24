// src/features/customer/salons/views/salons.view.ts
import type { MyContext } from "../../../../core/types.ts";
import { getSalonMessages } from "./salons.messages.ts";
import { buildSalonsListKeyboard, buildSalonActionKeyboard, buildBackToSalonsKeyboard } from "./salons.keyboards.ts";

export const showSalonsList = async (ctx: MyContext, salons: any[], categoryStr: string = 'generic') => {
  const m = getSalonMessages(categoryStr);
  const kb = buildSalonsListKeyboard(salons, categoryStr);
  if (salons.length === 0) {
    if (ctx.callbackQuery) {
      return ctx.editMessageText(m.noSalons, kb).catch(() => {});
    }
    return ctx.reply(m.noSalons, kb);
  }

  if (ctx.callbackQuery) {
    await ctx.editMessageText(m.header, kb).catch(() => {});
  } else {
    await ctx.reply(m.header, kb);
  }
};

export const showSalonDetails = async (ctx: MyContext, salon: any, categoryStr: string = 'generic') => {
  const m = getSalonMessages(categoryStr);
  const salonName = salon.salon_name || m.unknownUser;
  const msgText = m.salonDetails(salonName);
  const kb = buildSalonActionKeyboard(salon.salon_user_id, categoryStr);

  if (ctx.callbackQuery) {
    await ctx.editMessageText(msgText, kb).catch(() => {});
  } else {
    await ctx.reply(msgText, kb);
  }
};

export const showDeleteSuccess = async (ctx: MyContext, categoryStr: string = 'generic') => {
  const m = getSalonMessages(categoryStr);
  await ctx.answerCbQuery(m.deleteSuccess, { show_alert: true }).catch(() => {});
};

export const showTypeMessage = async (ctx: MyContext, salonName?: string, history?: any[], categoryStr: string = 'generic') => {
  const m = getSalonMessages(categoryStr);
  let text = `✉️ گفتگو با ${salonName || 'مجموعه'}\n\n`;
  if (history && history.length > 0) {
    text += history.map((h: any) => {
      const prefix = h.senderType === 'salon' ? '🏪 مجموعه: ' : '🧑 شما: ';
      return `${prefix}${h.content}`;
    }).join('\n\n') + '\n\n';
  }
  text += m.typeMessage;

  const kb = buildBackToSalonsKeyboard(categoryStr);
  if (ctx.callbackQuery) {
    await ctx.editMessageText(text, kb).catch(() => {});
  } else {
    await ctx.reply(text, kb);
  }
};

export const showMsgSentSuccess = async (ctx: MyContext, categoryStr: string = 'generic') => {
  const m = getSalonMessages(categoryStr);
  await ctx.reply(m.msgSent);
};
