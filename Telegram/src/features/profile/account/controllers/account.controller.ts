// src/features/profile/account/controllers/account.controller.ts
import type { MyContext } from "../../../../core/types.ts";
import * as service from "../services/account.service.ts";
import { getCoreMessages } from "../../../../core/messages.ts";

export const handleDeleteCommand = async (ctx: MyContext) => {
  const targetTelegramId = ctx.from?.id;
  if (!targetTelegramId) return;

  await ctx.reply(getCoreMessages(ctx.businessCategory).deletingUser);
  const result = await service.deleteAccount(targetTelegramId);

  if (result.success) {
    await ctx.reply(`✅ ${result.message}`);
  } else {
    await ctx.reply(`❌ ${result.message}`);
  }
};
