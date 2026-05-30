// src/features/manager/billing/views/billing.view.ts
import type { MyContext } from "../../../../core/types.ts";
import { BillingMessages } from "./billing.messages.ts";
import { buildPackagesKeyboard } from "./billing.keyboards.ts";

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
