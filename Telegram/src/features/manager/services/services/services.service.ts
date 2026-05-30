// src/features/manager/services/services/services.service.ts
import { getServiceById, updateService, deleteService } from "../../../../db/service.repository.ts";
import { getCategoriesByUserId, getCategoryById } from "../../../../db/category.repository.ts";
import { getUserByTelegramId } from "../../../../db/user.repository.ts";

export const getUser = async (telegramId: number) => {
  return await getUserByTelegramId(telegramId);
};

export const getUserCategories = async (userId: number) => {
  return await getCategoriesByUserId(userId);
};

export const getCategory = async (id: number) => {
  return await getCategoryById(id);
};

export const getService = async (id: number) => {
  return await getServiceById(id);
};

export const updateServiceData = async (id: number, data: any) => {
  await updateService(id, data);
};

export const removeService = async (id: number) => {
  await deleteService(id);
};
