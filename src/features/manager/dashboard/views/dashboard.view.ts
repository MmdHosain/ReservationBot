// src/features/manager/dashboard/views/dashboard.view.ts
import { DashboardMessages } from "./dashboard.messages.ts";
import { buildMainKeyboard, buildBackKeyboard, buildServicesKeyboard } from "./dashboard.keyboards.ts";

export const showDashboard = async (ctx: any, salonName: string, botUsername: string, userId: number) => {
  const ownerLink = `https://ble.ir/${botUsername}?start=${userId}`;
  const message = DashboardMessages.welcome(salonName) + DashboardMessages.ownerLink(ownerLink);
  const keyboard = buildMainKeyboard();

  if (ctx.callbackQuery) {
    await ctx.editMessageText(message, { parse_mode: "Markdown", ...keyboard }).catch(() => {});
  } else {
    await ctx.reply(message, { parse_mode: "Markdown", ...keyboard });
  }
};

export const showGuide = async (ctx: any) => {
  await ctx.editMessageText(DashboardMessages.managerGuide, { parse_mode: "Markdown", ...buildBackKeyboard() }).catch(() => {});
};

export const showAppointments = async (ctx: any, count: number, revenue: number, list: string) => {
  const listText = count === 0 ? DashboardMessages.noAppointments : list;
  const msg = DashboardMessages.appointments(count, revenue, listText);
  await ctx.editMessageText(msg, { parse_mode: "Markdown", ...buildBackKeyboard() }).catch(() => {});
};

export const showServices = async (ctx: any, services: any[]) => {
  const kb = buildServicesKeyboard(services);
  await ctx.editMessageText(DashboardMessages.servicesTitle, { parse_mode: "Markdown", ...kb }).catch(() => {});
};

export const showRestartResult = async (ctx: any, success: boolean, message: string) => {
  await ctx.reply(success ? `✅ ${message}` : `❌ ${message}`);
};

export const showExit = async (ctx: any) => {
  await ctx.editMessageText(DashboardMessages.panelExited).catch(() => {});
};
