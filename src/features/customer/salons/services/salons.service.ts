// src/features/customer/salons/services/salons.service.ts
import {
  getCustomerSalons,
  removeCustomerSalon,
} from "../../../../db/user.repository.ts";
import { pool } from "../../../../db/pool.ts";

export const getSalons = async (telegramId: number) => {
  return await getCustomerSalons(telegramId);
};

export const removeSalon = async (telegramId: number, salonUserId: number) => {
  await removeCustomerSalon(telegramId, salonUserId);
};

export const sendMessageToSalon = async (
  salonUserId: number,
  customerTelegramId: number,
  senderName: string,
  content: string
) => {
  await pool.query(
    `INSERT INTO inbox_messages (salon_user_id, customer_telegram_id, sender_name, content) VALUES ($1, $2, $3, $4)`,
    [salonUserId, customerTelegramId, senderName, content]
  );
};
