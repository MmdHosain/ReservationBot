import { AppDataSource } from "../../db/orm.config.ts";
import { getOrganizationByTelegramId } from "../../db/organization.repository.ts";
import { getSchedulesByOrganization, createScheduleRule } from "../../db/schedule.repository.ts";
import { getUserByTelegramId as getV1User } from "../../db/user.repository.ts";
import { getUserByTelegramId as getV2User } from "../../db/user_v2.repository.ts";
import { getServicesByUserId } from "../../db/service.repository.ts";
import { createEventType, linkUserToEventType } from "../../db/event_type.repository.ts";
import { EventType } from "../../db/entities/EventType.ts";
import { ScheduleRule } from "../../db/entities/ScheduleRule.ts";

/**
 * Bridges V1 data changes (Work Hours, Breaks, Services) to the new V2 DBML schema (Schedules, Event Types).
 * This guarantees dual-write consistency during the migration phase.
 */
export async function syncV2State(telegramId: number) {
    try {
        const org = await getOrganizationByTelegramId(telegramId);
        const v1User = await getV1User(telegramId);
        const v2User = await getV2User(telegramId);
        
        if (!org || !v1User || !v2User) return;

        // 1. Sync Event Types (Services)
        const v1Services = await getServicesByUserId(v1User.id);
        // Clear existing to recreate fresh sync
        await AppDataSource.getRepository(EventType).delete({ organization: { id: org.id } });
        for (const svc of v1Services) {
            const et = await createEventType(org.id, svc.name, svc.duration);
            await linkUserToEventType(v2User.id, et.id);
        }

        // 2. Sync Schedules & Rules (Working Hours & Breaks)
        const schedules = await getSchedulesByOrganization(org.id);
        if (schedules.length > 0) {
            const scheduleId = schedules[0].id;
            await AppDataSource.getRepository(ScheduleRule).delete({ schedule: { id: scheduleId } });

            const workingDaysFa = new Set<string>();
            v1Services.forEach((svc: any) => {
                try {
                    const days = JSON.parse(svc.days || "[]");
                    days.forEach((d: string) => workingDaysFa.add(d));
                } catch(e) {}
            });

            const dayMap: Record<string, number> = {
                "یکشنبه": 0, "دوشنبه": 1, "سه‌شنبه": 2, "چهارشنبه": 3, "پنجشنبه": 4, "جمعه": 5, "شنبه": 6
            };

            const wStart = v1User.work_start_time || '09:00';
            const wEnd = v1User.work_end_time || '18:00';
            const bStart = v1User.break_start_time;
            const bEnd = v1User.break_end_time;

            for (const faDay of Array.from(workingDaysFa)) {
                const dayNum = dayMap[faDay];
                if (dayNum !== undefined) {
                    if (bStart && bEnd) {
                        // Split into two blocks around the break time
                        await createScheduleRule(scheduleId, dayNum, `${wStart}:00`, `${bStart}:00`);
                        await createScheduleRule(scheduleId, dayNum, `${bEnd}:00`, `${wEnd}:00`);
                    } else {
                        // Continuous block
                        await createScheduleRule(scheduleId, dayNum, `${wStart}:00`, `${wEnd}:00`);
                    }
                }
            }
        }
    } catch(e) {
        console.error("❌ [V2 Sync] Failed to sync state for", telegramId, e);
    }
}
