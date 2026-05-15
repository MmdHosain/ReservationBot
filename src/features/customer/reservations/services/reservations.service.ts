// src/features/customer/reservations/services/reservations.service.ts
import {
  getAppointmentsForCustomer,
  cancelAppointment,
} from "../../../../db/appointment.repository.ts";
import { getOrCreateUser } from "../../../../db/user.repository.ts";

export const getCustomerAppointments = async (telegramId: number) => {
  const appointments = await getAppointmentsForCustomer(telegramId);
  const user = await getOrCreateUser(telegramId);
  return { appointments, calendar: user.calendar_type || "shamsi" };
};

export const cancelCustomerAppointment = async (
  apptId: number,
  telegramId: number
) => {
  await cancelAppointment(apptId, telegramId);
};
