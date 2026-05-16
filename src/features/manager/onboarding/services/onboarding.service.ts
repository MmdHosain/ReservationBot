// src/features/manager/onboarding/services/onboarding.service.ts
import { getOrCreateUser, markUserOnboarded, updateSalonName, startFreeTrial } from "../../../../db/user.repository.ts";
import { saveService } from "../../../../db/service.repository.ts";

export const checkUserStatus = async (telegramId: number) => {
  const user = await getOrCreateUser(telegramId);
  return { isNewUser: !user.onboarded_at, hasSalonName: !!user.salon_name, userId: user.id };
};

export const createService = async (userId: number, name: string, duration: number, days: string[]) => {
  await saveService(userId, { name, duration, days: JSON.stringify(days) });
};

export const registerSalon = async (userId: number, salonName: string) => {
  await updateSalonName(userId, salonName);
  await markUserOnboarded(userId);
  await startFreeTrial(userId, 14); // 14 days free trial
};
