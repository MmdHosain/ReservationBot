// src/db/appointment.repository.ts
import { pool } from "./pool.ts";

export async function createAppointment(
  serviceId: number,
  customerTelegramId: number,
  customerName: string,
  appointmentDate: string,
  appointmentTime: string,
  staffId?: number,
  status: string = 'confirmed'
) {
  const res = await pool.query(
    `INSERT INTO appointments (service_id, customer_telegram_id, customer_name, appointment_date, appointment_time, staff_id, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
[serviceId, customerTelegramId, customerName, appointmentDate, appointmentTime, staffId || null, status]
  );
  return res.rows[0];
}

export async function getAppointmentsForOwner(ownerId: number) {
  const res = await pool.query(
    `SELECT a.*, s.name as service_name, s.duration, st.name as staff_name
     FROM appointments a
     JOIN services s ON a.service_id = s.id
     LEFT JOIN staff st ON a.staff_id = st.id
     WHERE s.user_id = $1 AND a.appointment_date >= CURRENT_DATE AND a.status = 'confirmed'
     ORDER BY a.appointment_date, a.appointment_time`,
    [ownerId]
  );
  return res.rows;
}

export async function getAppointmentsForCustomer(telegramId: number) {
  const res = await pool.query(
    `SELECT a.*, s.name as service_name, s.duration, st.name as staff_name
     FROM appointments a
     JOIN services s ON a.service_id = s.id
     LEFT JOIN staff st ON a.staff_id = st.id
     WHERE a.customer_telegram_id = $1 AND a.appointment_date >= CURRENT_DATE AND a.status = 'confirmed'
     ORDER BY a.appointment_date, a.appointment_time`,
    [telegramId]
  );
  return res.rows;
}

export async function cancelAppointment(id: number, customerTelegramId: number) {
  await pool.query(
    `UPDATE appointments SET status = 'cancelled' WHERE id = $1 AND customer_telegram_id = $2`,
    [id, customerTelegramId]
  );
}

export async function getAppointmentsByDate(ownerId: number, date: string, staffId?: number) {
  let query = `
     SELECT a.appointment_time, s.duration 
     FROM appointments a 
     JOIN services s ON a.service_id = s.id 
     WHERE s.user_id = $1 AND a.appointment_date = $2 AND a.status = 'confirmed'
  `;
  const params: any[] = [ownerId, date];
  
  if (staffId) {
    query += ` AND a.staff_id = $3`;
    params.push(staffId);
  } else {
    query += ` AND a.staff_id IS NULL`;
  }
  
  const res = await pool.query(query, params);
  return res.rows;
}
