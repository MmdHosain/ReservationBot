import { pool } from "./pool.ts";
import type { EventType, UserEventType } from "./types.ts";

export async function createEventType(organizationId: string, name: string, durationMinutes: number, bufferMinutes: number = 0): Promise<EventType> {
  const res = await pool.query(
    `INSERT INTO event_types (organization_id, name, duration_minutes, buffer_minutes) VALUES ($1, $2, $3, $4) RETURNING *`,
    [organizationId, name, durationMinutes, bufferMinutes]
  );
  return res.rows[0];
}

export async function getEventTypeById(id: string): Promise<EventType | null> {
  const res = await pool.query(`SELECT * FROM event_types WHERE id = $1`, [id]);
  return res.rows[0] || null;
}

export async function getEventTypesByOrganization(organizationId: string): Promise<EventType[]> {
  const res = await pool.query(`SELECT * FROM event_types WHERE organization_id = $1 AND is_active = true`, [organizationId]);
  return res.rows;
}

export async function linkUserToEventType(userId: string, eventTypeId: string): Promise<UserEventType> {
  const res = await pool.query(
    `INSERT INTO user_event_types (user_id, event_type_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`,
    [userId, eventTypeId]
  );
  return res.rows[0];
}

export async function getEventTypesForUser(userId: string): Promise<EventType[]> {
  const res = await pool.query(
    `SELECT et.* FROM event_types et
     JOIN user_event_types uet ON et.id = uet.event_type_id
     WHERE uet.user_id = $1 AND et.is_active = true`,
    [userId]
  );
  return res.rows;
}
