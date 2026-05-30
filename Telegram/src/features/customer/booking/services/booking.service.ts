import { getServicesByUserId, getServiceById as getSvc } from "../../../../db/service.repository.ts";
import { getUserById } from "../../../../db/user.repository.ts";
import { getAppointmentsByDate as getAppts, createAppointment as createAppt } from "../../../../db/appointment.repository.ts";
import { getCategoriesByUserId } from "../../../../db/category.repository.ts";

export const getSalonServices = async (salonId: number) => {
  return await getServicesByUserId(salonId);
};

export const getSalonCategories = async (salonId: number) => {
  return await getCategoriesByUserId(salonId);
};

export const getServiceById = async (id: number) => {
  return await getSvc(id);
};

export const getSalonById = async (salonId: number) => {
  return await getUserById(salonId);
};

export const getAppointmentsByDate = async (salonId: number, date: string) => {
  return await getAppts(salonId, date);
};

export const createAppointment = async (serviceId: number, customerTelegramId: number, customerName: string, date: string, time: string) => {
  return await createAppt(serviceId, customerTelegramId, customerName, date, time);
};
