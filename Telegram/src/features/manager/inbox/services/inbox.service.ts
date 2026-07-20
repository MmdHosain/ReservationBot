// src/features/manager/inbox/services/inbox.service.ts
import * as repository from "../repositories/inbox.repository.ts";
import type { InboxMessage } from "../types/inbox.types.ts";
import { AppDataSource } from "../../../../db/orm.config.ts";
import { InboxMessage as InboxMessageEntity } from "../../../../db/entities/v1/index.ts";

export const fetchUnreadInbox = async (salonUserId: number): Promise<InboxMessage[]> => {
  const messages = await repository.getUnreadMessages(salonUserId);
  return messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const fetchArchivedInbox = async (salonUserId: number): Promise<InboxMessage[]> => {
  const messages = await repository.getArchivedMessages(salonUserId);
  return messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const processReadMessage = async (
  id: string,
  salonUserId: number
): Promise<InboxMessage | null> => {
  const msg = await repository.getMessageById(id, salonUserId);

  if (msg) {
    await repository.markCustomerMessagesAsRead(salonUserId, msg.customerTelegramId);
    return msg;
  }
  return null;
};

export const getMessage = async (
  id: string,
  salonUserId: number
): Promise<InboxMessage | null> => {
  return await repository.getMessageById(id, salonUserId);
};

export const fetchConversation = async (salonUserId: number, customerTelegramId: string | number): Promise<InboxMessage[]> => {
  return await repository.getConversation(salonUserId, customerTelegramId, 10);
};

export const saveSalonReply = async (salonUserId: number, customerTelegramId: number | string, salonName: string, content: string) => {
  const repo = AppDataSource.getRepository(InboxMessageEntity);
  const msg = repo.create({
    salon_user_id: salonUserId,
    customer_telegram_id: Number(customerTelegramId),
    sender_name: salonName,
    content,
    sender_type: 'salon',
    is_read: true
  });
  await repo.save(msg);
};
