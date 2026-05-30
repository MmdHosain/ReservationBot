// Instagram/src/db/bridge.ts
// This file bridges the Instagram module to the shared PostgreSQL database initialized in Telegram/src/db

import { pool } from "../../../Telegram/src/db/index.ts";

/**
 * Fetches a user by their Instagram ID, creating them if they don't exist.
 */
export const getOrCreateIGUser = async (igId: string) => {
  const res = await pool.query("SELECT * FROM users WHERE instagram_id = $1", [igId]);
  if (res.rows.length > 0) return res.rows[0];
  
  const insertRes = await pool.query(
    "INSERT INTO users (instagram_id) VALUES ($1) RETURNING *",
    [igId]
  );
  return insertRes.rows[0];
};

/**
 * Fetches a user specifically by Instagram ID.
 */
export const getUserByIGId = async (igId: string) => {
  const res = await pool.query("SELECT * FROM users WHERE instagram_id = $1", [igId]);
  return res.rows[0];
};

// Re-export common functions from the Telegram repositories so Instagram logic doesn't have deep imports
export { getServicesByUserId, getServiceById } from "../../../Telegram/src/db/service.repository.ts";
export { getUserById, updateSalonName, markUserOnboarded } from "../../../Telegram/src/db/user.repository.ts";
export { getCategoriesByUserId } from "../../../Telegram/src/db/category.repository.ts";
export { getAppointmentsByDate } from "../../../Telegram/src/db/appointment.repository.ts";
