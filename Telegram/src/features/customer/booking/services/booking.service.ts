import { getServicesByUserId, getServiceById as getSvc } from "../../../../db/service.repository.ts";
import { getUserById } from "../../../../db/user.repository.ts";
import { getAppointmentsByDate as getAppts, createAppointment as createAppt } from "../../../../db/appointment.repository.ts";
import { getCategoriesByUserId } from "../../../../db/category.repository.ts";

// V2 Dual Write Imports
import { AppDataSource } from "../../../../db/orm.config.ts";
import { OrganizationMember } from "../../../../db/entities/OrganizationMember.ts";
import { EventType } from "../../../../db/entities/EventType.ts";
import { UserV2 } from "../../../../db/entities/UserV2.ts";
import { getOrCreateUserByTelegramId } from "../../../../db/user_v2.repository.ts";
import { createEvent, addEventParticipant } from "../../../../db/event.repository.ts";
import { ParticipantRole } from "../../../../db/types.ts";

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
  const appt = await createAppt(serviceId, customerTelegramId, customerName, date, time);
  
  // V2 Dual Write
  try {
    const svc = await getSvc(serviceId);
    if (svc) {
      const v1User = await getUserById(svc.user_id);
      if (v1User) {
        // Get org
        const member = await AppDataSource.getRepository(OrganizationMember).findOne({
           where: { user: { telegram_id: v1User.telegram_id } },
           relations: ["organization"]
        });
        
        if (member && member.organization) {
          const orgId = member.organization.id;
          
          // Get event type by name
          const et = await AppDataSource.getRepository(EventType).findOne({
            where: { organization: { id: orgId }, name: svc.name }
          });
          const eventTypeId = et ? et.id : undefined;

          // Get customer V2 user
          const customerV2 = await getOrCreateUserByTelegramId(customerTelegramId, customerName);

          // Get salon V2 user
          const salonV2 = await AppDataSource.getRepository(UserV2).findOneBy({ telegram_id: v1User.telegram_id });
          const salonV2Id = salonV2 ? salonV2.id : undefined;

          // Create event
          const eventDate = date;
          const plannedStartTime = new Date(`${date}T${time}:00`);
          const plannedEndTime = new Date(plannedStartTime.getTime() + svc.duration * 60000);

          const event = await createEvent(
            orgId,
            eventDate,
            eventTypeId,
            `Booking for ${svc.name}`,
            'scheduled' as any,
            'confirmed' as any,
            plannedStartTime,
            plannedEndTime
          );

          // Add participants
          await addEventParticipant(event.id, customerV2.id, 'client' as ParticipantRole);
          
          if (salonV2Id) {
             await addEventParticipant(event.id, salonV2Id, 'host' as ParticipantRole);
          }
        }
      }
    }
  } catch (err) {
    console.error("❌ V2 Dual Write Error (createAppointment):", err);
  }

  return appt;
};
