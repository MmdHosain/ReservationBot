import { AppDataSource } from "./orm.config.ts";
import { Resource } from "./entities/Resource.ts";
import { EventResource } from "./entities/EventResource.ts";

const resourceRepo = AppDataSource.getRepository(Resource);
const eventResourceRepo = AppDataSource.getRepository(EventResource);

export async function createResource(organizationId: string, name: string, resourceType?: string): Promise<Resource> {
  const resource = resourceRepo.create({
    organization: { id: organizationId },
    name,
    resource_type: resourceType
  });
  return await resourceRepo.save(resource);
}

export async function getResourcesByOrganization(organizationId: string): Promise<Resource[]> {
  return await resourceRepo.find({
    where: { organization: { id: organizationId }, is_active: true }
  });
}

export async function linkResourceToEvent(eventId: string, resourceId: string): Promise<EventResource> {
  const existing = await eventResourceRepo.findOneBy({
    event_id: eventId,
    resource_id: resourceId
  });

  if (existing) return existing;

  const eventResource = eventResourceRepo.create({
    event_id: eventId,
    resource_id: resourceId
  });
  return await eventResourceRepo.save(eventResource);
}
