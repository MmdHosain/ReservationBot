import { AppDataSource } from "./orm.config.ts";
import { Organization } from "./entities/Organization.ts";
import { OrganizationMember } from "./entities/OrganizationMember.ts";
import { UserOrgRole } from "./types.ts";

const orgRepo = AppDataSource.getRepository(Organization);
const memberRepo = AppDataSource.getRepository(OrganizationMember);

export async function createOrganization(name: string, timezone: string = 'UTC'): Promise<Organization> {
  const org = orgRepo.create({ name, timezone });
  return await orgRepo.save(org);
}

export async function getOrganizationById(id: string): Promise<Organization | null> {
  return await orgRepo.findOneBy({ id });
}

export async function addOrganizationMember(organizationId: string, userId: string, role: UserOrgRole): Promise<OrganizationMember> {
  const member = memberRepo.create({
    organization: { id: organizationId },
    user: { id: userId },
    role
  });
  return await memberRepo.save(member);
}

export async function getOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
  return await memberRepo.find({
    where: { organization: { id: organizationId }, is_active: true },
    relations: ["user"]
  });
}

export async function getOrganizationsForUser(userId: string): Promise<(Organization & { role: UserOrgRole })[]> {
  const members = await memberRepo.find({
    where: { user: { id: userId }, is_active: true },
    relations: ["organization"]
  });
  
  return members.map(m => ({
    ...m.organization,
    role: m.role
  }));
}

export async function getOrganizationByTelegramId(platformId: number): Promise<Organization | null> {
  const member = await memberRepo.findOne({
    where: [
      { user: { telegram_id: platformId }, role: UserOrgRole.ADMIN },
      { user: { bale_id: platformId }, role: UserOrgRole.ADMIN }
    ],
    relations: ["organization"]
  });
  
  return member?.organization || null;
}

export async function getOrganizationByBaleId(baleId: number): Promise<Organization | null> {
  return await getOrganizationByTelegramId(baleId);
}

export async function getOrganizationByIGPageId(_pageId?: string): Promise<Organization | null> {
  return await orgRepo.findOne({ order: { created_at: "ASC" } });
}

