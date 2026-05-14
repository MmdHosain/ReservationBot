export interface InboxMessage {
  id: string;
  senderName: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}
