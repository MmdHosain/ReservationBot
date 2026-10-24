// src/features/customer/dashboard/views/dashboard.view.ts
import type { MyContext } from "../../../../core/types.ts";
import { getDashboardMessages } from "./dashboard.messages.ts";
import { buildDashboardKeyboard } from "./dashboard.keyboards.ts";

export const showDashboard = async (ctx: MyContext) => {
  if (ctx.callbackQuery) await ctx.answerCbQuery().catch(() => {});
  const m = getDashboardMessages('generic');
  const msg = m.welcome;
  const kb = buildDashboardKeyboard('generic');

  if (ctx.callbackQuery) {
    await ctx.editMessageText(msg, kb).catch(() => {});
  } else {
    await ctx.reply(msg, kb);
  }
};
