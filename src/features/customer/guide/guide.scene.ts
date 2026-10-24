// src/features/customer/guide/guide.scene.ts
import { Scenes } from "telegraf";
import * as controller from "./controllers/guide.controller.ts";
import type { MyContext } from "../../../core/types.ts";

export const SCENE_ID = "CUSTOMER_GUIDE_SCENE";
export const Scene = new Scenes.BaseScene<MyContext>(SCENE_ID);

Scene.enter(controller.handleEnter);
Scene.action("back_to_customer_dashboard", controller.handleBack);
