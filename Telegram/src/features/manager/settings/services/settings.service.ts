// src/features/manager/settings/services/settings.service.ts
import { updateDeposit, getOrganizationByAdminTelegramId } from "../../../../db/user.repository.ts";
import { AppDataSource } from "../../../../db/orm.config.ts";

export const setWorkHours = async (telegramId: number, start: string, end: string) => {
  const org = await getOrganizationByAdminTelegramId(telegramId);
  if (!org) return;
  await AppDataSource.query(`
    UPDATE schedule_rules sr
    SET start_time = $1, end_time = $2
    FROM schedules s
    WHERE sr.schedule_id = s.id AND s.organization_id = $3
  `, [start + ':00', end + ':00', org.id]);
};

export const setBreakHours = async (telegramId: number, start: string, end: string) => {
  // Stub for Phase 1 Migration
};

export const removeBreak = async (telegramId: number) => {
  // Stub for Phase 1 Migration
};

export const setDeposit = async (telegramId: number, amount: number) => {
  await updateDeposit(telegramId, amount);
};
