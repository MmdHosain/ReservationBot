// src/core/middlewares/subscription.guard.ts
import { getUserByTelegramId } from "../../db/user.repository.ts";

export const subscriptionGuard = async (ctx: any, next: () => Promise<void>) => {
  const telegramId = ctx.from?.id;
  if (!telegramId) return next();

  const user = await getUserByTelegramId(telegramId);
  if (user?.onboarded_at && user?.subscription_expires_at) {
    if (new Date(user.subscription_expires_at) < new Date()) {
      if (ctx.callbackQuery) {
        await ctx.answerCbQuery("❌ اعتبار پنل شما به پایان رسیده است.", { show_alert: true }).catch(() => {});
      } else {
        await ctx.reply("❌ اعتبار پنل شما به پایان رسیده است. لطفا برای ادامه استفاده، اشتراک خود را تمدید کنید.");
      }
      return ctx.scene.enter("MANAGER_BILLING_SCENE");
    }
  }
  return next();
};
