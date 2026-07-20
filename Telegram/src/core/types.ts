import { Context, Scenes } from "telegraf";

export interface MyContext extends Context, Scenes.SceneContext {
  match: any;
  // V2 Migration Data Extensions
  orgId?: string; 
  v2UserId?: string;
}
