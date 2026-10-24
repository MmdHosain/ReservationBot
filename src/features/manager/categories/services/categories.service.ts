// src/features/manager/categories/services/categories.service.ts
import * as repo from "../../../../db/category.repository.ts";

export const getCategories = async (orgId: string) => repo.getCategoriesByOrgId(orgId);
export const getCategory = async (id: string) => repo.getCategoryById(id);
export const addCategory = async (orgId: string, name: string) => repo.createCategory(orgId, name);
export const updateCategoryName = async (id: string, name: string) => repo.updateCategory(id, name);
export const removeCategory = async (id: string) => repo.deleteCategory(id);
