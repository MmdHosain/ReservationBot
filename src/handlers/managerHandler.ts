// src/handlers/managerHandler.ts
import type { MyContext } from "../types/index.ts";
import { getOrCreateUser } from "../db/user.repository.ts";
import { MESSAGES } from "../messages.ts";

import { ONBOARDING_SCENE_ID } from "../scenes/onboarding/index.ts";
import { DASHBOARD_SCENE_ID } from "../scenes/dashboard/index.ts";

export const managerHandler = async (ctx: MyContext) => {
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
