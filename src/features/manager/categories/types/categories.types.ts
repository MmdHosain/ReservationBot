// src/features/manager/categories/types/categories.types.ts
import { Context, Scenes } from "telegraf";
export interface CategoriesSession extends Scenes.SceneSessionData {
  action?: string;
  categoryId?: number;
  userId?: number;
}
export interface CategoriesContext extends Context {
  session: Scenes.SceneSession<CategoriesSession>;
  scene: Scenes.SceneContextScene<CategoriesContext, CategoriesSession>;
  match: any;
}
