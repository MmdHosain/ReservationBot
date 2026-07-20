// src/db/appointment.repository.ts
import { AppDataSource } from "./orm.config.ts";
import { Event } from "./entities/Event.ts";
import { EventParticipant } from "./entities/EventParticipant.ts";
import { User } from "./entities/User.ts";
import { ParticipantRole } from "./types.ts";

const eventRepo = AppDataSource.getRepository(Event);

export async function getAppointmentsForOwner(orgId: string) {
  const query = eventRepo.createQueryBuilder("e")
    .leftJoinAndSelect("e.event_type", "et")
    .innerJoin("event_participants", "ep", "ep.event_id = e.id AND ep.role = :role", { role: ParticipantRole.CLIENT })
    .innerJoinAndMapOne("e.client", User, "u", "u.id = ep.user_id")
    .where("e.organization_id = :orgId", { orgId })
    .andWhere("e.event_date >= CURRENT_DATE")
    .andWhere("e.status = 'confirmed'")
    .orderBy("e.event_date", "ASC")
    .addOrderBy("e.planned_start_time", "ASC");
    
  const events = await query.getMany();
  
  return events.map(e => ({
    id: e.id,
    appointment_date: e.event_date,
    appointment_time: e.planned_start_time ? new Date(e.planned_start_time).toTimeString().substring(0, 5) : "00:00",
    customer_name: (e as any).client?.full_name || "مشتری",
    customer_telegram_id: (e as any).client?.telegram_id,
    service_name: e.event_type?.name || "خدمت",
    duration: e.event_type?.duration_minutes || 0,
    staff_name: null 
  }));
}

export async function getAppointmentsForCustomer(telegramId: number) {
  const query = eventRepo.createQueryBuilder("e")
    .leftJoinAndSelect("e.event_type", "et")
    .leftJoinAndSelect("e.organization", "o")
    .innerJoin("event_participants", "ep", "ep.event_id = e.id AND ep.role = :role", { role: ParticipantRole.CLIENT })
    .innerJoin(User, "u", "u.id = ep.user_id AND u.telegram_id = :telegramId", { telegramId })
    .where("e.event_date >= CURRENT_DATE")
    .andWhere("e.status = 'confirmed'")
    .orderBy("e.event_date", "ASC")
    .addOrderBy("e.planned_start_time", "ASC");
    
  const events = await query.getMany();
  
  return events.map(e => ({
    id: e.id,
    appointment_date: e.event_date,
    appointment_time: e.planned_start_time ? new Date(e.planned_start_time).toTimeString().substring(0, 5) : "00:00",
    service_name: e.event_type?.name || "خدمت",
    duration: e.event_type?.duration_minutes || 0,
    staff_name: null,
    salon_name: e.organization?.name || "مجموعه"
  }));
}

export async function cancelAppointment(eventId: string, customerTelegramId: number) {
  await eventRepo.update({ id: eventId }, { status: 'canceled' as any });
}
