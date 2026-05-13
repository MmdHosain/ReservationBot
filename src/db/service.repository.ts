// src/db/service.repository.ts
import { pool } from "./pool.ts";

export async function saveService(
  userId: number,
  service: {
    name: string;
    duration: number;
    days: string;
  }
) {
  return pool.query(
    `
    INSERT INTO services (user_id, name, duration, days)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
[userId, service.name, service.duration, service.days]
  );
}

export async function getServicesByOwnerTelegramId(telegramId: number) {
  const res = await pool.query(
    `SELECT s.* FROM services s
     JOIN users u ON s.user_id = u.id
     WHERE u.telegram_id = $1`,
    [telegramId]
  );
  return res.rows;
}

export async function getServiceById(id: number) {
  const res = await pool.query(`SELECT * FROM services WHERE id = $1`,[id]);
  return res.rows[0];
}

export async function getServicesByUserId(userId: number) {
  const res = await pool.query(`SELECT * FROM services WHERE user_id = $1`, [userId]);
  return res.rows;
}

export async function deleteService(id: number) {
  return pool.query(`DELETE FROM services WHERE id = $1`,[id]);
}

export async function updateService(id: number, service: Partial<{ name: string; duration: number; days: string }>) {
  const updates =[];
  const values =[];
  let idx = 1;

  if (service.name !== undefined) {
    updates.push(`name = $${idx++}`);
    values.push(service.name);
  }
  if (service.duration !== undefined) {
    updates.push(`duration = $${idx++}`);
    values.push(service.duration);
  }
  if (service.days !== undefined) {
    updates.push(`days = $${idx++}`);
    values.push(service.days);
  }

  if (updates.length === 0) return;

  values.push(id);
  return pool.query(`UPDATE services SET ${updates.join(', ')} WHERE id = $${idx}`, values);
}
