// src/features/profile/account/services/account.service.ts
import { deleteUserByTelegramId } from "../../../../db/user.repository.ts";

export const deleteAccount = async (telegramId: number) => {
  return await deleteUserByTelegramId(telegramId);
};
