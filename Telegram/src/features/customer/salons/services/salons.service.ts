// src/features/customer/salons/services/salons.service.ts
import {
  getCustomerSalons,
  removeCustomerSalon,
} from "../../../../db/user.repository.ts";
import { AppDataSource } from "../../../../db/orm.config.ts";
import { InboxMessageV2 } from "../../../../db/entities/InboxMessageV2.ts";

export const getSalons = async (telegramId: number) => {
  return await getCustomerSalons(telegramId);
};

export const removeSalon = async (telegramId: number, salonId: string) => {
  await removeCustomerSalon(telegramId, salonId);
};

export const sendMessageToSalon = async (
  salonId: string,
  customerTelegramId: number,
  senderName: string,
  content: string
) => {
  const repo = AppDataSource.getRepository(InboxMessageV2);
  const userRepo = AppDataSource.getRepository("users_unified");
  const user: any = await userRepo.findOneBy({ telegram_id: customerTelegramId });

  if (user) {
    const msg = repo.create({
      organization: { id: salonId },
      customer: { id: user.id },
      sender_name: senderName,
      content,
      sender_type: 'customer'
    });
    await repo.save(msg);
  }
};

export const getConversation = async (salonId: string, customerTelegramId: number, limit: number = 5) => {
  const repo = AppDataSource.getRepository(InboxMessageV2);
  const userRepo = AppDataSource.getRepository("users_unified");
  const user: any = await userRepo.findOneBy({ telegram_id: customerTelegramId });
  if (!user) return [];

  const res = await repo.find({
    where: {
      organization: { id: salonId },
      customer: { id: user.id }
    },
    order: { created_at: "DESC" },
    take: limit
  });
  
  return res.map(r => ({
    content: r.content,
    senderType: r.sender_type || 'customer',
    createdAt: r.created_at
  })).reverse();
};
