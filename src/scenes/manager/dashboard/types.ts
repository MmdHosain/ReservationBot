import { Context, Scenes } from "telegraf";

export interface DashboardSession extends Scenes.SceneSessionData {
  lastMenu?: string;
}

export interface DashboardContext extends Context {
  session: Scenes.SceneSession<DashboardSession>;
  scene: Scenes.SceneContextScene<DashboardContext, DashboardSession>;
}
