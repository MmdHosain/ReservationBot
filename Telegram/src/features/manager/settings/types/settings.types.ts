// src/features/manager/settings/types/settings.types.ts
import { Context, Scenes } from "telegraf";
export interface SettingsContext extends Context, Scenes.SceneContext {
  match: any;
}
