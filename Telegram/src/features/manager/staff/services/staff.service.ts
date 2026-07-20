// src/features/manager/staff/services/staff.service.ts
import { getStaffByOrgId, addStaff, deleteStaff } from "../../../../db/staff.repository.ts";

export const getStaffList = async (orgId: string) => {
  return await getStaffByOrgId(orgId);
};

export const addStaffMember = async (orgId: string, name: string) => {
  await addStaff(orgId, name);
};

export const removeStaffMember = async (id: string) => {
  await deleteStaff(id);
};
