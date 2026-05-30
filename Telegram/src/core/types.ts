import { Context, Scenes } from "telegraf";

export interface MyContext extends Context, Scenes.SceneContext {
  match: any;
}
