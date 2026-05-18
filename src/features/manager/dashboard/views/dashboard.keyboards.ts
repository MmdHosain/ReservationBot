// src/features/manager/dashboard/views/dashboard.keyboards.ts
import { Markup } from "telegraf";
import { DashboardMessages } from "./dashboard.messages.ts";

export const buildMainKeyboard = () => Markup.inlineKeyboard([
  [Markup.button.callback(DashboardMessages.appointmentsBtn, "dash_appointments")],
  [Markup.button.callback(DashboardMessages.servicesBtn, "dash_services")],
  [Markup.button.callback(DashboardMessages.inboxBtn, "dash_inbox")],
  [Markup.button.callback(DashboardMessages.toolsMenuBtn, "dash_tools_menu")],
  [Markup.button.callback(DashboardMessages.exitBtn, "dash_exit")],
]);

export const buildToolsKeyboard = () => Markup.inlineKeyboard([
  [Markup.button.callback(DashboardMessages.categoriesBtn, "dash_categories")],
  [Markup.button.callback(DashboardMessages.billingBtn, "dash_billing")],
  [Markup.button.callback(DashboardMessages.staffBtn, "dash_staff")],
  [Markup.button.callback(DashboardMessages.settingsBtn, "dash_settings")],
  [Markup.button.callback(DashboardMessages.guideBtn, "dash_guide")],
  [Markup.button.callback(DashboardMessages.restartBtn, "dash_restart")],
  [Markup.button.callback(DashboardMessages.backBtn, "dash_main")],
]);

export const buildBackKeyboard = () => Markup.inlineKeyboard([
  [Markup.button.callback(DashboardMessages.backBtn, "dash_main")],
]);

export const buildBackToToolsKeyboard = () => Markup.inlineKeyboard([
  [Markup.button.callback(DashboardMessages.backBtn, "dash_tools_menu")],
]);

export const buildServicesKeyboard = (services: any[]) => {
  const buttons = services.map((s) => [
    Markup.button.callback(DashboardMessages.serviceListItemBtn(s.name, s.duration), `edit_svc_${s.id}`),
  ]);
  buttons.push([Markup.button.callback(DashboardMessages.addServiceBtn, "add_svc")]);
  buttons.push([Markup.button.callback(DashboardMessages.backBtn, "dash_main")]);
  return Markup.inlineKeyboard(buttons);
};
