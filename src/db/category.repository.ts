import { AppDataSource } from "./orm.config.ts";
import { Category } from "./entities/Category.ts";

const repo = AppDataSource.getRepository(Category);

export async function createCategory(orgId: string, name: string) {
  const cat = repo.create({ organization: { id: orgId }, name });
  return await repo.save(cat);
}

export async function getCategoriesByOrgId(orgId: string) {
  return await repo.find({ 
    where: { organization: { id: orgId } }, 
    order: { created_at: "ASC" } 
  });
}

export async function getCategoryById(id: string) {
  return await repo.findOneBy({ id });
}

export async function updateCategory(id: string, name: string) {
  await repo.update(id, { name });
  return await getCategoryById(id);
}

export async function deleteCategory(id: string) {
  await repo.delete(id);
}
