import type { InboxMessage } from "../types/inbox.types.ts";

// Mock data for initial development
const mockMessages: InboxMessage[] = [
  {
    id: "msg_1",
    senderName: "Customer Support",
    content: "A new appointment request needs your approval.",
    isRead: false,
    createdAt: new Date(),
  },
  {
    id: "msg_2",
    senderName: "System",
    content: "Weekly revenue report has been generated successfully.",
    isRead: false,
    createdAt: new Date(Date.now() - 86400000),
  },
];

export const getUnreadMessages = async (): Promise<InboxMessage[]> => {
  // Simulating DB delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMessages.filter((m) => !m.isRead));
    }, 100);
  });
};

export const markAsRead = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const msg = mockMessages.find((m) => m.id === id);
      if (msg) {
        msg.isRead = true;
        resolve(true);
      } else {
        resolve(false);
      }
    }, 100);
  });
};
