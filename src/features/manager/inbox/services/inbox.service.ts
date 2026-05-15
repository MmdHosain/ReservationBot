// src/features/manager/inbox/services/inbox.service.ts
import * as repository from "../repositories/inbox.repository.ts";
import type { InboxMessage } from "../types/inbox.types.ts";

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
  const messages = await repository.getUnreadMessages(salonUserId);
  const msg = messages.find((m) => m.id === id);

  if (msg) {
    const success = await repository.markAsRead(id, salonUserId);
    if (success) return msg;
  }
  return null;
};

export const getMessage = async (
  id: string,
  salonUserId: number
): Promise<InboxMessage | null> => {
  return await repository.getMessageById(id, salonUserId);
};
