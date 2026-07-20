import { pool } from "./pool.ts";
import type { Resource, EventResource } from "./types.ts";

export async function createResource(organizationId: string, name: string, resourceType?: string): Promise<Resource> {
  const res = await pool.query(
    `INSERT INTO resources (organization_id, name, resource_type) VALUES ($1, $2, $3) RETURNING *`,
    [organizationId, name, resourceType || null]
  );
  return res.rows[0];
}

export async function getResourcesByOrganization(organizationId: string): Promise<Resource[]> {
  const res = await pool.query(`SELECT * FROM resources WHERE organization_id = $1 AND is_active = true`, [organizationId]);
  return res.rows;
}

export async function linkResourceToEvent(eventId: string, resourceId: string): Promise<EventResource> {
  const res = await pool.query(
    `INSERT INTO event_resources (event_id, resource_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`,
    [eventId, resourceId]
  );
  return res.rows[0];
}
