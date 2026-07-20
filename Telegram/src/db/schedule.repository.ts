import { AppDataSource } from "./orm.config.ts";
import { Schedule } from "./entities/Schedule.ts";
import { ScheduleRule } from "./entities/ScheduleRule.ts";
import { ScheduleException } from "./entities/ScheduleException.ts";
import { Between } from "typeorm";

const scheduleRepo = AppDataSource.getRepository(Schedule);
const ruleRepo = AppDataSource.getRepository(ScheduleRule);
const exceptionRepo = AppDataSource.getRepository(ScheduleException);

export async function createSchedule(organizationId: string, name: string, validFrom: string | Date, validUntil?: string | Date, userId?: string): Promise<Schedule> {
  const schedule = scheduleRepo.create({
    organization: { id: organizationId },
    user: userId ? { id: userId } : undefined,
    name,
    valid_from: validFrom,
    valid_until: validUntil
  });
  return await scheduleRepo.save(schedule);
}

export async function getSchedulesByOrganization(organizationId: string): Promise<Schedule[]> {
  return await scheduleRepo.find({
    where: { organization: { id: organizationId } }
  });
}

export async function createScheduleRule(scheduleId: string, dayOfWeek: number, startTime: string, endTime: string): Promise<ScheduleRule> {
  const rule = ruleRepo.create({
    schedule: { id: scheduleId },
    day_of_week: dayOfWeek,
    start_time: startTime,
    end_time: endTime
  });
  return await ruleRepo.save(rule);
}

export async function getScheduleRules(scheduleId: string): Promise<ScheduleRule[]> {
  return await ruleRepo.find({
    where: { schedule: { id: scheduleId } }
  });
}

export async function createScheduleException(organizationId: string, specificDate: string | Date, isAvailable: boolean, startTime?: string, endTime?: string, reason?: string, userId?: string, resourceId?: string): Promise<ScheduleException> {
  const exception = exceptionRepo.create({
    organization: { id: organizationId },
    user: userId ? { id: userId } : undefined,
    resource: resourceId ? { id: resourceId } : undefined,
    specific_date: specificDate,
    is_available: isAvailable,
    start_time: startTime,
    end_time: endTime,
    reason
  });
  return await exceptionRepo.save(exception);
}

export async function getScheduleExceptions(organizationId: string, startDate: string | Date, endDate: string | Date): Promise<ScheduleException[]> {
  return await exceptionRepo.find({
    where: {
      organization: { id: organizationId },
      specific_date: Between(startDate, endDate)
    }
  });
}
