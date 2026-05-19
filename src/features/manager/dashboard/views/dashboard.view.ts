// src/features/manager/dashboard/views/dashboard.view.ts
import { DashboardMessages } from "./dashboard.messages.ts";
import { buildMainKeyboard, buildBackKeyboard, buildServicesKeyboard, buildToolsKeyboard, buildBackToToolsKeyboard } from "./dashboard.keyboards.ts";
import type { DashboardContext } from "../types/dashboard.types.ts";
import type { MyContext } from "../../../../core/types.ts";

export const showDashboard = async (ctx: DashboardContext | MyContext, salonName: string) => {
  const message = DashboardMessages.welcome(salonName);
  const keyboard = buildMainKeyboard();

  if (ctx.callbackQuery) {
    await ctx.editMessageText(message, { parse_mode: "Markdown", ...keyboard }).catch(() => {});
  } else {
    await ctx.reply(message, { parse_mode: "Markdown", ...keyboard });
  }
};

export const showToolsMenu = async (ctx: DashboardContext) => {
  const msg = DashboardMessages.toolsMenuTitle;
  const kb = buildToolsKeyboard();
  await ctx.editMessageText(msg, { parse_mode: "Markdown", ...kb }).catch(() => {});
};

export const showGuide = async (ctx: DashboardContext) => {
  await ctx.editMessageText(DashboardMessages.managerGuide, { parse_mode: "Markdown", ...buildBackToToolsKeyboard() }).catch(() => {});
};

export const showAppointments = async (ctx: DashboardContext, count: number, list: string) => {
  const listText = count === 0 ? DashboardMessages.noAppointments : list;
  const msg = DashboardMessages.appointments(count, listText);
  await ctx.editMessageText(msg, { parse_mode: "Markdown", ...buildBackKeyboard() }).catch(() => {});
};

export const showServices = async (ctx: DashboardContext, services: any[]) => {
  const kb = buildServicesKeyboard(services);
  await ctx.editMessageText(DashboardMessages.servicesTitle, { parse_mode: "Markdown", ...kb }).catch(() => {});
};

export const showRestartResult = async (ctx: DashboardContext, success: boolean, message: string) => {
  await ctx.reply(success ? `✅ ${message}` : `❌ ${message}`);
};

export const showExit = async (ctx: DashboardContext) => {
  await ctx.editMessageText(DashboardMessages.panelExited).catch(() => {});
};
