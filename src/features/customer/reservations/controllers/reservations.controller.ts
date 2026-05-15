// src/features/customer/reservations/controllers/reservations.controller.ts
import type { MyContext } from "../../../../core/types.ts";
import * as service from "../services/reservations.service.ts";
import * as view from "../views/reservations.view.ts";

export const handleEnter = async (ctx: MyContext) => {
  if (ctx.callbackQuery) await ctx.answerCbQuery().catch(() => {});
  const telegramId = ctx.from!.id;
  const { appointments, calendar } = await service.getCustomerAppointments(
    telegramId
  );
  await view.showReservations(ctx, appointments, calendar);
};

export const handleCancel = async (ctx: MyContext) => {
  if (!ctx.match) return;
  const apptId = parseInt(ctx.match[1]);
  await service.cancelCustomerAppointment(apptId, ctx.from!.id);
  await view.showCancelSuccess(ctx);
};

export const handleBack = async (ctx: MyContext) => {
  await ctx.scene.enter("CUSTOMER_DASHBOARD_SCENE");
};
