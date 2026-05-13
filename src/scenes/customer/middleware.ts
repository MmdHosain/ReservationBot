// src/scenes/customer/middleware.ts
import { Markup } from "telegraf";
import type { CustomerContext } from "./types.ts";
import { MESSAGES } from "../../messages.ts";
import { getServicesByOwnerTelegramId, getServiceById } from "../../db/service.repository.ts";
import { createAppointment, getAppointmentsByDate } from "../../db/appointment.repository.ts";
import { getOrCreateUser, getUserByTelegramId } from "../../db/user.repository.ts";
import { getStaffByUserId } from "../../db/staff.repository.ts";
import { formatFriendlyDate } from "../../utils/date.ts";
import dayjs from "dayjs";

export async function enterCustomerFlow(ctx: CustomerContext) {
  const state = ctx.scene.state as any;
  const ownerTelegramId = state.ownerTelegramId;
  
  ctx.scene.session.booking = {
    ownerTelegramId,
  };

  const services = await getServicesByOwnerTelegramId(ownerTelegramId);
  if (!services || services.length === 0) {
    return ctx.reply(MESSAGES.customerNoServices);
  }

  const buttons = services.map((s: any) =>[Markup.button.callback(s.name, `service_${s.id}`)]);
  
  await ctx.reply(MESSAGES.customerWelcome, Markup.inlineKeyboard(buttons));
}

export async function handleServiceSelection(ctx: CustomerContext, serviceId: number) {
  ctx.scene.session.booking.serviceId = serviceId;
  const service = await getServiceById(serviceId);
  if (!service) return;

  ctx.scene.session.booking.serviceName = service.name;
  ctx.scene.session.booking.duration = service.duration;
  
  const ownerId = ctx.scene.session.booking.ownerTelegramId!;
  const owner = await getUserByTelegramId(ownerId);
  const staffList = await getStaffByUserId(owner.id);

  if (staffList.length > 0) {
    const buttons = staffList.map((s: any) =>[Markup.button.callback(s.name, `staff_${s.id}`)]);
    await ctx.editMessageText("👥 لطفا پرسنل مورد نظر را انتخاب کنید:", Markup.inlineKeyboard(buttons));
  } else {
    await renderDateSelection(ctx);
  }
}

export async function handleStaffSelection(ctx: CustomerContext, staffId: number) {
  ctx.scene.session.booking.staffId = staffId;
  await renderDateSelection(ctx);
}

export async function renderDateSelection(ctx: CustomerContext) {
  const serviceId = ctx.scene.session.booking.serviceId;
  const service = await getServiceById(serviceId!);
  if (!service) return;

  const availableDays: string[] = JSON.parse(service.days);
  const customer = await getOrCreateUser(ctx.from!.id);
  const calendar = customer.calendar_type || 'shamsi';
  
  const dayNameMap =[
    MESSAGES.days.sunday,
    MESSAGES.days.monday,
    MESSAGES.days.tuesday,
    MESSAGES.days.wednesday,
    MESSAGES.days.thursday,
    MESSAGES.days.friday,
    MESSAGES.days.saturday,
  ];

  const buttons =[];
  let currentDate = dayjs();
  
  for (let i = 0; i < 7; i++) {
    const dayIndex = currentDate.day();
    const persianDay = dayNameMap[dayIndex];
    if (availableDays.includes(persianDay)) {
      const dateStr = currentDate.format("YYYY-MM-DD");
      const friendlyDate = formatFriendlyDate(dateStr, calendar);
      buttons.push([Markup.button.callback(`${persianDay} (${friendlyDate})`, `date_${dateStr}`)]);
    }
    currentDate = currentDate.add(1, 'day');
  }

  if (buttons.length === 0) {
    return ctx.editMessageText(MESSAGES.customerNoAvailableDays);
  }

  await ctx.editMessageText(MESSAGES.customerSelectDay, Markup.inlineKeyboard(buttons));
}

