// src/features/customer/guide/views/guide.view.ts
import type { MyContext } from "../../../../core/types.ts";
import { GuideMessages } from "./guide.messages.ts";
import { buildBackKeyboard } from "./guide.keyboards.ts";

export const showGuide = async (ctx: MyContext) => {
  const kb = buildBackKeyboard();
  const text = GuideMessages.guideText;

  if (ctx.callbackQuery) {
    await ctx
      .editMessageText(text, { parse_mode: "Markdown", ...kb })
      .catch(() => {});
  } else {
    await ctx.reply(text, { parse_mode: "Markdown", ...kb });
  }
};
