// src/features/customer/booking/controllers/booking.controller.ts
import * as service from "../services/booking.service.ts";
import * as view from "../views/booking.view.ts";
import { getAvailableDays, getAvailableSlots } from "../../../../core/utils/booking.ts";
import type { BookingContext } from "../types/booking.types.ts";
import { getCoreMessages } from "../../../../core/messages.ts";
import { getBookingMessages } from "../views/booking.messages.ts";

export const handleEnter = async (ctx: BookingContext) => {
  const state = ctx.scene.state as any;
  ctx.scene.session.salonId = state.salonId;
  ctx.scene.session.salonName = state.salonName;
  ctx.scene.session.category = state.category || 'generic';
  ctx.scene.session.isManager = state.isManager || false;
  ctx.scene.session.targetCustomerId = state.targetCustomerId;
  ctx.scene.session.targetCustomerName = state.targetCustomerName;
  ctx.scene.session.page = 0;
  ctx.scene.session.viewingCategoryId = 'root';
  
  const services = await service.getSalonServices(state.salonId);
  if (services.length === 0) {
    await view.showNoServices(ctx, ctx.scene.session.category);
    if (ctx.scene.session.isManager) return ctx.scene.enter("MANAGER_INBOX_SCENE");
    return ctx.scene.enter("CUSTOMER_SALON_DASHBOARD_SCENE", state);
  }
  
  await showCategoriesOrServices(ctx);
};

export const showCategoriesOrServices = async (ctx: BookingContext) => {
  const s = ctx.scene.session;
  const services = await service.getSalonServices(s.salonId);
  const allCategories = await service.getSalonCategories(s.salonId);

  if (s.viewingCategoryId === 'root') {
    const populatedCatIds = new Set(services.filter(svc => svc.category_id).map(svc => svc.category_id));
    const populatedCategories = allCategories.filter(cat => populatedCatIds.has(cat.id));
    const uncategorizedServices = services.filter(svc => !svc.category_id);

    await view.showRootServices(ctx, populatedCategories, uncategorizedServices, s.category);
  } else {
    const catId = s.viewingCategoryId as number;
    const cat = allCategories.find(c => c.id === catId);
    const catServices = services.filter(svc => svc.category_id === catId);
    await view.showCategoryServices(ctx, cat?.name || "دسته‌بندی", catServices, s.category);
  }
};

export const handleCategory = async (ctx: BookingContext) => {
  await ctx.answerCbQuery().catch(() => {});
  ctx.scene.session.viewingCategoryId = parseInt(ctx.match[1]);
  await showCategoriesOrServices(ctx);
};

export const handleBackToCategories = async (ctx: BookingContext) => {
  await ctx.answerCbQuery().catch(() => {});
  ctx.scene.session.viewingCategoryId = 'root';
  await showCategoriesOrServices(ctx);
};

export const handleService = async (ctx: BookingContext) => {
  await ctx.answerCbQuery().catch(() => {});
  const svcId = parseInt(ctx.match[1]);
  const svc = await service.getServiceById(svcId);
  ctx.scene.session.serviceId = svc.id;
  ctx.scene.session.serviceName = svc.name;
  ctx.scene.session.duration = svc.duration;
  await showDates(ctx);
};

export const handlePage = async (ctx: BookingContext) => {
  await ctx.answerCbQuery().catch(() => {});
  ctx.scene.session.page = parseInt(ctx.match[1]);
  await showDates(ctx);
};

const showDates = async (ctx: BookingContext) => {
  const s = ctx.scene.session;
  const svc = await service.getServiceById(s.serviceId!);
  const page = s.page || 0;
  const days = getAvailableDays(svc.days, page, s.isManager);
  await view.showDates(ctx, days, page, s.category);
};

export const handleDate = async (ctx: BookingContext) => {
  await ctx.answerCbQuery().catch(() => {});
  ctx.scene.session.date = ctx.match[1];
  
  const s = ctx.scene.session;
  const salon = await service.getSalonById(s.salonId);
  const appts = await service.getAppointmentsByDate(salon.id, s.date!);
  
  const slots = getAvailableSlots(
    salon.work_start_time, salon.work_end_time,
    salon.break_start_time, salon.break_end_time,
    s.duration!, appts, s.isManager
  );
  
  if (slots.length === 0) {
    await view.showNoSlots(ctx, s.category);
    return showDates(ctx);
  }
  await view.showTimes(ctx, slots, s.category);
};

export const handleTime = async (ctx: BookingContext) => {
  await ctx.answerCbQuery().catch(() => {});
  ctx.scene.session.time = ctx.match[1];
  const s = ctx.scene.session;
  await view.showConfirm(ctx, s.serviceName!, s.date!, s.time!, s.isManager, s.targetCustomerName, s.category);
};

export const handleConfirm = async (ctx: BookingContext) => {
  const s = ctx.scene.session;
  const coreMsg = getCoreMessages(s.category);
  
  try {
    if (s.isManager) {
      await service.createAppointment(s.serviceId!, s.targetCustomerId!, s.targetCustomerName!, s.date!, s.time!);
      await ctx.answerCbQuery().catch(() => {});
      await view.showSuccess(ctx, true, s.category);
      await ctx.telegram.sendMessage(
        s.targetCustomerId!,
        getBookingMessages(s.category).managerBookedForYouNotification(s.salonName, s.serviceName!, s.date!, s.time!)
      ).catch(() => {});
      await ctx.scene.enter("MANAGER_INBOX_SCENE");
    } else {
      await service.createAppointment(s.serviceId!, ctx.from!.id, ctx.from!.first_name || "مشتری", s.date!, s.time!);
      await ctx.answerCbQuery().catch(() => {});
      await view.showSuccess(ctx, false, s.category);
      const salon = await service.getSalonById(s.salonId);
      await ctx.telegram.sendMessage(
        salon.telegram_id, 
        coreMsg.ownerNewBookingNotification(ctx.from!.first_name || "مشتری", s.serviceName!, s.date!, s.time!)
      ).catch(() => {});
      await ctx.scene.enter("CUSTOMER_DASHBOARD_SCENE");
    }
  } catch (err: any) {
    if (err.message === "TIME_SLOT_TAKEN") {
      await ctx.answerCbQuery(coreMsg.notAvailable, { show_alert: true }).catch(() => {});
      await showDates(ctx);
    } else {
      await ctx.answerCbQuery(coreMsg.customerBookingError, { show_alert: true }).catch(() => {});
    }
  }
};

export const handleCancel = async (ctx: BookingContext) => {
  await ctx.answerCbQuery().catch(() => {});
  if (ctx.scene.session.isManager) {
    await ctx.scene.enter("MANAGER_INBOX_SCENE");
  } else {
    await ctx.scene.enter("CUSTOMER_SALON_DASHBOARD_SCENE", { salonId: ctx.scene.session.salonId, salonName: ctx.scene.session.salonName, category: ctx.scene.session.category });
  }
};
