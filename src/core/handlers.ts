// src/core/handlers.ts
import { Composer } from "telegraf";
import type { MyContext } from "./types.ts";

import { handleStartCommand } from "../features/start/controllers/start.controller.ts";
import { handleManagerCommand } from "../features/manager/dashboard/controllers/dashboard.controller.ts";
import { handleDeleteCommand } from "../features/profile/account/controllers/account.controller.ts";
import { handleProfileCommand } from "../features/profile/profile/controllers/profile.controller.ts";
import { handleCustomerCommand } from "../features/customer/index.ts";
import { handleAdminCommand } from "../features/admin/index.ts";
import { renewSubscription, getUserByTelegramId } from "../db/user.repository.ts";
import { AppDataSource } from "../db/orm.config.ts";
import { Transaction } from "../db/entities/v1/index.ts";

export const botHandlers = new Composer<MyContext>();

botHandlers.start(handleStartCommand);
botHandlers.command("manager", handleManagerCommand);
botHandlers.command("customer", handleCustomerCommand);
botHandlers.command("admin", handleAdminCommand);
botHandlers.command("delete", handleDeleteCommand);
botHandlers.command("profile", handleProfileCommand);

botHandlers.command("cancel", async (ctx) => {
  if (ctx.scene?.current) {
    await ctx.scene.leave().catch(() => {});
  }
  if (ctx.session) {
    delete (ctx.session as any).__scenes;
    delete (ctx.session as any).draft;
    delete (ctx.session as any).step;
  }
  await ctx.reply("❌ عملیات جاری لغو شد.\n\nبرای شروع دوباره، دستور /start را ارسال کنید.");
});

botHandlers.action(/reply_salon_(\d+)/, async (ctx) => {
  await ctx.answerCbQuery().catch(() => {});
  const salonId = parseInt(ctx.match[1]);
  await ctx.scene.enter("CUSTOMER_SALONS_SCENE", { action: 'reply', salonId });
});

botHandlers.on("pre_checkout_query", async (ctx) => {
  await ctx.answerPreCheckoutQuery(true).catch(console.error);
});

botHandlers.on("successful_payment", async (ctx) => {
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
      }
    }
  }
});

// Fallback message handler: guides the user whenever an unhandled message arrives
botHandlers.on("message", async (ctx) => {
  await ctx.reply(
    `👋 سلام ${ctx.from?.first_name || "کاربر گرامی"}!\n\n` +
    `پیام شما دریافت شد. برای کار با ربات می‌توانید از دستورات زیر استفاده فرمایید:\n\n` +
    `🚀 شروع مجدد و راه‌اندازی: /start\n` +
    `📊 پنل مدیریت نوبت‌دهی: /manager\n` +
    `📅 رزرو نوبت یا نوبت‌های من: /customer\n` +
    `👤 حساب کاربری: /profile\n\n` +
    `💡 هر زمان که در هر مرحله‌ای نیاز به شروع دوباره داشتید، کافیست دستور /start را بفرستید.`
  );
});
