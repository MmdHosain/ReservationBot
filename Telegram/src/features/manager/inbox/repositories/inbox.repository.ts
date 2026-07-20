// src/features/manager/inbox/repositories/inbox.repository.ts
import { AppDataSource } from "../../../../db/orm.config.ts";
import { InboxMessage as InboxMessageEntity } from "../../../../db/entities/v1/index.ts";
import type { InboxMessage } from "../types/inbox.types.ts";

const repo = AppDataSource.getRepository(InboxMessageEntity);

export const getUnreadMessages = async (salonUserId: number): Promise<InboxMessage[]> => {
  const res = await repo.createQueryBuilder("msg")
    .where("msg.salon_user_id = :salonUserId", { salonUserId })
    .andWhere("msg.is_read = false")
    .andWhere("(msg.sender_type = 'customer' OR msg.sender_type IS NULL)")
    // Note: TypeORM doesn't natively support DISTINCT ON elegantly, using a subquery grouping as workaround if needed
    .orderBy("msg.customer_telegram_id", "ASC")
    .addOrderBy("msg.created_at", "DESC")
    .getMany();

  // Filter out duplicates manually in JS to mimic DISTINCT ON for simplicity
  const uniqueMap = new Map<number, any>();
  for (const row of res) {
    if (!uniqueMap.has(row.customer_telegram_id)) {
      uniqueMap.set(row.customer_telegram_id, row);
    }
  }

  return Array.from(uniqueMap.values()).map((row) => ({
    id: row.id.toString(),
    customerTelegramId: row.customer_telegram_id,
    senderName: row.sender_name || "Unknown",
    content: row.content,
    isRead: row.is_read,
    createdAt: row.created_at,
    senderType: row.sender_type || "customer",
  }));
};

export const getArchivedMessages = async (salonUserId: number): Promise<InboxMessage[]> => {
  const res = await repo.createQueryBuilder("msg")
    .where("msg.salon_user_id = :salonUserId", { salonUserId })
    .andWhere("msg.is_read = true")
    .andWhere("(msg.sender_type = 'customer' OR msg.sender_type IS NULL)")
    .orderBy("msg.customer_telegram_id", "ASC")
    .addOrderBy("msg.created_at", "DESC")
    .limit(50)
    .getMany();

  const uniqueMap = new Map<number, any>();
  for (const row of res) {
    if (!uniqueMap.has(row.customer_telegram_id)) {
      uniqueMap.set(row.customer_telegram_id, row);
    }
  }

  return Array.from(uniqueMap.values()).map((row) => ({
    id: row.id.toString(),
    customerTelegramId: row.customer_telegram_id,
    senderName: row.sender_name || "Unknown",
    content: row.content,
    isRead: row.is_read,
    createdAt: row.created_at,
    senderType: row.sender_type || "customer",
  }));
};

export const markCustomerMessagesAsRead = async (salonUserId: number, customerTelegramId: string | number): Promise<boolean> => {
  await repo.update({
    salon_user_id: salonUserId,
    customer_telegram_id: Number(customerTelegramId)
  }, { is_read: true });
  return true;
};

export const getMessageById = async (id: string, salonUserId: number): Promise<InboxMessage | null> => {
  const row = await repo.findOneBy({
    id: parseInt(id),
    salon_user_id: salonUserId
  });
  
  if (!row) return null;
  
  return {
    id: row.id.toString(),
    customerTelegramId: row.customer_telegram_id,
    senderName: row.sender_name || "Unknown",
    content: row.content,
    isRead: row.is_read,
    createdAt: row.created_at,
    senderType: row.sender_type || "customer",
  };
};

export const getConversation = async (salonUserId: number, customerTelegramId: string | number, limit: number = 10): Promise<InboxMessage[]> => {
  const res = await repo.find({
    where: {
        salon_user_id: salonUserId,
        customer_telegram_id: Number(customerTelegramId)
    },
    order: { created_at: "DESC" },
    take: limit
  });
  
  return res.map((row) => ({
    id: row.id.toString(),
    customerTelegramId: row.customer_telegram_id,
    senderName: row.sender_name || "Unknown",
    content: row.content,
    isRead: row.is_read,
    createdAt: row.created_at,
    senderType: row.sender_type || "customer",
  })).reverse();
};
