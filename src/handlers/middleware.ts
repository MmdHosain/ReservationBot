// src/handlers/middleware.ts
import type { HandlerContext } from "./types.ts";
import { 
  getOrCreateUser, 
  addCustomerSalon, 
  deleteUserByTelegramId, 
  updateCalendarType 
} from "../db/user.repository.ts";
import { MESSAGES } from "../messages.ts";
import { CUSTOMER_SCENE_ID } from "../scenes/customer/index.ts";
import { ONBOARDING_SCENE_ID } from "../scenes/manager/onboarding/index.ts";
import { DASHBOARD_SCENE_ID } from "../scenes/manager/dashboard/index.ts";
import { showCustomerDashboard } from "../scenes/customer/dashboard.ts";

export const startHandler = async (ctx: HandlerContext) => {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  await getOrCreateUser(telegramId);

  const text = ctx.message && "text" in ctx.message ? ctx.message.text : "";
  const parts = text.split(" ");
  if (parts.length > 1) {
    const payload = parts[1];
    const ownerId = parseInt(payload, 10);
    if (!isNaN(ownerId)) {
      await addCustomerSalon(telegramId, ownerId);
      return ctx.scene.enter(CUSTOMER_SCENE_ID, { ownerTelegramId: ownerId });
    }
  }

  await showCustomerDashboard(ctx);
};

export const managerHandler = async (ctx: HandlerContext) => {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  const user = await getOrCreateUser(telegramId);
  if (user?.onboarded_at) {
    await ctx.reply(MESSAGES.welcomeBack);
    await ctx.scene.enter(DASHBOARD_SCENE_ID);
  } else {
    return ctx.scene.enter(ONBOARDING_SCENE_ID);
  }
};

export const deleteHandler = async (ctx: HandlerContext) => {
  const targetTelegramId = ctx.from?.id;
  if (!targetTelegramId) return;

  await ctx.reply(MESSAGES.deletingUser);
  const result = await deleteUserByTelegramId(targetTelegramId);

  if (result.success) {
    return ctx.reply(`✅ ${result.message}`);
  } else {
    return ctx.reply(`❌ ${result.message}`);
  }
};

export async function setShamsiCalendar(ctx: HandlerContext) {
  if (!ctx.from) return;
  await updateCalendarType(ctx.from.id, 'shamsi');
  await ctx.reply(MESSAGES.calendarSetShamsi);
}

export async function setMiladiCalendar(ctx: HandlerContext) {
  if (!ctx.from) return;
  await updateCalendarType(ctx.from.id, 'miladi');
  await ctx.reply(MESSAGES.calendarSetMiladi);
}
