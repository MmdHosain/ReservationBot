// src/db/category.repository.ts
import { pool } from "./pool.ts";

export async function createCategory(userId: number, name: string) {
  const res = await pool.query(
    `INSERT INTO service_categories (user_id, name) VALUES ($1, $2) RETURNING *;`,
    [userId, name]
  );
  return res.rows[0];
}

export async function getCategoriesByUserId(userId: number) {
  const res = await pool.query(`SELECT * FROM service_categories WHERE user_id = $1 ORDER BY created_at ASC`, [userId]);
  return res.rows;
}

export async function getCategoryById(id: number) {
  const res = await pool.query(`SELECT * FROM service_categories WHERE id = $1`, [id]);
  return res.rows[0];
}

export async function updateCategory(id: number, name: string) {
  const res = await pool.query(`UPDATE service_categories SET name = $1 WHERE id = $2 RETURNING *`, [name, id]);
  return res.rows[0];
}

export async function deleteCategory(id: number) {
  await pool.query(`DELETE FROM service_categories WHERE id = $1`, [id]);
}
