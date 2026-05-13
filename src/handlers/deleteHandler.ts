// src/handlers/deleteHandler.ts
import { deleteUserByTelegramId } from "../db/user.repository.ts";
import { MESSAGES } from "../messages.ts";

export const deleteHandler = async (ctx: any) => {
  const targetTelegramId = ctx.from.id;

  await ctx.reply(MESSAGES.deletingUser);
  const result = await deleteUserByTelegramId(targetTelegramId);

  if (result.success) {
    return ctx.reply(`✅ ${result.message}`);
  } else {
    return ctx.reply(`❌ ${result.message}`);
  }
};
