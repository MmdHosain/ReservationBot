// src/scenes/dashboard/middleware.ts
import { Markup } from "telegraf";
import type { DashboardContext } from "./types.ts";
import { MESSAGES } from "../../messages.ts";
import { getAppointmentsForOwner } from "../../db/appointment.repository.ts";
import { getServicesByUserId } from "../../db/service.repository.ts";
import { getUserByTelegramId } from "../../db/user.repository.ts";
import { formatFriendlyDate } from "../../utils/date.ts";

export async function enterDashboard(ctx: DashboardContext) {
  ctx.scene.session.lastMenu = "main";
  
  const botUsername = ctx.botInfo?.username || "bot";
  const ownerLink = `https://ble.ir/${botUsername}?start=${ctx.from?.id}`;

  const user = await getUserByTelegramId(ctx.from!.id);
  const salonName = user?.salon_name || "سالن";

  const message = MESSAGES.dashboardWelcome(salonName) + MESSAGES.dashboardOwnerLink(ownerLink);

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback(MESSAGES.dashboardAppointmentsBtn, "dash_appointments")],
    [Markup.button.callback(MESSAGES.dashboardServicesBtn, "dash_services")],
    [Markup.button.callback("👥 مدیریت پرسنل", "dash_staff")],
    [Markup.button.callback("⚙️ تنظیمات کاری", "dash_settings")],
    [Markup.button.callback(MESSAGES.dashboardGuideBtn, "dash_guide")],
    [Markup.button.callback(MESSAGES.dashboardRestartBtn, "dash_restart")],
    [Markup.button.callback(MESSAGES.dashboardExitBtn, "dash_exit")],
  ]);

  if (ctx.callbackQuery) {
    await ctx.editMessageText(message, { parse_mode: "Markdown", ...keyboard }).catch(() => {});
  } else {
    await ctx.reply(message, { parse_mode: "Markdown", ...keyboard });
  }
}

export async function showManagerGuide(ctx: DashboardContext) {
  const kb = Markup.inlineKeyboard([[Markup.button.callback(MESSAGES.dashboardBackBtn, "dash_main")]]);
  await ctx.editMessageText(MESSAGES.managerGuide, { parse_mode: "Markdown", ...kb }).catch(() => {});
}

export async function showAppointments(ctx: DashboardContext) {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  const user = await getUserByTelegramId(telegramId);
  if (!user) return;

  const appointments = await getAppointmentsForOwner(user.id);
  const calendar = user.calendar_type || 'shamsi';
  
  const avgPrice = 250000;
  const appointmentsCount = appointments.length;

  let appointmentsList = "";
  appointments.forEach((a, i) => {
    const timeStr = typeof a.appointment_time === "string" ? a.appointment_time.substring(0, 5) : a.appointment_time;
    const friendlyDate = formatFriendlyDate(a.appointment_date, calendar);
    const staffInfo = a.staff_name ? ` (پرسنل: ${a.staff_name})` : "";
    appointmentsList += `${i + 1}️⃣ ${friendlyDate} ساعت ${timeStr} - ${a.customer_name} (${a.service_name})${staffInfo}\n`;
  });

  if (appointmentsCount === 0) {
    appointmentsList = MESSAGES.noAppointments;
  }

  const revenue = appointmentsCount * avgPrice;
  const msg = MESSAGES.dashboardAppointments(appointmentsCount, revenue, appointmentsList);

  const keyboard = Markup.inlineKeyboard([
[Markup.button.callback(MESSAGES.dashboardBackBtn, "dash_main")],
  ]);
  await ctx.editMessageText(msg, { parse_mode: "Markdown", ...keyboard }).catch(() => {});
}

export async function showServices(ctx: DashboardContext) {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  const user = await getUserByTelegramId(telegramId);
  if (!user) return;

  const services = await getServicesByUserId(user.id);
  
  const buttons = services.map(s =>[Markup.button.callback(MESSAGES.serviceListItemBtn(s.name, s.duration), `edit_svc_${s.id}`)]);
  
  buttons.push([Markup.button.callback(MESSAGES.addServiceBtn, "add_svc")]);
  buttons.push([Markup.button.callback(MESSAGES.dashboardBackBtn, "dash_main")]);

  const msg = MESSAGES.dashboardServicesTitle;
  await ctx.editMessageText(msg, { parse_mode: "Markdown", ...Markup.inlineKeyboard(buttons) }).catch(() => {});
}
