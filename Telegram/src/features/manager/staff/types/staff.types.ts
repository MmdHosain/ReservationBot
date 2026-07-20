// src/features/manager/staff/types/staff.types.ts
import { Context, Scenes } from "telegraf";
export interface StaffSession extends Scenes.SceneSessionData {
  orgId?: string;
}
export interface StaffContext extends Context {
  session: Scenes.SceneSession<StaffSession>;
  scene: Scenes.SceneContextScene<StaffContext, StaffSession>;
  match: any;
  orgId?: string;
}
