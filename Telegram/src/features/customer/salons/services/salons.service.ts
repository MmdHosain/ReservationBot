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
    `INSERT INTO inbox_messages (salon_user_id, customer_telegram_id, sender_name, content, sender_type) VALUES ($1, $2, $3, $4, 'customer')`,
    [salonUserId, customerTelegramId, senderName, content]
  );
};

export const getConversation = async (salonUserId: number, customerTelegramId: number, limit: number = 5) => {
  const res = await pool.query(
    `SELECT * FROM inbox_messages WHERE salon_user_id = $1 AND customer_telegram_id = $2 ORDER BY created_at DESC LIMIT $3`,
    [salonUserId, customerTelegramId, limit]
  );
  return res.rows.map(r => ({
    content: r.content,
    senderType: r.sender_type || 'customer',
    createdAt: r.created_at
  })).reverse();
};
