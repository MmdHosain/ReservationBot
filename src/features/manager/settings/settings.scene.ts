// src/features/manager/settings/settings.scene.ts
import { Scenes } from "telegraf";
import * as controller from "./controllers/settings.controller.ts";
import type { SettingsContext } from "./types/settings.types.ts";

export const SCENE_ID = "MANAGER_SETTINGS_SCENE";
export const Scene = new Scenes.BaseScene<SettingsContext>(SCENE_ID);

Scene.enter(controller.handleEnter);
Scene.action("back_dash", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.scene.enter("MANAGER_DASHBOARD_SCENE");
});
Scene.on("text", controller.handleInput);
