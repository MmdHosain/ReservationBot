// src/features/manager/billing/controllers/billing.controller.ts
import type { MyContext } from "../../../../core/types.ts";
import * as view from "../views/billing.view.ts";
import { getUserByTelegramId, renewSubscription } from "../../../../db/user.repository.ts";
import { AppDataSource } from "../../../../db/orm.config.ts";
import { Transaction } from "../../../../db/entities/v1/index.ts";
import config from "../../../../core/config.ts";

export const handleEnter = async (ctx: MyContext) => {
  const user = await getUserByTelegramId(ctx.from!.id);
  if (!user) return;
  
  const isExpired = user.subscription_expires_at && new Date(user.subscription_expires_at) < new Date();
  await view.showPackages(ctx, !!isExpired, user.subscription_expires_at);
};

export const handleSelectPackage = async (ctx: MyContext) => {
  if (!ctx.match) return;
  const days = parseInt(ctx.match[1]);
  const amount = parseInt(ctx.match[2]);
  
  await ctx.answerCbQuery().catch(() => {});
  
  try {
    await ctx.replyWithInvoice({
      title: "تمدید اشتراک پنل",
      description: `خرید اشتراک ${days} روزه پنل مدیریت سالن`,
      payload: `pkg_${days}_${amount}`,
      provider_token: config.providerToken,
      currency: "IRR",
      prices: [{ label: "مبلغ بسته", amount: amount * 10 }]
    });
  } catch (err) {
    console.error("Invoice Error:", err);
    await ctx.reply("❌ خطا در ایجاد صورتحساب کیف‌پول.");
  }
};

export const handlePreCheckout = async (ctx: MyContext) => {
  await ctx.answerPreCheckoutQuery(true).catch(console.error);
};

export const handleSuccessfulPayment = async (ctx: MyContext) => {
  const payment = (ctx.message as any)?.successful_payment;
  if (!payment) return;
  
  const payload = payment.invoice_payload;
  if (payload && payload.startsWith("pkg_")) {
    const parts = payload.split("_");
    const days = parseInt(parts[1]);
    const amount = parseInt(parts[2]);
    
    if (ctx.from) {
      const user = await getUserByTelegramId(ctx.from.id);
      if (user) {
        await renewSubscription(user.id, days);
        
        const txRepo = AppDataSource.getRepository(Transaction);
        const tx = txRepo.create({
          user_id: user.id,
          amount,
          package_days: days,
          status: 'approved',
          authority: payment.provider_payment_charge_id || payment.telegram_payment_charge_id
        });
        await txRepo.save(tx);
        
        await ctx.reply(`✅ پرداخت شما با موفقیت انجام شد و اشتراک شما به مدت ${days} روز تمدید گردید.`);
        await ctx.scene.enter("MANAGER_DASHBOARD_SCENE");
      }
    }
  }
};
