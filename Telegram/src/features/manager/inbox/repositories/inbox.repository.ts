// src/features/manager/inbox/repositories/inbox.repository.ts
import { AppDataSource } from "../../../../db/orm.config.ts";
import { InboxMessageV2 } from "../../../../db/entities/InboxMessageV2.ts";
import type { InboxMessage } from "../types/inbox.types.ts";

const repo = AppDataSource.getRepository(InboxMessageV2);

export const getUnreadMessages = async (orgId: string): Promise<InboxMessage[]> => {
  const res = await repo.createQueryBuilder("msg")
    .innerJoinAndSelect("msg.customer", "c")
    .where("msg.organization_id = :orgId", { orgId })
    .andWhere("msg.is_read = false")
    .andWhere("(msg.sender_type = 'customer' OR msg.sender_type IS NULL)")
    .orderBy("c.telegram_id", "ASC")
    .addOrderBy("msg.created_at", "DESC")
    .getMany();

  const uniqueMap = new Map<number, any>();
  for (const row of res) {
    if (!uniqueMap.has(row.customer.telegram_id)) {
      uniqueMap.set(row.customer.telegram_id, row);
    }
  }

  return Array.from(uniqueMap.values()).map((row) => ({
    id: row.id,
    customerTelegramId: row.customer.telegram_id,
    senderName: row.sender_name || "Unknown",
    content: row.content,
    isRead: row.is_read,
    createdAt: row.created_at,
    senderType: row.sender_type || "customer",
  }));
};

export const getArchivedMessages = async (orgId: string): Promise<InboxMessage[]> => {
  const res = await repo.createQueryBuilder("msg")
    .innerJoinAndSelect("msg.customer", "c")
    .where("msg.organization_id = :orgId", { orgId })
    .andWhere("msg.is_read = true")
    .andWhere("(msg.sender_type = 'customer' OR msg.sender_type IS NULL)")
    .orderBy("c.telegram_id", "ASC")
    .addOrderBy("msg.created_at", "DESC")
    .limit(50)
    .getMany();

  const uniqueMap = new Map<number, any>();
  for (const row of res) {
    if (!uniqueMap.has(row.customer.telegram_id)) {
      uniqueMap.set(row.customer.telegram_id, row);
    }
  }

  return Array.from(uniqueMap.values()).map((row) => ({
    id: row.id,
    customerTelegramId: row.customer.telegram_id,
    senderName: row.sender_name || "Unknown",
    content: row.content,
    isRead: row.is_read,
    createdAt: row.created_at,
    senderType: row.sender_type || "customer",
  }));
};

export const markCustomerMessagesAsRead = async (orgId: string, customerTelegramId: string | number): Promise<boolean> => {
  await repo.createQueryBuilder()
    .update()
    .set({ is_read: true })
    .where("organization_id = :orgId", { orgId })
    .andWhere("customer_id IN (SELECT id FROM users_unified WHERE telegram_id = :telegramId)", { telegramId: Number(customerTelegramId) })
    .execute();
  return true;
};

export const getMessageById = async (id: string, orgId: string): Promise<InboxMessage | null> => {
  const row = await repo.findOne({ where: { id, organization: { id: orgId } }, relations: ["customer"] });
  if (!row) return null;
  return {
    id: row.id,
    customerTelegramId: row.customer.telegram_id,
    senderName: row.sender_name || "Unknown",
    content: row.content,
    isRead: row.is_read,
    createdAt: row.created_at,
    senderType: row.sender_type || "customer",
  };
};

export const getConversation = async (orgId: string, customerTelegramId: string | number, limit: number = 10): Promise<InboxMessage[]> => {
  const res = await repo.createQueryBuilder("msg")
    .innerJoinAndSelect("msg.customer", "c")
    .where("msg.organization_id = :orgId", { orgId })
    .andWhere("c.telegram_id = :telegramId", { telegramId: Number(customerTelegramId) })
    .orderBy("msg.created_at", "DESC")
    .take(limit)
    .getMany();
    
  return res.map((row) => ({
    id: row.id,
    customerTelegramId: row.customer.telegram_id,
    senderName: row.sender_name || "Unknown",
    content: row.content,
    isRead: row.is_read,
    createdAt: row.created_at,
    senderType: row.sender_type || "customer",
  })).reverse();
};
