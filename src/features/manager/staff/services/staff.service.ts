// src/features/manager/staff/services/staff.service.ts
import { getStaffByUserId, addStaff, deleteStaff } from "../../../../db/staff.repository.ts";
import { getUserByTelegramId } from "../../../../db/user.repository.ts";

export const getUser = async (telegramId: number) => {
  return await getUserByTelegramId(telegramId);
};

export const getStaffList = async (userId: number) => {
  return await getStaffByUserId(userId);
};

export const addStaffMember = async (userId: number, name: string) => {
  await addStaff(userId, name);
};

export const removeStaffMember = async (id: number) => {
  await deleteStaff(id);
};
