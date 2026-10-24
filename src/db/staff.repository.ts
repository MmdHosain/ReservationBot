// src/db/staff.repository.ts
import { AppDataSource } from "./orm.config.ts";
import { OrganizationMember } from "./entities/OrganizationMember.ts";
import { User } from "./entities/User.ts";
import { UserOrgRole } from "./types.ts";

const memberRepo = AppDataSource.getRepository(OrganizationMember);
const userRepo = AppDataSource.getRepository(User);

export async function getStaffByOrgId(orgId: string) {
  const members = await memberRepo.find({
    where: { organization: { id: orgId }, role: UserOrgRole.PROVIDER, is_active: true },
    relations: ["user"]
  });
  return members.map(m => ({ id: m.id, name: m.user.full_name }));
}

export async function addStaff(orgId: string, name: string) {
  let user = userRepo.create({ full_name: name });
  user = await userRepo.save(user);
  
  const member = memberRepo.create({
    organization: { id: orgId },
    user: { id: user.id },
    role: UserOrgRole.PROVIDER
  });
  await memberRepo.save(member);
}

export async function deleteStaff(memberId: string) {
  await memberRepo.update(memberId, { is_active: false });
}
