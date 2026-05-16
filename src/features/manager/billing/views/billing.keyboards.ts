// src/features/manager/billing/views/billing.keyboards.ts
import { Markup } from "telegraf";
import { BillingMessages } from "./billing.messages.ts";

export const buildPackagesKeyboard = (isExpired: boolean) => {
  const buttons = [
    [Markup.button.callback(BillingMessages.pkg1Month, "buy_pkg_30_99000")],
    [Markup.button.callback(BillingMessages.pkg3Months, "buy_pkg_90_250000")],
    [Markup.button.callback(BillingMessages.pkg6Months, "buy_pkg_180_450000")],
    [Markup.button.callback(BillingMessages.pkg1Year, "buy_pkg_365_800000")],
  ];
  if (!isExpired) {
    buttons.push([Markup.button.callback(BillingMessages.backBtn, "back_dash")]);
  }
  return Markup.inlineKeyboard(buttons);
};

export const buildMockPaymentKeyboard = (days: number) => {
  return Markup.inlineKeyboard([
    [Markup.button.callback(BillingMessages.payBtn, `mock_pay_${days}`)]
  ]);
};
