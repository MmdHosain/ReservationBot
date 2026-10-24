import { AppDataSource } from "./orm.config.ts";
import { EventType } from "./entities/EventType.ts";

const repo = AppDataSource.getRepository(EventType);

export async function saveService(orgId: string, service: { name: string; duration: number; categoryId?: string | null }) {
  const svc = repo.create({
    organization: { id: orgId },
    name: service.name,
    duration_minutes: service.duration,
    category: service.categoryId ? { id: service.categoryId } : undefined,
    is_active: true
  });
  return await repo.save(svc);
}

export async function getServicesByOrgId(orgId: string) {
  return await repo.find({ 
    where: { organization: { id: orgId }, is_active: true },
    relations: ["category"]
  });
}

export async function getServiceById(id: string) {
  return await repo.findOne({ where: { id }, relations: ["category"] });
}

export async function updateService(id: string, service: Partial<{ name: string; duration: number; categoryId: string | null; is_active: boolean }>) {
  const updates: any = {};
  if (service.name !== undefined) updates.name = service.name;
  if (service.duration !== undefined) updates.duration_minutes = service.duration;
  if (service.categoryId !== undefined) updates.category = service.categoryId === null ? null : { id: service.categoryId };
  if (service.is_active !== undefined) updates.is_active = service.is_active;

  if (Object.keys(updates).length > 0) {
    await repo.update(id, updates);
  }
}

export async function deleteService(id: string) {
  await repo.update(id, { is_active: false }); // Soft delete to keep history intact
}
