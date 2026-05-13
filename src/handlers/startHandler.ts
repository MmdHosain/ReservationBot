// src/handlers/startHandler.ts
import type { MyContext } from "../types/index.ts";
import { getOrCreateUser, addCustomerSalon } from "../db/user.repository.ts";
import { showCustomerDashboard } from "./customerDashboard.ts";
import { CUSTOMER_SCENE_ID } from "../scenes/customer/index.ts";

export const startHandler = async (ctx: MyContext) => {
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