export async function handleDateSelection(ctx: CustomerContext, dateStr: string) {
  ctx.scene.session.booking.date = dateStr;
  
  const duration = ctx.scene.session.booking.duration || 30;
  
  const ownerId = ctx.scene.session.booking.ownerTelegramId!;
  const owner = await getUserByTelegramId(ownerId);
  const workStart = owner.work_start_time || '09:00';
  const workEnd = owner.work_end_time || '18:00';
  const breakStart = owner.break_start_time;
  const breakEnd = owner.break_end_time;

  let start = dayjs(`${dateStr}T${workStart}`);
  const end = dayjs(`${dateStr}T${workEnd}`);
  
  const appointments = await getAppointmentsByDate(owner.id, dateStr, ctx.scene.session.booking.staffId);

  const buttons =[];
  let row =[];
  
  while (start.add(duration, 'minute').isBefore(end) || start.add(duration, 'minute').isSame(end)) {
     const slotStart = start;
     const slotEnd = start.add(duration, 'minute');
     let isBooked = false;
     
     for (const appt of appointments) {
        const apptStart = dayjs(`${dateStr}T${appt.appointment_time}`);
        const apptEnd = apptStart.add(appt.duration, 'minute');
        
        if (slotStart.isBefore(apptEnd) && slotEnd.isAfter(apptStart)) {
           isBooked = true;
           break;
        }
     }

     if (breakStart && breakEnd && !isBooked) {
        const bStart = dayjs(`${dateStr}T${breakStart}`);
        const bEnd = dayjs(`${dateStr}T${breakEnd}`);
        if (slotStart.isBefore(bEnd) && slotEnd.isAfter(bStart)) {
           isBooked = true;
        }
     }

     if (slotStart.isBefore(dayjs())) {
        isBooked = true;
     }

     if (!isBooked) {
        const timeStr = slotStart.format("HH:mm");
        row.push(Markup.button.callback(timeStr, `time_${timeStr}`));
        if (row.length === 3) {
          buttons.push(row);
          row =[];
        }
     }
     start = start.add(duration, 'minute');
  }
  
  if (row.length > 0) buttons.push(row);

  if (buttons.length === 0) {
      await ctx.editMessageText("متأسفانه وقت خالی در این روز وجود ندارد.", Markup.inlineKeyboard([
[Markup.button.callback("بازگشت", "back_to_customer_dashboard")]
      ]));
      return;
  }

  await ctx.editMessageText(MESSAGES.customerSelectTime, Markup.inlineKeyboard(buttons));
}

export async function handleTimeSelection(ctx: CustomerContext, timeStr: string) {
  ctx.scene.session.booking.time = timeStr;
  
  const { serviceName, date } = ctx.scene.session.booking;
  const customer = await getOrCreateUser(ctx.from!.id);
  const calendar = customer.calendar_type || 'shamsi';
  
  const friendlyDate = formatFriendlyDate(date!, calendar);
  const msg = MESSAGES.customerConfirmBooking(serviceName!, friendlyDate, timeStr);
  
  await ctx.editMessageText(msg, Markup.inlineKeyboard([
[Markup.button.callback(MESSAGES.confirmBtn, "confirm_booking")]
  ]));
}

export async function confirmBooking(ctx: CustomerContext) {
  const booking = ctx.scene.session.booking;
  const customerTelegramId = ctx.from?.id;
  const customerName = ctx.from?.first_name || MESSAGES.unknownUser;
  
  if (!customerTelegramId || !booking.serviceId || !booking.date || !booking.time) {
    return ctx.editMessageText(MESSAGES.customerBookingError);
  }

  try {
    const customer = await getOrCreateUser(customerTelegramId);
    const calendar = customer.calendar_type || 'shamsi';
    
    const owner = await getUserByTelegramId(booking.ownerTelegramId!);
    const depositAmount = owner.deposit_amount || 0;

    if (depositAmount > 0) {
        const appt = await createAppointment(
            booking.serviceId,
            customerTelegramId,
            customerName,
            booking.date,
            booking.time,
            booking.staffId,
            'pending_payment'
        );
        
        const paymentLink = `https://zarinpal.com/pg/StartPay/FAKE_PAYMENT_${appt.id}`;
        
        await ctx.editMessageText(
            `شما در حال رزرو هستید.\nبرای قطعی شدن نوبت، لطفا مبلغ ${depositAmount} تومان را به عنوان بیعانه پرداخت کنید. پس از پرداخت، روی تأیید پرداخت کلیک کنید.`,
            Markup.inlineKeyboard([
[Markup.button.url("💳 پرداخت اینترنتی", paymentLink)],
[Markup.button.callback("✅ تأیید پرداخت (تستی)", `verify_pay_${appt.id}`)],
[Markup.button.callback(MESSAGES.backToCustomerDashboardBtn, "back_to_customer_dashboard")]
            ])
        );
        return;
    }

    await createAppointment(
      booking.serviceId,
      customerTelegramId,
      customerName,
      booking.date,
      booking.time,
      booking.staffId,
      'confirmed'
    );

    const friendlyDate = formatFriendlyDate(booking.date!, calendar);
    await ctx.editMessageText(
      MESSAGES.customerBookingSuccess(booking.serviceName!, friendlyDate, booking.time),
      Markup.inlineKeyboard([
[Markup.button.callback(MESSAGES.backToCustomerDashboardBtn, "back_to_customer_dashboard")]
      ])
    );

    const ownerId = booking.ownerTelegramId;
    if (ownerId) {
      await ctx.telegram.sendMessage(
        ownerId,
        MESSAGES.ownerNewBookingNotification(customerName, booking.serviceName!, friendlyDate, booking.time)
      ).catch(() => {});
    }
    
    await ctx.scene.leave();
  } catch (err) {
    console.error(err);
    await ctx.editMessageText(MESSAGES.customerBookingError);
  }
}
