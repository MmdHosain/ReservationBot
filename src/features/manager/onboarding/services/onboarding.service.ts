// src/features/manager/onboarding/services/onboarding.service.ts
import { getOrCreateUser, markUserOnboarded, updateSalonName, startFreeTrial } from "../../../../db/user.repository.ts";
import { saveService } from "../../../../db/service.repository.ts";
import { getCategoriesByOrgId } from "../../../../db/category.repository.ts";

// V2 Imports
import { AppDataSource } from "../../../../db/orm.config.ts";
import { Organization } from "../../../../db/entities/Organization.ts";
import { getOrCreateUserByTelegramId } from "../../../../db/user_v2.repository.ts";
import { createOrganization, addOrganizationMember, getOrganizationByTelegramId } from "../../../../db/organization.repository.ts";
import { createEventType, linkUserToEventType } from "../../../../db/event_type.repository.ts";
import { createSchedule, createScheduleRule } from "../../../../db/schedule.repository.ts";
import { UserOrgRole } from "../../../../db/types.ts";

export const checkUserStatus = async (telegramId: number) => {
  const user = await getOrCreateUser(telegramId);
  return { isNewUser: !user.onboarded_at, hasSalonName: !!user.salon_name, userId: user.id };
};

export const getUserCategories = async (telegramId: number) => {
  const org = await getOrganizationByTelegramId(telegramId);
  if (!org) return [];
  return await getCategoriesByOrgId(org.id);
};

export const createService = async (telegramId: number, name: string, duration: number, days: string[], categoryId?: string | null) => {
  const org = await getOrganizationByTelegramId(telegramId);
  if (org) {
    await saveService(org.id, { name, duration, categoryId });
  }
};

export const registerSalon = async (userId: number, salonName: string, telegramId: number, fullName: string, draft: any) => {
  // V1 Flow
  await updateSalonName(userId, salonName);
  await markUserOnboarded(userId);
  await startFreeTrial(userId, 14); // 14 days free trial

  try {
    // V2 Flow (Migration Dual Write)
    const v2User = await getOrCreateUserByTelegramId(telegramId, fullName);
    const org = await createOrganization(salonName);

    if (draft && draft.businessCategory) {
      await AppDataSource.getRepository(Organization).update(org.id, { business_category: draft.businessCategory });
    }

    await addOrganizationMember(org.id, v2User.id, UserOrgRole.ADMIN);

    if (draft && draft.serviceName && draft.duration) {
      const eventType = await createEventType(org.id, draft.serviceName, draft.duration);
      await linkUserToEventType(v2User.id, eventType.id);

      const schedule = await createSchedule(org.id, 'Default Schedule', new Date());
      
      const dayMap: Record<string, number> = {
        "یکشنبه": 0, "دوشنبه": 1, "سه‌شنبه": 2, "چهارشنبه": 3, "پنجشنبه": 4, "جمعه": 5, "شنبه": 6
      };
      
      if (draft.daysOfWeek) {
        for (const faDay of draft.daysOfWeek) {
          const dayNum = dayMap[faDay];
          if (dayNum !== undefined) {
             await createScheduleRule(schedule.id, dayNum, '09:00:00', '18:00:00');
          }
        }
      }
    }
  } catch (err) {
    console.error("❌ V2 Migration Error during onboarding:", err);
  }
};
