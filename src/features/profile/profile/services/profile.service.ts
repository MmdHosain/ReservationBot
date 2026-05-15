// src/features/profile/profile/services/profile.service.ts
import { getUserByTelegramId, updateCalendarType } from "../../../../db/user.repository.ts";

export const getUserPreferences = async (telegramId: number) => {
  const user = await getUserByTelegramId(telegramId);
  return { calendarType: user?.calendar_type || 'shamsi' };
};

export const setCalendarType = async (telegramId: number, type: 'shamsi' | 'miladi') => {
  await updateCalendarType(telegramId, type);
};
