// src/features/manager/categories/services/categories.service.ts
import * as repo from "../../../../db/category.repository.ts";
import { getUserByTelegramId } from "../../../../db/user.repository.ts";

export const getUser = async (telegramId: number) => getUserByTelegramId(telegramId);
export const getCategories = async (userId: number) => repo.getCategoriesByUserId(userId);
export const getCategory = async (id: number) => repo.getCategoryById(id);
export const addCategory = async (userId: number, name: string) => repo.createCategory(userId, name);
export const updateCategoryName = async (id: number, name: string) => repo.updateCategory(id, name);
export const removeCategory = async (id: number) => repo.deleteCategory(id);
