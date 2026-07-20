// src/features/manager/settings/services/settings.service.ts
import { updateWorkHours, updateBreakHours, removeBreakHours, updateDeposit } from "../../../../db/user.repository.ts";
import { syncV2State } from "../../../../core/utils/v2_sync.ts";

export const setWorkHours = async (telegramId: number, start: string, end: string) => {
  await updateWorkHours(telegramId, start, end);
  await syncV2State(telegramId);
};

export const setBreakHours = async (telegramId: number, start: string, end: string) => {
  await updateBreakHours(telegramId, start, end);
  await syncV2State(telegramId);
};

export const removeBreak = async (telegramId: number) => {
  await removeBreakHours(telegramId);
  await syncV2State(telegramId);
};

export const setDeposit = async (telegramId: number, amount: number) => {
  await updateDeposit(telegramId, amount);
};
