// src/features/manager/dashboard/types/dashboard.types.ts
import { Context, Scenes } from "telegraf";
export interface DashboardSession extends Scenes.SceneSessionData {
  lastMenu?: string;
}
export interface DashboardContext extends Context {
  session: Scenes.SceneSession<DashboardSession>;
  scene: Scenes.SceneContextScene<DashboardContext, DashboardSession>;
  match: any;
}
