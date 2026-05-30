// src/features/manager/share_link/share_link.scene.ts
import { Scenes } from "telegraf";
import * as controller from "./controllers/share_link.controller.ts";
import type { MyContext } from "../../../core/types.ts";
import { subscriptionGuard } from "../../../core/middlewares/subscription.guard.ts";

export const SCENE_ID = "MANAGER_SHARE_LINK_SCENE";
export const Scene = new Scenes.BaseScene<MyContext>(SCENE_ID);

Scene.use(subscriptionGuard);
Scene.enter(controller.handleEnter);
Scene.action("back_dash", controller.handleBack);
