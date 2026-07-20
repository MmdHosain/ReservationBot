// src/db/service.repository.ts
import { AppDataSource } from "./orm.config.ts";
import { Service, V1User } from "./entities/v1/index.ts";

const repo = AppDataSource.getRepository(Service);

export async function saveService(userId: number, service: { name: string; duration: number; days: string; categoryId?: number | null }) {
  const svc = repo.create({
    user_id: userId,
    name: service.name,
    duration: service.duration,
    days: service.days,
    category_id: service.categoryId || null
  });
  return await repo.save(svc);
}

export async function getServicesByOwnerTelegramId(telegramId: number) {
  const query = repo.createQueryBuilder("s")
    .innerJoin(V1User, "u", "s.user_id = u.id")
    .where("u.telegram_id = :telegramId", { telegramId });
  return await query.getMany();
}

export async function getServiceById(id: number) {
  return await repo.findOneBy({ id });
}

export async function getServicesByUserId(userId: number) {
  return await repo.find({ where: { user_id: userId } });
}

export async function deleteService(id: number) {
  await repo.delete(id);
}

export async function updateService(id: number, service: Partial<{ name: string; duration: number; days: string; categoryId: number | null }>) {
  const updates: any = {};
  if (service.name !== undefined) updates.name = service.name;
  if (service.duration !== undefined) updates.duration = service.duration;
  if (service.days !== undefined) updates.days = service.days;
  if (service.categoryId !== undefined) updates.category_id = service.categoryId;

  if (Object.keys(updates).length > 0) {
    await repo.update(id, updates);
  }
}
