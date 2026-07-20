// src/features/manager/services/types/services.types.ts
import { Context, Scenes } from "telegraf";
export interface ServicesSession extends Scenes.SceneSessionData {
  serviceId?: string;
  action?: string;
  orgId?: string;
}
export interface ServicesContext extends Context {
  session: Scenes.SceneSession<ServicesSession>;
  scene: Scenes.SceneContextScene<ServicesContext, ServicesSession>;
  match: any;
  orgId?: string;
}
