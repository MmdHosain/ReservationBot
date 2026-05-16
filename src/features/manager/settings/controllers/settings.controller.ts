// src/features/manager/settings/controllers/settings.controller.ts
import * as service from "../services/settings.service.ts";
import * as view from "../views/settings.view.ts";
import { SettingsMessages } from "../views/settings.messages.ts";
import type { SettingsContext } from "../types/settings.types.ts";

export const handleEnter = async (ctx: SettingsContext) => {
  await view.showPrompt(ctx);
};

export const handleInput = async (ctx: SettingsContext) => {
  if (!ctx.message || !("text" in ctx.message) || !ctx.message.text) return;
  const text = ctx.message.text.trim();
  if (text.startsWith("break ")) {
    const parts = text.replace("break ", "").split("-");
    if (parts.length === 2) {
      await service.setBreakHours(ctx.from!.id, parts[0], parts[1]);
      await view.showSuccess(ctx, SettingsMessages.breakSet);
    }
  } else if (text === "nobreak") {
    await service.removeBreak(ctx.from!.id);
    await view.showSuccess(ctx, SettingsMessages.breakRemoved);
  } else if (text.startsWith("deposit ")) {
    const amount = parseInt(text.replace("deposit ", "").trim());
    if (!isNaN(amount)) {
      await service.setDeposit(ctx.from!.id, amount);
      await view.showSuccess(ctx, SettingsMessages.depositSet(amount));
    }
  } else if (text.includes("-")) {
    const parts = text.split("-");
    if (parts.length === 2) {
      await service.setWorkHours(ctx.from!.id, parts[0], parts[1]);
      await view.showSuccess(ctx, SettingsMessages.workHoursSet);
    }
  } else {
    await view.showError(ctx);
  }
};
