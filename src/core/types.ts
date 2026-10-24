import { Context, Scenes } from "telegraf";
import { BusinessCategory } from "./dictionary.ts";

export interface MyContext extends Context, Scenes.SceneContext {
  match: any;
  // V2 Migration Data Extensions
  orgId?: string; 
  v2UserId?: string;
  businessCategory?: BusinessCategory;
  platform?: 'bale' | 'telegram';
}
