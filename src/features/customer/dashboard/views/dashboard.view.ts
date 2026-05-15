// src/features/customer/dashboard/views/dashboard.view.ts
import type { MyContext } from "../../../../../types/index.ts";
import { DashboardMessages } from "./dashboard.messages.ts";
import { buildDashboardKeyboard } from "./dashboard.keyboards.ts";

export const showDashboard = async (ctx: MyContext) => {
  if (ctx.callbackQuery) await ctx.answerCbQuery().catch(() => {});
  const msg = DashboardMessages.welcome;
  const kb = buildDashboardKeyboard();

  if (ctx.callbackQuery) {
    await ctx.editMessageText(msg, kb).catch(() => {});
  } else {
    await ctx.reply(msg, kb);
  }
};
