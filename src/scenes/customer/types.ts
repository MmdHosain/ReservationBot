// src/scenes/customer/types.ts
import { Context, Scenes } from "telegraf";

export interface BookingSession {
  ownerTelegramId?: number;
  serviceId?: number;
  serviceName?: string;
  duration?: number;
  date?: string;
  time?: string;
  staffId?: number;
}

export interface CustomerSession extends Scenes.SceneSessionData {
  booking: BookingSession;
}

export interface CustomerContext extends Context {
  session: Scenes.SceneSession<CustomerSession>;
  scene: Scenes.SceneContextScene<CustomerContext, CustomerSession>;
}
