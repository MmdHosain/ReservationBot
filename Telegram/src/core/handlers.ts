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
import { pool } from "../db/pool.ts";

export const botHandlers = new Composer<MyContext>();

botHandlers.start(handleStartCommand);
botHandlers.command("manager", handleManagerCommand);
botHandlers.command("customer", handleCustomerCommand);
botHandlers.command("admin", handleAdminCommand);
botHandlers.command("delete", handleDeleteCommand);
botHandlers.command("profile", handleProfileCommand);

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
        await pool.query(
          `INSERT INTO transactions (user_id, amount, package_days, status, authority) VALUES ($1, $2, $3, 'approved', $4)`,
          [user.id, amount, days, payment.provider_payment_charge_id || payment.telegram_payment_charge_id]
        );
        
        await ctx.reply(`✅ پرداخت شما با موفقیت انجام شد و اشتراک شما به مدت ${days} روز تمدید گردید.`);
      }
    }
  }
});
