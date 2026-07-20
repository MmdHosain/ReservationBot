// src/features/customer/reservations/services/reservations.service.ts
import {
  getAppointmentsForCustomer,
  cancelAppointment,
} from "../../../../db/appointment.repository.ts";
import { getOrCreateUser } from "../../../../db/user.repository.ts";
import { pool } from "../../../../db/pool.ts";

export const getCustomerAppointments = async (telegramId: number) => {
  const appointments = await getAppointmentsForCustomer(telegramId);
  const user = await getOrCreateUser(telegramId);
  return { appointments, calendar: user.calendar_type || "shamsi" };
};

export const cancelCustomerAppointment = async (
  apptId: number,
  telegramId: number
) => {
  // Pre-fetch appointment to get date/time for V2 Dual Write Sync
  let syncData = null;
  try {
    const apptRes = await pool.query(`SELECT a.appointment_date, a.appointment_time, s.name as svc_name FROM appointments a JOIN services s ON a.service_id = s.id WHERE a.id = $1`, [apptId]);
    if (apptRes.rows.length > 0) {
       const a = apptRes.rows[0];
       const dateStr = new Date(a.appointment_date).toISOString().split('T')[0];
       const timeStr = typeof a.appointment_time === "string" ? a.appointment_time.substring(0,5) : a.appointment_time.toTimeString().substring(0,5);
       syncData = { dateStr, timeStr };
    }
  } catch (e) {}

  // V1 Cancel
  await cancelAppointment(apptId, telegramId);

  // V2 Dual Write (sync status to canceled)
  if (syncData) {
    try {
       await pool.query(`
         UPDATE events e 
         SET status = 'canceled'
         FROM event_participants ep, users_v2 u
         WHERE e.id = ep.event_id 
         AND ep.user_id = u.id 
         AND u.telegram_id = $1 
         AND e.event_date = $2
         AND CAST(e.planned_start_time AS TIME) = $3
       `, [telegramId, syncData.dateStr, `${syncData.timeStr}:00`]);
    } catch (err) {
      console.error("❌ V2 Dual Write Error (cancelCustomerAppointment):", err);
    }
  }
};
