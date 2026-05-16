// src/features/manager/staff/controllers/staff.controller.ts
import * as service from "../services/staff.service.ts";
import * as view from "../views/staff.view.ts";
import { StaffMessages } from "../views/staff.messages.ts";
import type { StaffContext } from "../types/staff.types.ts";

export const handleEnter = async (ctx: StaffContext) => {
  const user = await service.getUser(ctx.from!.id);
  const staffList = await service.getStaffList(user.id);
  ctx.scene.session.userId = user.id;
  await view.showStaffList(ctx, staffList);
};

export const handleDelete = async (ctx: StaffContext) => {
  await ctx.answerCbQuery();
  await service.removeStaffMember(parseInt(ctx.match[1]));
  await view.showSuccess(ctx, StaffMessages.delSuccess);
  await ctx.scene.reenter();
};

export const handleAdd = async (ctx: StaffContext) => {
  if (!ctx.message || !("text" in ctx.message) || !ctx.message.text) return;
  const name = ctx.message.text.trim();
  if (ctx.scene.session.userId) {
    await service.addStaffMember(ctx.scene.session.userId, name);
  }
  await view.showSuccess(ctx, StaffMessages.addSuccess);
  await ctx.scene.reenter();
};
