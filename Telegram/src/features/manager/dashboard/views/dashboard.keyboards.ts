// src/features/manager/dashboard/views/dashboard.keyboards.ts
import { Markup } from "telegraf";
import { getDashboardMessages } from "./dashboard.messages.ts";

export const buildMainKeyboard = (category: string = 'beauty') => {
  const m = getDashboardMessages(category);
  return Markup.inlineKeyboard([
    [Markup.button.callback(m.shareLinkBtn, "dash_share_link")],
    [Markup.button.callback(m.appointmentsBtn, "dash_appointments")],
    [Markup.button.callback(m.servicesBtn, "dash_services")],
    [Markup.button.callback(m.inboxBtn, "dash_inbox")],
    [Markup.button.callback(m.toolsMenuBtn, "dash_tools_menu")],
    [Markup.button.callback(m.exitBtn, "dash_exit")],
  ]);
};

export const buildToolsKeyboard = (category: string = 'beauty') => {
  const m = getDashboardMessages(category);
  return Markup.inlineKeyboard([
    [Markup.button.callback(m.categoriesBtn, "dash_categories")],
    [Markup.button.callback(m.billingBtn, "dash_billing")],
    [Markup.button.callback(m.staffBtn, "dash_staff")],
    [Markup.button.callback(m.settingsBtn, "dash_settings")],
    [Markup.button.callback(m.guideBtn, "dash_guide")],
    [Markup.button.callback(m.restartBtn, "dash_restart")],
    [Markup.button.callback(m.backBtn, "dash_main")],
  ]);
};

export const buildBackKeyboard = (category: string = 'beauty') => {
  const m = getDashboardMessages(category);
  return Markup.inlineKeyboard([
    [Markup.button.callback(m.backBtn, "dash_main")],
  ]);
};

export const buildBackToToolsKeyboard = (category: string = 'beauty') => {
  const m = getDashboardMessages(category);
  return Markup.inlineKeyboard([
    [Markup.button.callback(m.backBtn, "dash_tools_menu")],
  ]);
};

export const buildServicesKeyboard = (services: any[], category: string = 'beauty') => {
  const m = getDashboardMessages(category);
  const buttons = services.map((s) => [
    Markup.button.callback(m.serviceListItemBtn(s.name, s.duration), `edit_svc_${s.id}`),
  ]);
  buttons.push([Markup.button.callback(m.addServiceBtn, "add_svc")]);
  buttons.push([Markup.button.callback(m.backBtn, "dash_main")]);
  return Markup.inlineKeyboard(buttons);
};
