// src/scenes/customer/index.ts
import { Scenes, Markup } from "telegraf";
import type { CustomerContext } from "./types.ts";
import * as middleware from "./middleware.ts";
import { pool } from "../../db/pool.ts";
import { MESSAGES } from "../../messages.ts";

export const CUSTOMER_SCENE_ID = "customer_booking";

const customer = new Scenes.BaseScene<CustomerContext>(CUSTOMER_SCENE_ID);

customer.enter(middleware.enterCustomerFlow);

customer.action(/service_(.+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const serviceId = parseInt(ctx.match[1]);
  await middleware.handleServiceSelection(ctx, serviceId);
});

customer.action(/staff_(\d+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const staffId = parseInt(ctx.match[1]);
  await middleware.handleStaffSelection(ctx, staffId);
});

customer.action(/date_(.+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const dateStr = ctx.match[1];
  await middleware.handleDateSelection(ctx, dateStr);
});

customer.action(/time_(.+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const timeStr = ctx.match[1];
  await middleware.handleTimeSelection(ctx, timeStr);
});

customer.action("confirm_booking", async (ctx) => {
  await ctx.answerCbQuery();
  await middleware.confirmBooking(ctx);
});

customer.action(/verify_pay_(\d+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const apptId = parseInt(ctx.match[1]);
  await pool.query(`UPDATE appointments SET status = 'confirmed' WHERE id = $1`, [apptId]);
  
  await ctx.editMessageText(
    "✅ پرداخت شما تأیید و نوبت قطعی شد!",
    Markup.inlineKeyboard([
[Markup.button.callback(MESSAGES.backToCustomerDashboardBtn, "back_to_customer_dashboard")]
    ])
  );
  
  const res = await pool.query(`
    SELECT a.*, s.name as service_name, u.telegram_id as owner_id 
    FROM appointments a 
    JOIN services s ON a.service_id = s.id 
    JOIN users u ON s.user_id = u.id 
    WHERE a.id = $1`, [apptId]);
    
  if (res.rows.length > 0) {
    const appt = res.rows[0];
    await ctx.telegram.sendMessage(
        appt.owner_id,
        MESSAGES.ownerNewBookingNotification(appt.customer_name, appt.service_name, appt.appointment_date, appt.appointment_time)
      ).catch(() => {});
  }
});

export const customerScene = customer as unknown as Scenes.BaseScene<any>;
