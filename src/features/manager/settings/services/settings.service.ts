// src/features/manager/settings/services/settings.service.ts
import { updateWorkHours, updateBreakHours, removeBreakHours, updateDeposit } from "../../../../db/user.repository.ts";

export const setWorkHours = async (telegramId: number, start: string, end: string) => {
  await updateWorkHours(telegramId, start, end);
};

export const setBreakHours = async (telegramId: number, start: string, end: string) => {
  await updateBreakHours(telegramId, start, end);
};

export const removeBreak = async (telegramId: number) => {
  await removeBreakHours(telegramId);
};

export const setDeposit = async (telegramId: number, amount: number) => {
  await updateDeposit(telegramId, amount);
};
