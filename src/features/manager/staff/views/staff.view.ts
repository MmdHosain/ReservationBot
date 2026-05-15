// src/features/manager/staff/views/staff.view.ts
import { StaffMessages } from "./staff.messages.ts";
import { buildStaffKeyboard } from "./staff.keyboards.ts";

export const showStaffList = async (ctx: any, staffList: any[]) => {
  await ctx.reply(StaffMessages.prompt, buildStaffKeyboard(staffList));
};

export const showSuccess = async (ctx: any, text: string) => {
  await ctx.reply(text);
};
