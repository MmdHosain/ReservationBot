// src/features/customer/booking/controllers/booking.controller.ts
import * as service from "../services/booking.service.ts";
import * as view from "../views/booking.view.ts";
import { getAvailableDaysV2, getAvailableSlotsV2 } from "../../../../core/utils/booking_v2.ts";
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
    const populatedCatIds = new Set(services.filter(svc => svc.category).map(svc => svc.category!.id));
    const populatedCategories = allCategories.filter(cat => populatedCatIds.has(cat.id));
    const uncategorizedServices = services.filter(svc => !svc.category);

    await view.showRootServices(ctx, populatedCategories, uncategorizedServices, s.category);
  } else {
    const catId = s.viewingCategoryId as string;
    const cat = allCategories.find(c => c.id === catId);
    const catServices = services.filter(svc => svc.category?.id === catId);
    await view.showCategoryServices(ctx, cat?.name || "دسته‌بندی", catServices, s.category);
  }
};

export const handleCategory = async (ctx: BookingContext) => {
  await ctx.answerCbQuery().catch(() => {});
  ctx.scene.session.viewingCategoryId = ctx.match[1];
  await showCategoriesOrServices(ctx);
};

export const handleBackToCategories = async (ctx: BookingContext) => {
  await ctx.answerCbQuery().catch(() => {});
  ctx.scene.session.viewingCategoryId = 'root';
  await showCategoriesOrServices(ctx);
};

export const handleService = async (ctx: BookingContext) => {
  await ctx.answerCbQuery().catch(() => {});
  const svcId = ctx.match[1];
  const svc = await service.getServiceById(svcId);
  if (!svc) return;
  ctx.scene.session.serviceId = svc.id;
  ctx.scene.session.serviceName = svc.name;
  ctx.scene.session.duration = svc.duration_minutes;
  await showDates(ctx);
};

export const handlePage = async (ctx: BookingContext) => {
  await ctx.answerCbQuery().catch(() => {});
  ctx.scene.session.page = parseInt(ctx.match[1]);
  await showDates(ctx);
};

const showDates = async (ctx: BookingContext) => {
  const s = ctx.scene.session;
  const page = s.page || 0;
  
  const schedules = await service.getOrgSchedules(s.salonId);
  const rules = schedules.length > 0 ? await service.getOrgScheduleRules(schedules[0].id) : [];
  const exceptions = await service.getOrgScheduleExceptions(s.salonId);
  
  const days = getAvailableDaysV2(rules, exceptions, page, s.isManager);
  await view.showDates(ctx, days, page, s.category);
};

export const handleDate = async (ctx: BookingContext) => {
  await ctx.answerCbQuery().catch(() => {});
  ctx.scene.session.date = ctx.match[1];
  
  const s = ctx.scene.session;
  
  const schedules = await service.getOrgSchedules(s.salonId);
  const rules = schedules.length > 0 ? await service.getOrgScheduleRules(schedules[0].id) : [];
  const exceptions = await service.getOrgScheduleExceptions(s.salonId);
  const existingEvents = await service.getEventsForDate(s.salonId, s.date!);
  
  const slots = getAvailableSlotsV2(s.date!, rules, exceptions, s.duration!, existingEvents, s.isManager);
  
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
      await service.createAppointmentV2(s.salonId, s.serviceId!, s.targetCustomerId!, s.targetCustomerName!, s.date!, s.time!);
      await ctx.answerCbQuery().catch(() => {});
      await view.showSuccess(ctx, true, s.category);
      await ctx.telegram.sendMessage(
        s.targetCustomerId!,
        getBookingMessages(s.category).managerBookedForYouNotification(s.salonName, s.serviceName!, s.date!, s.time!)
      ).catch(() => {});
      await ctx.scene.enter("MANAGER_INBOX_SCENE");
    } else {
      await service.createAppointmentV2(s.salonId, s.serviceId!, ctx.from!.id, ctx.from!.first_name || "مشتری", s.date!, s.time!);
      await ctx.answerCbQuery().catch(() => {});
      await view.showSuccess(ctx, false, s.category);
      
      const admins = await service.getOrgAdmins(s.salonId);
      for (const adminId of admins) {
        if (adminId) {
          await ctx.telegram.sendMessage(
            adminId, 
            coreMsg.ownerNewBookingNotification(ctx.from!.first_name || "مشتری", s.serviceName!, s.date!, s.time!)
          ).catch(() => {});
        }
      }
      
      await ctx.scene.enter("CUSTOMER_DASHBOARD_SCENE");
    }
  } catch (err: any) {
    await ctx.answerCbQuery(coreMsg.customerBookingError, { show_alert: true }).catch(() => {});
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
