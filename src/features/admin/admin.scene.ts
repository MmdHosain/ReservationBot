// src/features/admin/admin.scene.ts
import { Scenes } from "telegraf";
import * as controller from "./controllers/admin.controller.ts";
import type { AdminContext } from "./types/admin.types.ts";

export const SCENE_ID = "ADMIN_SCENE";
export const Scene = new Scenes.BaseScene<AdminContext>(SCENE_ID);

Scene.enter(controller.handleEnter);
Scene.action("admin_refresh", controller.handleRefresh);
Scene.action("admin_exit", controller.handleExit);
Scene.on("text", controller.handlePassword);
