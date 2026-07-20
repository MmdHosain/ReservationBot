// src/features/manager/inbox/services/inbox.service.ts
import * as repository from "../repositories/inbox.repository.ts";
import type { InboxMessage } from "../types/inbox.types.ts";
import { AppDataSource } from "../../../../db/orm.config.ts";
import { InboxMessageV2 } from "../../../../db/entities/InboxMessageV2.ts";

export const fetchUnreadInbox = async (orgId: string): Promise<InboxMessage[]> => {
  const messages = await repository.getUnreadMessages(orgId);
  return messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const fetchArchivedInbox = async (orgId: string): Promise<InboxMessage[]> => {
  const messages = await repository.getArchivedMessages(orgId);
  return messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const processReadMessage = async (id: string, orgId: string): Promise<InboxMessage | null> => {
  const msg = await repository.getMessageById(id, orgId);
  if (msg) {
    await repository.markCustomerMessagesAsRead(orgId, msg.customerTelegramId);
    return msg;
  }
  return null;
};

export const getMessage = async (id: string, orgId: string): Promise<InboxMessage | null> => {
  return await repository.getMessageById(id, orgId);
};

export const fetchConversation = async (orgId: string, customerTelegramId: string | number): Promise<InboxMessage[]> => {
  return await repository.getConversation(orgId, customerTelegramId, 10);
};

export const saveSalonReply = async (orgId: string, customerTelegramId: number | string, salonName: string, content: string) => {
  const repo = AppDataSource.getRepository(InboxMessageV2);
  const user: any = await AppDataSource.getRepository("users_unified").findOneBy({ telegram_id: Number(customerTelegramId) });
  if (user) {
    const msg = repo.create({
      organization: { id: orgId },
      customer: { id: user.id },
      sender_name: salonName,
      content,
      sender_type: 'salon',
      is_read: true
    });
    await repo.save(msg);
  }
};
