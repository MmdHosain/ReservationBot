import { Context, Scenes } from "telegraf";

export interface InboxMessage {
  id: string;
  customerTelegramId: string | number;
  senderName: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

export interface InboxContext extends Context {
  scene: Scenes.SceneContextScene<InboxContext, Scenes.SceneSessionData>;
  match: RegExpExecArray;
}
