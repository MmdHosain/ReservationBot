// src/features/customer/salons/services/salons.service.ts
import {
  getCustomerSalons,
  removeCustomerSalon,
} from "../../../../db/user.repository.ts";

export const getSalons = async (telegramId: number) => {
  return await getCustomerSalons(telegramId);
};

export const removeSalon = async (telegramId: number, salonUserId: number) => {
  await removeCustomerSalon(telegramId, salonUserId);
};
