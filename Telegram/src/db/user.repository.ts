// src/db/user.repository.ts
import { AppDataSource } from "./orm.config.ts";
import { User } from "./entities/User.ts";
import { Organization } from "./entities/Organization.ts";
import { OrganizationMember } from "./entities/OrganizationMember.ts";
import { UserOrgRole } from "./types.ts";

const userRepo = AppDataSource.getRepository(User);
const orgRepo = AppDataSource.getRepository(Organization);
const memberRepo = AppDataSource.getRepository(OrganizationMember);

export async function getOrCreateUser(telegramId: number) {
  let user = await userRepo.findOneBy({ telegram_id: telegramId });
  if (!user) {
    user = userRepo.create({ telegram_id: telegramId, full_name: 'کاربر جدید' });
    await userRepo.save(user);
  }
  return user;
}

export async function getUserByTelegramId(telegramId: number) {
  return await userRepo.findOneBy({ telegram_id: telegramId });
}

export async function getUserById(id: string) {
  return await userRepo.findOneBy({ id });
}

export async function getOrganizationByAdminTelegramId(telegramId: number) {
  const member = await memberRepo.findOne({
    where: { user: { telegram_id: telegramId }, role: UserOrgRole.ADMIN },
    relations: ["organization"]
  });
  return member?.organization || null;
}

export async function markUserOnboarded(userId: string) {
  const member = await memberRepo.findOne({ where: { user: { id: userId }, role: UserOrgRole.ADMIN }, relations: ["organization"] });
  if (member && member.organization) {
    await orgRepo.update(member.organization.id, { onboarded_at: new Date() });
  }
}

export async function updateSalonName(userId: string, salonName: string) {
  const member = await memberRepo.findOne({ where: { user: { id: userId }, role: UserOrgRole.ADMIN }, relations: ["organization"] });
  if (member && member.organization) {
    await orgRepo.update(member.organization.id, { name: salonName });
  }
}

export async function updateCalendarType(telegramId: number, type: "shamsi" | "miladi") {
  await userRepo.update({ telegram_id: telegramId }, { calendar_type: type });
}

export async function deleteUserByTelegramId(telegramId: number) {
  return await AppDataSource.transaction(async (manager) => {
    const user = await manager.findOneBy(User, { telegram_id: telegramId });
    if (!user) {
      return { success: false, message: "کاربر یافت نشد." };
    }
    await manager.delete(User, user.id);
    return { success: true, message: `کاربر با ID تلگرام ${telegramId} و تمام داده‌های مرتبط حذف شد.` };
  });
}

export async function addCustomerSalon(customerTelegramId: number, orgId: string) {
  const user = await getOrCreateUser(customerTelegramId);
  const existing = await memberRepo.findOneBy({
    user: { id: user.id },
    organization: { id: orgId },
    role: UserOrgRole.CLIENT
  });
  if (!existing) {
    const member = memberRepo.create({
      user: { id: user.id },
      organization: { id: orgId },
      role: UserOrgRole.CLIENT
    });
    await memberRepo.save(member);
  }
}

export async function getCustomerSalons(customerTelegramId: number) {
  const query = memberRepo.createQueryBuilder("m")
    .innerJoin("m.organization", "o")
    .innerJoin("m.user", "u")
    .select([
      "o.id AS salon_user_id", 
      "o.name AS salon_name",
      "(SELECT u2.telegram_id FROM organization_members m2 INNER JOIN users_unified u2 ON m2.user_id = u2.id WHERE m2.organization_id = o.id AND m2.role = 'admin' LIMIT 1) AS salon_telegram_id"
    ])
    .where("u.telegram_id = :telegramId", { telegramId: customerTelegramId })
    .andWhere("m.role = :role", { role: UserOrgRole.CLIENT });
    
  return await query.getRawMany();
}

export async function removeCustomerSalon(customerTelegramId: number, orgId: string) {
  const user = await getUserByTelegramId(customerTelegramId);
  if (!user) return;
  await memberRepo.delete({
    user: { id: user.id },
    organization: { id: orgId },
    role: UserOrgRole.CLIENT
  });
}

export async function updateDeposit(telegramId: number, amount: number) {
  const org = await getOrganizationByAdminTelegramId(telegramId);
  if (org) {
    await orgRepo.update(org.id, { deposit_amount: amount });
  }
}

export async function startFreeTrial(userId: string, days: number) {
  const member = await memberRepo.findOne({ where: { user: { id: userId }, role: UserOrgRole.ADMIN }, relations: ["organization"] });
  if (member && member.organization) {
    await orgRepo.query(`UPDATE organizations SET subscription_expires_at = NOW() + INTERVAL '${days} days' WHERE id = $1`, [member.organization.id]);
  }
}

export async function renewSubscription(userId: string, days: number) {
  const member = await memberRepo.findOne({ where: { user: { id: userId }, role: UserOrgRole.ADMIN }, relations: ["organization"] });
  if (member && member.organization) {
    await orgRepo.query(`UPDATE organizations SET subscription_expires_at = GREATEST(NOW(), COALESCE(subscription_expires_at, NOW())) + INTERVAL '${days} days' WHERE id = $1`, [member.organization.id]);
  }
}
