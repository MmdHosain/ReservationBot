import { AppDataSource } from "./orm.config.ts";
import { EventType } from "./entities/EventType.ts";
import { UserEventType } from "./entities/UserEventType.ts";

const etRepo = AppDataSource.getRepository(EventType);
const uetRepo = AppDataSource.getRepository(UserEventType);

export async function createEventType(organizationId: string, name: string, durationMinutes: number, bufferMinutes: number = 0): Promise<EventType> {
  const eventType = etRepo.create({
    organization: { id: organizationId },
    name,
    duration_minutes: durationMinutes,
    buffer_minutes: bufferMinutes
  });
  return await etRepo.save(eventType);
}

export async function getEventTypeById(id: string): Promise<EventType | null> {
  return await etRepo.findOneBy({ id });
}

export async function getEventTypesByOrganization(organizationId: string): Promise<EventType[]> {
  return await etRepo.find({
    where: { organization: { id: organizationId }, is_active: true }
  });
}

export async function linkUserToEventType(userId: string, eventTypeId: string): Promise<UserEventType> {
  const existing = await uetRepo.findOneBy({
    user: { id: userId },
    event_type: { id: eventTypeId }
  });
  
  if (existing) return existing;

  const uet = uetRepo.create({
    user: { id: userId },
    event_type: { id: eventTypeId }
  });
  return await uetRepo.save(uet);
}

export async function getEventTypesForUser(userId: string): Promise<EventType[]> {
  const userEventTypes = await uetRepo.find({
    where: { user: { id: userId } },
    relations: ["event_type"]
  });
  
  return userEventTypes
    .map(uet => uet.event_type)
    .filter(et => et.is_active);
}
