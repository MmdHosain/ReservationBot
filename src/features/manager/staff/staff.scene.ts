// src/features/manager/staff/staff.scene.ts
import { Scenes } from "telegraf";
import * as controller from "./controllers/staff.controller.ts";
import type { StaffContext } from "./types/staff.types.ts";

export const SCENE_ID = "MANAGER_STAFF_SCENE";
export const Scene = new Scenes.BaseScene<StaffContext>(SCENE_ID);

Scene.enter(controller.handleEnter);
Scene.action("back_dash", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.scene.enter("MANAGER_DASHBOARD_SCENE");
});
Scene.action(/del_staff_(\d+)/, controller.handleDelete);
Scene.on("text", controller.handleAdd);
