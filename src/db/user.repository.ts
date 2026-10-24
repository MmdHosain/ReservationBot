// src/db/user.repository.ts
import { AppDataSource } from "./orm.config.ts";
import { User } from "./entities/User.ts";
import { Organization } from "./entities/Organization.ts";
import { OrganizationMember } from "./entities/OrganizationMember.ts";
import { UserOrgRole } from "./types.ts";

const userRepo = AppDataSource.getRepository(User);
const orgRepo = AppDataSource.getRepository(Organization);
const memberRepo = AppDataSource.getRepository(OrganizationMember);

export type PlatformType = 'bale' | 'telegram' | 'instagram';

export async function getOrCreatePlatformUser(
  platform: PlatformType,
  platformId: string | number,
  fullName: string = 'کاربر'
): Promise<User> {
  let user: User | null = null;
  if (platform === 'bale') {
    const numId = Number(platformId);
    user = await userRepo.findOne({
      where: [{ bale_id: numId }, { telegram_id: numId }]
    });
  } else if (platform === 'telegram') {
    const numId = Number(platformId);
    user = await userRepo.findOne({
      where: [{ telegram_id: numId }, { bale_id: numId }]
    });
  } else if (platform === 'instagram') {
    user = await userRepo.findOneBy({ instagram_id: String(platformId) });
  }

  if (!user) {
    user = userRepo.create({
      full_name: fullName,
      ...(platform === 'bale' && { bale_id: Number(platformId) }),
      ...(platform === 'telegram' && { telegram_id: Number(platformId) }),
      ...(platform === 'instagram' && { instagram_id: String(platformId) }),
    });
    await userRepo.save(user);
  }
  return user;
}

export async function getOrCreateIGUser(igId: string, fullName: string = 'کاربر اینستاگرام'): Promise<User> {
  return await getOrCreatePlatformUser('instagram', igId, fullName);
}

export async function getOrCreateUser(platformId: number, platform: 'bale' | 'telegram' = 'bale') {
  // Try platform-specific match first
  let user = await (platform === 'bale' 
    ? userRepo.findOneBy({ bale_id: platformId }) 
    : userRepo.findOneBy({ telegram_id: platformId }));

  // Fallback check to avoid duplicate if previously stored in the other field
  if (!user) {
    user = await userRepo.findOne({
      where: [
        { bale_id: platformId },
        { telegram_id: platformId }
      ]
    });
  }

  if (!user) {
    user = userRepo.create({
      full_name: 'کاربر جدید',
      ...(platform === 'bale' ? { bale_id: platformId } : { telegram_id: platformId }),
    });
    await userRepo.save(user);
  }
  return user;
}

export async function getUserByBaleId(baleId: number) {
  let user = await userRepo.findOneBy({ bale_id: baleId });
  if (!user) {
    user = await userRepo.findOneBy({ telegram_id: baleId });
  }
  return user;
}

export async function getUserByTelegramId(telegramId: number) {
  let user = await userRepo.findOneBy({ telegram_id: telegramId });
  if (!user) {
    user = await userRepo.findOneBy({ bale_id: telegramId });
  }
  return user;
}

export async function getUserById(id: string) {
  return await userRepo.findOneBy({ id });
}

export async function getOrganizationByAdminTelegramId(telegramId: number) {
  const member = await memberRepo.findOne({
    where: [
      { user: { telegram_id: telegramId }, role: UserOrgRole.ADMIN },
      { user: { bale_id: telegramId }, role: UserOrgRole.ADMIN }
    ],
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

export async function updateCalendarType(platformId: number, type: "shamsi" | "miladi") {
  const user = await getUserByTelegramId(platformId);
  if (user) {
    await userRepo.update(user.id, { calendar_type: type });
  }
}

export async function deleteUserByTelegramId(platformId: number) {
  return await AppDataSource.transaction(async (manager) => {
    const user = await manager.findOne(User, {
      where: [
        { telegram_id: platformId },
        { bale_id: platformId }
      ]
    });
    if (!user) {
      return { success: false, message: "کاربر یافت نشد." };
    }
    await manager.delete(User, user.id);
    return { success: true, message: `کاربر با شناسه ${platformId} و تمام داده‌های مرتبط حذف شد.` };
  });
}

export async function addCustomerSalon(customerPlatformId: number, orgId: string, platform: 'bale' | 'telegram' = 'bale') {
  const user = await getOrCreateUser(customerPlatformId, platform);
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

export async function getCustomerSalons(customerPlatformId: number) {
  const user = await getUserByTelegramId(customerPlatformId);
  if (!user) return [];

  const query = memberRepo.createQueryBuilder("m")
    .innerJoin("m.organization", "o")
    .innerJoin("m.user", "u")
    .select([
      "o.id AS salon_user_id", 
      "o.name AS salon_name",
      "(SELECT COALESCE(u2.bale_id, u2.telegram_id) FROM organization_members m2 INNER JOIN users_unified u2 ON m2.user_id = u2.id WHERE m2.organization_id = o.id AND m2.role = 'admin' LIMIT 1) AS salon_telegram_id"
    ])
    .where("u.id = :userId", { userId: user.id })
    .andWhere("m.role = :role", { role: UserOrgRole.CLIENT });
    
  return await query.getRawMany();
}

export async function removeCustomerSalon(customerPlatformId: number, orgId: string) {
  const user = await getUserByTelegramId(customerPlatformId);
  if (!user) return;
  await memberRepo.delete({
    user: { id: user.id },
    organization: { id: orgId },
    role: UserOrgRole.CLIENT
  });
}

export async function updateDeposit(platformId: number, amount: number) {
  const org = await getOrganizationByAdminTelegramId(platformId);
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
