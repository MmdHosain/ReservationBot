// src/features/manager/staff/views/staff.keyboards.ts
import { Markup } from "telegraf";
import { StaffMessages } from "./staff.messages.ts";

export const buildStaffKeyboard = (staffList: any[]) => {
  const buttons = staffList.map((s) => [
    Markup.button.callback(StaffMessages.delBtn(s.name), `del_staff_${s.id}`),
  ]);
  buttons.push([Markup.button.callback(StaffMessages.backBtn, "back_dash")]);
  return Markup.inlineKeyboard(buttons);
};
