// src/features/manager/dashboard/services/dashboard.service.ts
import { getAppointmentsForOwner } from "../../../../db/appointment.repository.ts";
import { getServicesByUserId } from "../../../../db/service.repository.ts";
import {
  getUserByTelegramId,
  deleteUserByTelegramId,
  getOrCreateUser,
} from "../../../../db/user.repository.ts";
import { formatFriendlyDate } from "../../../../core/utils/date.ts";

export const getUserInfo = async (telegramId: number) => {
  return await getUserByTelegramId(telegramId);
};

export const ensureUserAndGetInfo = async (telegramId: number) => {
  return await getOrCreateUser(telegramId);
};

export const getAppointmentsStats = async (
  userId: number,
  calendar: "shamsi" | "miladi"
) => {
  const appointments = await getAppointmentsForOwner(userId);
  const avgPrice = 250000;
  const count = appointments.length;
  let list = "";

  appointments.forEach((a, i) => {
    const timeStr =
      typeof a.appointment_time === "string"
        ? a.appointment_time.substring(0, 5)
        : a.appointment_time;
    const friendlyDate = formatFriendlyDate(a.appointment_date, calendar);
    const staffInfo = a.staff_name ? ` (پرسنل: ${a.staff_name})` : "";
    list += `${i + 1}️⃣ ${friendlyDate} ساعت ${timeStr} - ${a.customer_name} (${
      a.service_name
    })${staffInfo}\n`;
  });

  return { count, list, revenue: count * avgPrice };
};

export const getServices = async (userId: number) => {
  return await getServicesByUserId(userId);
};

export const restartSalon = async (telegramId: number) => {
  return await deleteUserByTelegramId(telegramId);
};
