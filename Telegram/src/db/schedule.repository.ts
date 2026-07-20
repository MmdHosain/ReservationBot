import { pool } from "./pool.ts";
import type { Schedule, ScheduleRule, ScheduleException } from "./types.ts";

export async function createSchedule(organizationId: string, name: string, validFrom: string | Date, validUntil?: string | Date, userId?: string): Promise<Schedule> {
  const res = await pool.query(
    `INSERT INTO schedules (organization_id, user_id, name, valid_from, valid_until) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [organizationId, userId || null, name, validFrom, validUntil || null]
  );
  return res.rows[0];
}

export async function getSchedulesByOrganization(organizationId: string): Promise<Schedule[]> {
  const res = await pool.query(`SELECT * FROM schedules WHERE organization_id = $1`, [organizationId]);
  return res.rows;
}

export async function createScheduleRule(scheduleId: string, dayOfWeek: number, startTime: string, endTime: string): Promise<ScheduleRule> {
  const res = await pool.query(
    `INSERT INTO schedule_rules (schedule_id, day_of_week, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING *`,
    [scheduleId, dayOfWeek, startTime, endTime]
  );
  return res.rows[0];
}

export async function getScheduleRules(scheduleId: string): Promise<ScheduleRule[]> {
  const res = await pool.query(`SELECT * FROM schedule_rules WHERE schedule_id = $1`, [scheduleId]);
  return res.rows;
}

export async function createScheduleException(organizationId: string, specificDate: string | Date, isAvailable: boolean, startTime?: string, endTime?: string, reason?: string, userId?: string, resourceId?: string): Promise<ScheduleException> {
  const res = await pool.query(
    `INSERT INTO schedule_exceptions (organization_id, user_id, resource_id, specific_date, is_available, start_time, end_time, reason)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [organizationId, userId || null, resourceId || null, specificDate, isAvailable, startTime || null, endTime || null, reason || null]
  );
  return res.rows[0];
}

export async function getScheduleExceptions(organizationId: string, startDate: string | Date, endDate: string | Date): Promise<ScheduleException[]> {
  const res = await pool.query(
    `SELECT * FROM schedule_exceptions WHERE organization_id = $1 AND specific_date >= $2 AND specific_date <= $3`,
    [organizationId, startDate, endDate]
  );
  return res.rows;
}
