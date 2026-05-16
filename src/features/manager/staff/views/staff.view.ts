// src/features/manager/staff/views/staff.view.ts
import { StaffMessages } from "./staff.messages.ts";
import { buildStaffKeyboard } from "./staff.keyboards.ts";
import type { StaffContext } from "../types/staff.types.ts";

export const showStaffList = async (ctx: StaffContext, staffList: any[]) => {
  await ctx.reply(StaffMessages.prompt, buildStaffKeyboard(staffList));
};

export const showSuccess = async (ctx: StaffContext, text: string) => {
  await ctx.reply(text);
};
