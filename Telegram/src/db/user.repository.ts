// src/db/user.repository.ts
import { AppDataSource } from "./orm.config.ts";
import { V1User, CustomerSalon } from "./entities/v1/index.ts";
import { MESSAGES } from "../core/messages.ts";

const userRepo = AppDataSource.getRepository(V1User);
const customerSalonRepo = AppDataSource.getRepository(CustomerSalon);

export async function getOrCreateUser(telegramId: number) {
  let user = await userRepo.findOneBy({ telegram_id: telegramId });
  if (!user) {
    user = userRepo.create({ telegram_id: telegramId });
    await userRepo.save(user);
  }
  return user;
}

export async function getUserByTelegramId(telegramId: number) {
  return await userRepo.findOneBy({ telegram_id: telegramId });
}

export async function getUserById(id: number) {
  return await userRepo.findOneBy({ id });
}

export async function markUserOnboarded(userId: number) {
  await userRepo.update(userId, { onboarded_at: new Date() });
}

export async function updateSalonName(userId: number, salonName: string) {
  await userRepo.update(userId, { salon_name: salonName });
}

export async function updateCalendarType(telegramId: number, type: "shamsi" | "miladi") {
  await userRepo.update({ telegram_id: telegramId }, { calendar_type: type });
}

export async function deleteUserByTelegramId(telegramId: number) {
  return await AppDataSource.transaction(async (manager) => {
    const user = await manager.findOneBy(V1User, { telegram_id: telegramId });
    if (!user) {
      return { success: false, message: MESSAGES.userNotFound };
    }
    await manager.query("DELETE FROM services WHERE user_id = $1", [user.id]);
    await manager.delete(V1User, user.id);
    return { success: true, message: MESSAGES.userDeleted(telegramId) };
  });
}

export async function addCustomerSalon(customerTelegramId: number, salonUserId: number) {
  const salonUser = await getUserById(salonUserId);
  if (!salonUser) return;
  
  const existing = await customerSalonRepo.findOneBy({
    customer_telegram_id: customerTelegramId,
    salon_user_id: salonUserId
  });
  
  if (!existing) {
    const cs = customerSalonRepo.create({
      customer_telegram_id: customerTelegramId,
      salon_user_id: salonUserId
    });
    await customerSalonRepo.save(cs);
  }
}

export async function getCustomerSalons(customerTelegramId: number) {
  const query = customerSalonRepo.createQueryBuilder("cs")
    .innerJoin(V1User, "u", "cs.salon_user_id = u.id")
    .select([
      "cs.id AS id", 
      "u.salon_name AS salon_name", 
      "u.telegram_id AS salon_telegram_id", 
      "cs.salon_user_id AS salon_user_id"
    ])
    .where("cs.customer_telegram_id = :telegramId", { telegramId: customerTelegramId });
    
  return await query.getRawMany();
}

export async function removeCustomerSalon(customerTelegramId: number, salonUserId: number) {
  await customerSalonRepo.delete({
    customer_telegram_id: customerTelegramId,
    salon_user_id: salonUserId
  });
}

export async function updateWorkHours(telegramId: number, start: string, end: string) {
  await userRepo.update({ telegram_id: telegramId }, { work_start_time: start, work_end_time: end });
}

export async function updateBreakHours(telegramId: number, start: string, end: string) {
  await userRepo.update({ telegram_id: telegramId }, { break_start_time: start, break_end_time: end });
}

export async function removeBreakHours(telegramId: number) {
  await userRepo.update({ telegram_id: telegramId }, { break_start_time: null as any, break_end_time: null as any });
}

export async function updateDeposit(telegramId: number, amount: number) {
  await userRepo.update({ telegram_id: telegramId }, { deposit_amount: amount });
}

export async function startFreeTrial(userId: number, days: number) {
  await userRepo.query(`UPDATE users SET subscription_expires_at = NOW() + INTERVAL '${days} days' WHERE id = $1`, [userId]);
}

export async function renewSubscription(userId: number, days: number) {
  await userRepo.query(`UPDATE users SET subscription_expires_at = GREATEST(NOW(), COALESCE(subscription_expires_at, NOW())) + INTERVAL '${days} days' WHERE id = $1`, [userId]);
}
