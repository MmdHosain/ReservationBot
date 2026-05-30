// src/features/admin/types/admin.types.ts
import { Context, Scenes } from "telegraf";

export interface AdminSession extends Scenes.SceneSessionData {
  isAuthenticated?: boolean;
}

export interface AdminContext extends Context {
  session: Scenes.SceneSession<AdminSession>;
  scene: Scenes.SceneContextScene<AdminContext, AdminSession>;
  match: any;
}
