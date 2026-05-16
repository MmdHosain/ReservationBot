// src/features/core/start/services/start.service.ts
import {
  getOrCreateUser,
  addCustomerSalon,
  getUserByTelegramId,
} from "../../../db/user.repository.ts";

export const getSalonOwner = async (telegramId: number) => {
  return await getUserByTelegramId(telegramId);
};

export const processStartPayload = async (
  telegramId: number,
  payload: string
) => {
  await getOrCreateUser(telegramId);
  const ownerId = parseInt(payload, 10);
  if (!isNaN(ownerId)) {
    await addCustomerSalon(telegramId, ownerId);
  }
};

export const ensureUserExists = async (telegramId: number) => {
  await getOrCreateUser(telegramId);
};
