import { getServicesByOrgId, getServiceById as getSvc } from "../../../../db/service.repository.ts";
import { getCategoriesByOrgId } from "../../../../db/category.repository.ts";
import { getOrganizationById, getOrganizationMembers } from "../../../../db/organization.repository.ts";
import { getSchedulesByOrganization, getScheduleRules, getScheduleExceptions } from "../../../../db/schedule.repository.ts";
import { getEventsByOrganization, createEvent, addEventParticipant } from "../../../../db/event.repository.ts";
import { ParticipantRole } from "../../../../db/types.ts";
import { getOrCreateUserByTelegramId } from "../../../../db/user_v2.repository.ts";

export const getSalonServices = async (orgId: string) => getServicesByOrgId(orgId);
export const getSalonCategories = async (orgId: string) => getCategoriesByOrgId(orgId);
export const getServiceById = async (id: string) => getSvc(id);
export const getSalonById = async (orgId: string) => getOrganizationById(orgId);

export const getOrgSchedules = async (orgId: string) => getSchedulesByOrganization(orgId);
export const getOrgScheduleRules = async (scheduleId: string) => getScheduleRules(scheduleId);
export const getOrgScheduleExceptions = async (orgId: string) => {
  const d1 = new Date();
  const d2 = new Date();
  d2.setDate(d2.getDate() + 30);
  return getScheduleExceptions(orgId, d1, d2);
};

export const getEventsForDate = async (orgId: string, dateStr: string) => {
  const d = new Date(dateStr);
  return getEventsByOrganization(orgId, d, d);
};

export const getOrgAdmins = async (orgId: string) => {
  const members = await getOrganizationMembers(orgId);
  return members.filter(m => m.role === 'admin' && m.user.telegram_id).map(m => m.user.telegram_id);
};

export const createAppointmentV2 = async (
  orgId: string, 
  serviceId: string, 
  customerTelegramId: number, 
  customerName: string, 
  date: string, 
  time: string
) => {
  const svc = await getSvc(serviceId);
  if (!svc) throw new Error("Service not found");

  const customerV2 = await getOrCreateUserByTelegramId(customerTelegramId, customerName);

  const plannedStartTime = new Date(`${date}T${time}:00`);
  const plannedEndTime = new Date(plannedStartTime.getTime() + svc.duration_minutes * 60000);

  const event = await createEvent(
    orgId,
    date,
    serviceId, 
    `رزرو ${svc.name}`,
    'scheduled' as any,
    'confirmed' as any,
    plannedStartTime,
    plannedEndTime
  );

  await addEventParticipant(event.id, customerV2.id, 'client' as ParticipantRole);

  return event;
};
