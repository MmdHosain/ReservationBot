import { pool } from "./pool.ts";
import type { Event, EventParticipant, BookingMode, EventStatus, ParticipantRole } from "./types.ts";

export async function createEvent(
  organizationId: string,
  eventDate: string | Date,
  eventTypeId?: string,
  title?: string,
  bookingMode: BookingMode = 'scheduled' as BookingMode,
  status: EventStatus = 'pending' as EventStatus,
  plannedStartTime?: string | Date,
  plannedEndTime?: string | Date
): Promise<Event> {
  const res = await pool.query(
    `INSERT INTO events (organization_id, event_type_id, title, event_date, booking_mode, status, planned_start_time, planned_end_time) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [organizationId, eventTypeId || null, title || null, eventDate, bookingMode, status, plannedStartTime || null, plannedEndTime || null]
  );
  return res.rows[0];
}

export async function addEventParticipant(eventId: string, userId: string, role: ParticipantRole): Promise<EventParticipant> {
  const res = await pool.query(
    `INSERT INTO event_participants (event_id, user_id, role) VALUES ($1, $2, $3) RETURNING *`,
    [eventId, userId, role]
  );
  return res.rows[0];
}

export async function getEventsByOrganization(organizationId: string, fromDate: string | Date, toDate: string | Date): Promise<Event[]> {
  const res = await pool.query(
    `SELECT * FROM events WHERE organization_id = $1 AND event_date >= $2 AND event_date <= $3 ORDER BY event_date, planned_start_time`,
    [organizationId, fromDate, toDate]
  );
  return res.rows;
}

export async function getEventsForUser(userId: string, role?: ParticipantRole): Promise<Event[]> {
  let query = `
    SELECT e.* FROM events e
    JOIN event_participants ep ON e.id = ep.event_id
    WHERE ep.user_id = $1
  `;
  const params: any[] = [userId];
  if (role) {
    query += ` AND ep.role = $2`;
    params.push(role);
  }
  query += ` ORDER BY e.event_date, e.planned_start_time`;
  
  const res = await pool.query(query, params);
  return res.rows;
}

export async function updateEventStatus(eventId: string, status: EventStatus): Promise<Event> {
  const res = await pool.query(
    `UPDATE events SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, eventId]
  );
  return res.rows[0];
}
