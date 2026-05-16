// src/features/manager/billing/views/billing.view.ts
import type { MyContext } from "../../../../core/types.ts";
import { BillingMessages } from "./billing.messages.ts";
import { buildPackagesKeyboard, buildMockPaymentKeyboard } from "./billing.keyboards.ts";

export const showPackages = async (ctx: MyContext, isExpired: boolean, expireDate: string | Date | null) => {
  let text = isExpired || !expireDate ? BillingMessages.expiredSub : BillingMessages.activeSub(new Date(expireDate));
  text += BillingMessages.choosePackage;
  
  const kb = buildPackagesKeyboard(isExpired);
  
  if (ctx.callbackQuery) {
    await ctx.editMessageText(text, kb).catch(() => {});
  } else {
    await ctx.reply(text, kb);
  }
};

export const showMockPayment = async (ctx: MyContext, days: number, amount: number) => {
  const text = BillingMessages.mockPaymentPrompt(amount, days);
  const kb = buildMockPaymentKeyboard(days);
  await ctx.editMessageText(text, kb).catch(() => {});
};

export const showPaymentSuccess = async (ctx: MyContext) => {
  await ctx.reply(BillingMessages.success);
};
