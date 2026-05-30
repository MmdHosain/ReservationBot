// src/db/staff.repository.ts
import { pool } from "./pool.ts";

export async function getStaffByUserId(userId: number) {
  const res = await pool.query(`SELECT * FROM staff WHERE user_id = $1`, [userId]);
  return res.rows;
}

export async function addStaff(userId: number, name: string) {
  await pool.query(`INSERT INTO staff (user_id, name) VALUES ($1, $2)`, [userId, name]);
}

export async function deleteStaff(id: number) {
  await pool.query(`DELETE FROM staff WHERE id = $1`, [id]);
}
