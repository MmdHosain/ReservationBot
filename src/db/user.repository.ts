// src/db/user.repository.ts
import { pool } from "./pool.ts";
import { MESSAGES } from "../messages.ts";

export async function getOrCreateUser(telegramId: number) {
  const res = await pool.query("SELECT * FROM users WHERE telegram_id = $1",[
    telegramId,
  ]);

  if (res.rows.length > 0) return res.rows[0];

  const insertRes = await pool.query(
    "INSERT INTO users (telegram_id) VALUES ($1) RETURNING *",
    [telegramId]
  );

  return insertRes.rows[0];
}

export async function getUserByTelegramId(telegramId: number) {
  const res = await pool.query("SELECT * FROM users WHERE telegram_id = $1", [telegramId]);
  return res.rows[0];
}

export async function markUserOnboarded(userId: number) {
  await pool.query(`UPDATE users SET onboarded_at = NOW() WHERE id = $1`,[
    userId,
  ]);
}

export async function updateSalonName(userId: number, salonName: string) {
  await pool.query(`UPDATE users SET salon_name = $1 WHERE id = $2`,[salonName, userId]);
}

export async function updateCalendarType(telegramId: number, type: 'shamsi' | 'miladi') {
  await pool.query(`UPDATE users SET calendar_type = $1 WHERE telegram_id = $2`,[type, telegramId]);
}

export async function deleteUserByTelegramId(telegramId: number) {
  const userRes = await pool.query(
    "SELECT id FROM users WHERE telegram_id = $1",
[telegramId]
  );

  if (userRes.rows.length === 0) {
    return { success: false, message: MESSAGES.userNotFound };
  }

  const userId = userRes.rows[0].id;

  await pool.query("DELETE FROM services WHERE user_id = $1", [userId]);
  await pool.query("DELETE FROM users WHERE id = $1", [userId]);

  return {
    success: true,
    message: MESSAGES.userDeleted(telegramId),
  };
}

export async function addCustomerSalon(customerTelegramId: number, salonTelegramId: number) {
  const salonUser = await getUserByTelegramId(salonTelegramId);
  if (!salonUser) return;
  await pool.query(`
    INSERT INTO customer_salons (customer_telegram_id, salon_user_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `,[customerTelegramId, salonUser.id]);
}

export async function getCustomerSalons(customerTelegramId: number) {
  const res = await pool.query(`
    SELECT cs.id, u.salon_name, u.telegram_id as salon_telegram_id, cs.salon_user_id
    FROM customer_salons cs
    JOIN users u ON cs.salon_user_id = u.id
    WHERE cs.customer_telegram_id = $1
  `, [customerTelegramId]);
  return res.rows;
}

export async function removeCustomerSalon(customerTelegramId: number, salonUserId: number) {
  await pool.query(`DELETE FROM customer_salons WHERE customer_telegram_id = $1 AND salon_user_id = $2`, [customerTelegramId, salonUserId]);
}
