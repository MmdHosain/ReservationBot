// src/features/manager/share_link/views/share_link.view.ts
import type { MyContext } from "../../../../core/types.ts";
import { ShareLinkMessages } from "./share_link.messages.ts";
import { buildBackKeyboard } from "./share_link.keyboards.ts";

export const showShareLink = async (ctx: MyContext, link: string) => {
  const text = ShareLinkMessages.title(link);
  const kb = buildBackKeyboard();
  if (ctx.callbackQuery) {
    await ctx.editMessageText(text, { parse_mode: "Markdown", ...kb }).catch(() => {});
  } else {
    await ctx.reply(text, { parse_mode: "Markdown", ...kb });
  }
};
