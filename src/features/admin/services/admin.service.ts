// src/features/admin/services/admin.service.ts
import { pool } from "../../../../db/pool.ts";

export const getBotStats = async () => {
  const res = await pool.query(`
    SELECT 
      (SELECT COUNT(*) FROM users) AS total_users,
      (SELECT COUNT(*) FROM users WHERE salon_name IS NOT NULL) AS total_salons,
      (SELECT COUNT(*) FROM appointments) AS total_appointments,
      (SELECT COUNT(*) FROM services) AS total_services
  `);
  return res.rows[0];
};
