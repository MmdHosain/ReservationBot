// src/db/staff.repository.ts
import { AppDataSource } from "./orm.config.ts";
import { Staff } from "./entities/v1/index.ts";

const repo = AppDataSource.getRepository(Staff);

export async function getStaffByUserId(userId: number) {
  return await repo.find({ where: { user_id: userId } });
}

export async function addStaff(userId: number, name: string) {
  const staff = repo.create({ user_id: userId, name });
  await repo.save(staff);
}

export async function deleteStaff(id: number) {
  await repo.delete(id);
}
