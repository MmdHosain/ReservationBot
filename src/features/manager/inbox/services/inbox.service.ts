import * as repository from "../repositories/inbox.repository.ts";
import type { InboxMessage } from "../types/inbox.types.ts";

export const fetchUnreadInbox = async (): Promise<InboxMessage[]> => {
  const messages = await repository.getUnreadMessages();
  return messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const processReadMessage = async (
  id: string
): Promise<InboxMessage | null> => {
  const messages = await repository.getUnreadMessages();
  const msg = messages.find((m) => m.id === id);

  if (msg) {
    const success = await repository.markAsRead(id);
    if (success) return msg;
  }
  return null;
};
