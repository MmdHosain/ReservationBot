// src/features/customer/guide/views/guide.view.ts
import type { MyContext } from "../../../../core/types.ts";
import { getGuideMessages } from "./guide.messages.ts";
import { buildBackKeyboard } from "./guide.keyboards.ts";

export const showGuide = async (ctx: MyContext) => {
  const m = getGuideMessages('generic');
  const kb = buildBackKeyboard('generic');
  const text = m.guideText;

  if (ctx.callbackQuery) {
    await ctx
      .editMessageText(text, { parse_mode: "Markdown", ...kb })
      .catch(() => {});
  } else {
    await ctx.reply(text, { parse_mode: "Markdown", ...kb });
  }
};
