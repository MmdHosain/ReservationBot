// src/features/customer/salons/services/salons.service.ts
import {
  getCustomerSalons,
  removeCustomerSalon,
} from "../../../../db/user.repository.ts";
import { AppDataSource } from "../../../../db/orm.config.ts";
import { InboxMessage as InboxMessageEntity } from "../../../../db/entities/v1/index.ts";

export const getSalons = async (telegramId: number) => {
  return await getCustomerSalons(telegramId);
};

export const removeSalon = async (telegramId: number, salonUserId: number) => {
  await removeCustomerSalon(telegramId, salonUserId);
};

export const sendMessageToSalon = async (
  salonUserId: number,
  customerTelegramId: number,
  senderName: string,
  content: string
) => {
  const repo = AppDataSource.getRepository(InboxMessageEntity);
  const msg = repo.create({
    salon_user_id: salonUserId,
    customer_telegram_id: customerTelegramId,
    sender_name: senderName,
    content,
    sender_type: 'customer'
  });
  await repo.save(msg);
};

export const getConversation = async (salonUserId: number, customerTelegramId: number, limit: number = 5) => {
  const repo = AppDataSource.getRepository(InboxMessageEntity);
  const res = await repo.find({
    where: {
      salon_user_id: salonUserId,
      customer_telegram_id: customerTelegramId
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
