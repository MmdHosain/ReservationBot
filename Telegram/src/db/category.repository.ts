// src/db/category.repository.ts
import { AppDataSource } from "./orm.config.ts";
import { ServiceCategory } from "./entities/v1/index.ts";

const repo = AppDataSource.getRepository(ServiceCategory);

export async function createCategory(userId: number, name: string) {
  const cat = repo.create({ user_id: userId, name });
  return await repo.save(cat);
}

export async function getCategoriesByUserId(userId: number) {
  return await repo.find({ 
    where: { user_id: userId }, 
    order: { created_at: "ASC" } 
  });
}

export async function getCategoryById(id: number) {
  return await repo.findOneBy({ id });
}

export async function updateCategory(id: number, name: string) {
  await repo.update(id, { name });
  return await getCategoryById(id);
}

export async function deleteCategory(id: number) {
  await repo.delete(id);
}
