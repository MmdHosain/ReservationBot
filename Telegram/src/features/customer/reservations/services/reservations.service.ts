// src/features/customer/reservations/services/reservations.service.ts
import {
  getAppointmentsForCustomer,
  cancelAppointment,
} from "../../../../db/appointment.repository.ts";
import { getOrCreateUser } from "../../../../db/user.repository.ts";
import { AppDataSource } from "../../../../db/orm.config.ts";
import { Appointment, Service } from "../../../../db/entities/v1/index.ts";
import { Event } from "../../../../db/entities/Event.ts";

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
    const appt = await AppDataSource.getRepository(Appointment).findOne({
        where: { id: apptId }
    });
    if (appt) {
       const dateStr = appt.appointment_date instanceof Date ? appt.appointment_date.toISOString().split('T')[0] : String(appt.appointment_date);
       const timeStr = typeof appt.appointment_time === "string" ? appt.appointment_time.substring(0,5) : (appt.appointment_time as Date).toTimeString().substring(0,5);
       syncData = { dateStr, timeStr };
    }
  } catch (e) {}

  // V1 Cancel
  await cancelAppointment(apptId, telegramId);

  // V2 Dual Write (sync status to canceled)
  if (syncData) {
    try {
       await AppDataSource.query(`
         UPDATE events 
         SET status = 'canceled'
         FROM event_participants ep, users_v2 u
         WHERE events.id = ep.event_id 
         AND ep.user_id = u.id 
         AND u.telegram_id = $1 
         AND events.event_date = $2
         AND CAST(events.planned_start_time AS TIME) = $3
       `, [telegramId, syncData.dateStr, `${syncData.timeStr}:00`]);
    } catch (err) {
      console.error("❌ V2 Dual Write Error (cancelCustomerAppointment):", err);
    }
  }
};
