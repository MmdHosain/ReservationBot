// src/features/core/start/controllers/start.controller.ts
import type { MyContext } from "../../../core/types.ts";
import * as service from "../services/start.service.ts";

export const handleStartCommand = async (ctx: MyContext) => {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  const text = ctx.message && "text" in ctx.message ? ctx.message.text : "";
  const parts = text.split(" ");

  if (parts.length > 1) {
    await service.processStartPayload(telegramId, parts[1]);
  } else {
    await service.ensureUserExists(telegramId);
  }

  await ctx.scene.enter("CUSTOMER_DASHBOARD_SCENE");
};
