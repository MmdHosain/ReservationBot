// src/features/customer/booking/types/booking.types.ts
import { Context, Scenes } from "telegraf";

export interface BookingSession extends Scenes.SceneSessionData {
  salonId: string;
  salonName: string;
  category?: string;
  isManager?: boolean;
  targetCustomerId?: number;
  targetCustomerName?: string;
  viewingCategoryId?: string | 'root';
  serviceId?: string;
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
