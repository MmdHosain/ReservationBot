// src/features/manager/dashboard/views/dashboard.view.ts
import { getDashboardMessages } from "./dashboard.messages.ts";
import { buildMainKeyboard, buildBackKeyboard, buildServicesKeyboard, buildToolsKeyboard, buildBackToToolsKeyboard } from "./dashboard.keyboards.ts";
import type { DashboardContext } from "../types/dashboard.types.ts";
import type { MyContext } from "../../../../core/types.ts";

export const showDashboard = async (ctx: DashboardContext | MyContext, salonName: string) => {
  const cat = ctx.businessCategory || 'beauty';
  const m = getDashboardMessages(cat);
  const message = m.welcome(salonName);
  const keyboard = buildMainKeyboard(cat);

  if (ctx.callbackQuery) {
    await ctx.editMessageText(message, { parse_mode: "Markdown", ...keyboard }).catch(() => {});
  } else {
    await ctx.reply(message, { parse_mode: "Markdown", ...keyboard });
  }
};

export const showToolsMenu = async (ctx: DashboardContext) => {
  const cat = ctx.businessCategory || 'beauty';
  const m = getDashboardMessages(cat);
  const msg = m.toolsMenuTitle;
  const kb = buildToolsKeyboard(cat);
  await ctx.editMessageText(msg, { parse_mode: "Markdown", ...kb }).catch(() => {});
};

export const showGuide = async (ctx: DashboardContext) => {
  const cat = ctx.businessCategory || 'beauty';
  const m = getDashboardMessages(cat);
  await ctx.editMessageText(m.managerGuide, { parse_mode: "Markdown", ...buildBackToToolsKeyboard(cat) }).catch(() => {});
};

export const showAppointments = async (ctx: DashboardContext, count: number, list: string) => {
  const cat = ctx.businessCategory || 'beauty';
  const m = getDashboardMessages(cat);
  const listText = count === 0 ? m.noAppointments : list;
  const msg = m.appointments(count, listText);
  await ctx.editMessageText(msg, { parse_mode: "Markdown", ...buildBackKeyboard(cat) }).catch(() => {});
};

export const showServices = async (ctx: DashboardContext, services: any[]) => {
  const cat = ctx.businessCategory || 'beauty';
  const m = getDashboardMessages(cat);
  const kb = buildServicesKeyboard(services, cat);
  await ctx.editMessageText(m.servicesTitle, { parse_mode: "Markdown", ...kb }).catch(() => {});
};

export const showRestartResult = async (ctx: DashboardContext, success: boolean, message: string) => {
  await ctx.reply(success ? `✅ ${message}` : `❌ ${message}`);
};

export const showExit = async (ctx: DashboardContext) => {
  const cat = ctx.businessCategory || 'beauty';
  const m = getDashboardMessages(cat);
  await ctx.editMessageText(m.panelExited).catch(() => {});
};
