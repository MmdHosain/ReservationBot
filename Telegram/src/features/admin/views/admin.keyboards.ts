// src/features/admin/views/admin.keyboards.ts
import { Markup } from "telegraf";
import { AdminMessages } from "./admin.messages.ts";

export const buildAdminDashboardKeyboard = () => Markup.inlineKeyboard([
  [Markup.button.callback(AdminMessages.pendingReceiptsBtn, "admin_pending_receipts")],
  [Markup.button.callback(AdminMessages.refreshBtn, "admin_refresh")],
  [Markup.button.callback(AdminMessages.exitBtn, "admin_exit")]
]);

export const buildReceiptActionKeyboard = (txId: string) => Markup.inlineKeyboard([
  [
    Markup.button.callback(AdminMessages.approveBtn, `approve_tx_${txId}`),
    Markup.button.callback(AdminMessages.rejectBtn, `reject_tx_${txId}`)
  ],
  [Markup.button.callback(AdminMessages.backBtn, "admin_back")]
]);
