// src/features/customer/booking/types/booking.types.ts
import { Context, Scenes } from "telegraf";

export interface BookingSession extends Scenes.SceneSessionData {
  salonId: number;
  salonName: string;
  category?: string;
  isManager?: boolean;
  targetCustomerId?: number;
  targetCustomerName?: string;
  viewingCategoryId?: number | 'root';
  serviceId?: number;
  serviceName?: string;
  duration?: number;
  date?: string;
  time?: string;
  page?: number;
}

export interface BookingContext extends Context {
  session: Scenes.SceneSession<BookingSession>;
  scene: Scenes.SceneContextScene<BookingContext, BookingSession>;
  match: any;
}
