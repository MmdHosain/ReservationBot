// src/features/profile/profile/views/profile.keyboards.ts
import { Markup } from "telegraf";
import { ProfileMessages } from "./profile.messages.ts";

export const buildProfileKeyboard = (currentType: string) => {
  return Markup.inlineKeyboard([
    [Markup.button.callback(
      currentType === 'shamsi' ? `✅ ${ProfileMessages.shamsiBtn}` : `📅 ${ProfileMessages.shamsiBtn}`, 
      "set_calendar_shamsi"
    )],
    [Markup.button.callback(
      currentType === 'miladi' ? `✅ ${ProfileMessages.miladiBtn}` : `📅 ${ProfileMessages.miladiBtn}`, 
      "set_calendar_miladi"
    )],
    [Markup.button.callback(`❌ ${ProfileMessages.closeBtn}`, "close_profile")]
  ]);
};
