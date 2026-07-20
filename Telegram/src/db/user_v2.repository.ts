import { pool } from "./pool.ts";
import type { User } from "./types.ts";

export async function createUser(fullName: string, telegramId?: number, instagramId?: string, email?: string, phone?: string): Promise<User> {
  const res = await pool.query(
    `INSERT INTO users_v2 (full_name, telegram_id, instagram_id, email, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [fullName, telegramId || null, instagramId || null, email || null, phone || null]
  );
  return res.rows[0];
}

export async function getUserByTelegramId(telegramId: number): Promise<User | null> {
  const res = await pool.query(`SELECT * FROM users_v2 WHERE telegram_id = $1`, [telegramId]);
  return res.rows[0] || null;
}

export async function getUserByInstagramId(instagramId: string): Promise<User | null> {
  const res = await pool.query(`SELECT * FROM users_v2 WHERE instagram_id = $1`, [instagramId]);
  return res.rows[0] || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const res = await pool.query(`SELECT * FROM users_v2 WHERE id = $1`, [id]);
  return res.rows[0] || null;
}

export async function getOrCreateUserByTelegramId(telegramId: number, fullName: string = 'Unknown'): Promise<User> {
  let user = await getUserByTelegramId(telegramId);
  if (!user) {
    user = await createUser(fullName, telegramId);
  }
  return user;
}
