// src/features/manager/services/services/services.service.ts
import { getServiceById, updateService, deleteService } from "../../../../db/service.repository.ts";

export const getService = async (id: number) => {
  return await getServiceById(id);
};

export const updateServiceData = async (id: number, data: any) => {
  await updateService(id, data);
};

export const removeService = async (id: number) => {
  await deleteService(id);
};
