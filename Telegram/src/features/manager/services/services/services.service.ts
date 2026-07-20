// src/features/manager/services/services/services.service.ts
import { getServiceById, updateService, deleteService, getServicesByOrgId } from "../../../../db/service.repository.ts";
import { getCategoriesByOrgId, getCategoryById } from "../../../../db/category.repository.ts";

export const getOrgCategories = async (orgId: string) => getCategoriesByOrgId(orgId);
export const getCategory = async (id: string) => getCategoryById(id);
export const getService = async (id: string) => getServiceById(id);
export const getOrgServices = async (orgId: string) => getServicesByOrgId(orgId);
export const updateServiceData = async (id: string, data: any) => updateService(id, data);
export const removeService = async (id: string) => deleteService(id);
