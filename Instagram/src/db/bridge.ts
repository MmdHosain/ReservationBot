// Instagram/src/db/bridge.ts
// This file bridges the Instagram module to the shared PostgreSQL database initialized in Telegram/src/db

import { AppDataSource } from "../../../Telegram/src/db/orm.config.ts";
import { getUserByInstagramId, createUser } from "../../../Telegram/src/db/user_v2.repository.ts";
import { createEvent, addEventParticipant, getEventsByOrganization } from "../../../Telegram/src/db/event.repository.ts";
import { getEventTypesByOrganization, getEventTypeById } from "../../../Telegram/src/db/event_type.repository.ts";
import { getSchedulesByOrganization, getScheduleRules, getScheduleExceptions } from "../../../Telegram/src/db/schedule.repository.ts";
import { Organization } from "../../../Telegram/src/db/entities/Organization.ts";

/**
 * Fetches a user by their Instagram ID, creating them in the V2 schema if they don't exist.
 */
export const getOrCreateIGUser = async (igId: string, fullName: string = 'IG User') => {
  let user = await getUserByInstagramId(igId);
  if (!user) {
    user = await createUser(fullName, undefined, igId);
  }
  return user;
};

/**
 * Fetches the organization associated with the IG Page token or account.
 * Note: In a fully multi-tenant IG bot, we'd map IG Page ID to organization_id.
 * For now, returning a default organization for the single-tenant setup.
 */
export const getOrganizationByIGPageId = async (pageId: string) => {
  const repo = AppDataSource.getRepository(Organization);
  return await repo.findOne({ order: { created_at: "ASC" } }); // Quick mock to get the main org
};

// Re-export common functions from the Telegram repositories so Instagram logic doesn't have deep imports
export {
  createEvent,
  addEventParticipant,
  getEventTypesByOrganization,
  getEventTypeById,
  getSchedulesByOrganization,
  getScheduleRules,
  getScheduleExceptions,
  getEventsByOrganization
};
