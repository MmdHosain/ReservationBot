import { AppDataSource } from "./orm.config.ts";
import { Event } from "./entities/Event.ts";
import { EventParticipant } from "./entities/EventParticipant.ts";
import { BookingMode, EventStatus, ParticipantRole } from "./types.ts";
import { Between } from "typeorm";

const eventRepo = AppDataSource.getRepository(Event);
const participantRepo = AppDataSource.getRepository(EventParticipant);

export async function createEvent(
  organizationId: string,
  eventDate: string | Date,
  eventTypeId?: string,
  title?: string,
  bookingMode: BookingMode = BookingMode.SCHEDULED,
  status: EventStatus = EventStatus.PENDING,
  plannedStartTime?: string | Date,
  plannedEndTime?: string | Date
): Promise<Event> {
  const event = eventRepo.create({
    organization: { id: organizationId },
    event_type: eventTypeId ? { id: eventTypeId } : undefined,
    title,
    event_date: eventDate,
    booking_mode: bookingMode,
    status,
    planned_start_time: plannedStartTime ? new Date(plannedStartTime) : undefined,
    planned_end_time: plannedEndTime ? new Date(plannedEndTime) : undefined
  });
  return await eventRepo.save(event);
}

export async function addEventParticipant(eventId: string, userId: string, role: ParticipantRole): Promise<EventParticipant> {
  const participant = participantRepo.create({
    event: { id: eventId },
    user: { id: userId },
    role
  });
  return await participantRepo.save(participant);
}

export async function getEventsByOrganization(organizationId: string, fromDate: string | Date, toDate: string | Date): Promise<Event[]> {
  return await eventRepo.find({
    where: {
      organization: { id: organizationId },
      event_date: Between(fromDate, toDate)
    },
    order: {
      event_date: "ASC",
      planned_start_time: "ASC"
    }
  });
}

export async function getEventsForUser(userId: string, role?: ParticipantRole): Promise<Event[]> {
  const query = eventRepo.createQueryBuilder("e")
    .innerJoin("event_participants", "ep", "ep.event_id = e.id")
    .where("ep.user_id = :userId", { userId });

  if (role) {
    query.andWhere("ep.role = :role", { role });
  }

  query.orderBy("e.event_date", "ASC").addOrderBy("e.planned_start_time", "ASC");

  return await query.getMany();
}

export async function updateEventStatus(eventId: string, status: EventStatus): Promise<Event | null> {
  const event = await eventRepo.findOneBy({ id: eventId });
  if (!event) return null;
  
  event.status = status;
  return await eventRepo.save(event);
}
