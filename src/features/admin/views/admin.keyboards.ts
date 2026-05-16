// src/features/admin/views/admin.keyboards.ts
import { Markup } from "telegraf";
import { AdminMessages } from "./admin.messages.ts";

export const buildAdminDashboardKeyboard = () => Markup.inlineKeyboard([
  [Markup.button.callback(AdminMessages.refreshBtn, "admin_refresh")],
  [Markup.button.callback(AdminMessages.exitBtn, "admin_exit")]
]);
