import { AppDataSource } from "./orm.config.ts";
import { User } from "./entities/User.ts";

const userRepo = AppDataSource.getRepository(User);

export async function createUser(
  fullName: string,
  telegramId?: number,
  instagramId?: string,
  email?: string,
  phone?: string,
  baleId?: number
): Promise<User> {
  const user = userRepo.create({
    full_name: fullName,
    telegram_id: telegramId,
    instagram_id: instagramId,
    bale_id: baleId,
    email,
    phone
  });
  return await userRepo.save(user);
}

export async function getUserByBaleId(baleId: number): Promise<User | null> {
  return await userRepo.findOneBy({ bale_id: baleId });
}

export async function getUserByTelegramId(telegramId: number): Promise<User | null> {
  return await userRepo.findOneBy({ telegram_id: telegramId });
}

export async function getUserByInstagramId(instagramId: string): Promise<User | null> {
  return await userRepo.findOneBy({ instagram_id: instagramId });
}

export async function getUserById(id: string): Promise<User | null> {
  return await userRepo.findOneBy({ id });
}

export async function getOrCreateUserByBaleId(baleId: number, fullName: string = 'Unknown'): Promise<User> {
  let user = await getUserByBaleId(baleId);
  if (!user) {
    user = await createUser(fullName, undefined, undefined, undefined, undefined, baleId);
  }
  return user;
}

export async function getOrCreateUserByTelegramId(telegramId: number, fullName: string = 'Unknown'): Promise<User> {
  let user = await getUserByTelegramId(telegramId);
  if (!user) {
    user = await createUser(fullName, telegramId);
  }
  return user;
}
