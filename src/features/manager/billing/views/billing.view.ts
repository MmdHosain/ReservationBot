// src/features/manager/billing/views/billing.view.ts
import type { MyContext } from "../../../../core/types.ts";
import { BillingMessages } from "./billing.messages.ts";
import { buildPackagesKeyboard } from "./billing.keyboards.ts";
import { Markup } from "telegraf";

export const showPackages = async (ctx: MyContext, isExpired: boolean, expireDate: string | Date | null) => {
  let text = isExpired || !expireDate ? BillingMessages.expiredSub : BillingMessages.activeSub(new Date(expireDate));
  text += BillingMessages.howItWorks;
  text += BillingMessages.choosePackage;
  
  const kb = buildPackagesKeyboard(isExpired);
  
  if (ctx.callbackQuery) {
    await ctx.editMessageText(text, { parse_mode: "Markdown", ...kb }).catch(() => {});
  } else {
    await ctx.reply(text, { parse_mode: "Markdown", ...kb });
  }
};

export const showPaymentInstructions = async (ctx: MyContext, days: number, amount: number) => {
  const text = BillingMessages.paymentInstructions(amount, days);
  const kb = Markup.inlineKeyboard([[Markup.button.callback(BillingMessages.cancelBtn, "cancel_receipt")]]);
  await ctx.editMessageText(text, { parse_mode: "Markdown", ...kb }).catch(() => {});
};

export const showPendingState = async (ctx: MyContext) => {
  const text = BillingMessages.pendingState;
  const kb = Markup.inlineKeyboard([[Markup.button.callback(BillingMessages.backBtn, "back_dash")]]);
  if (ctx.callbackQuery) {
    await ctx.editMessageText(text, { ...kb }).catch(() => {});
  } else {
    await ctx.reply(text, kb);
  }
};

export const showReceiptSubmitted = async (ctx: MyContext) => {
  await ctx.reply(BillingMessages.receiptSubmitted);
};
