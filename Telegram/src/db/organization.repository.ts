import { pool } from "./pool.ts";
import type { Organization, OrganizationMember, UserOrgRole } from "./types.ts";

export async function createOrganization(name: string, timezone: string = 'UTC'): Promise<Organization> {
  const res = await pool.query(
    `INSERT INTO organizations (name, timezone) VALUES ($1, $2) RETURNING *`,
    [name, timezone]
  );
  return res.rows[0];
}

export async function getOrganizationById(id: string): Promise<Organization> {
  const res = await pool.query(`SELECT * FROM organizations WHERE id = $1`, [id]);
  return res.rows[0];
}

export async function addOrganizationMember(organizationId: string, userId: string, role: UserOrgRole): Promise<OrganizationMember> {
  const res = await pool.query(
    `INSERT INTO organization_members (organization_id, user_id, role) VALUES ($1, $2, $3) RETURNING *`,
    [organizationId, userId, role]
  );
  return res.rows[0];
}

export async function getOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
  const res = await pool.query(`SELECT * FROM organization_members WHERE organization_id = $1 AND is_active = true`, [organizationId]);
  return res.rows;
}

export async function getOrganizationsForUser(userId: string): Promise<(Organization & { role: UserOrgRole })[]> {
  const res = await pool.query(
    `SELECT o.*, om.role 
     FROM organizations o 
     JOIN organization_members om ON o.id = om.organization_id 
     WHERE om.user_id = $1 AND om.is_active = true`,
    [userId]
  );
  return res.rows;
}
