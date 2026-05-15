// src/features/customer/reservations/reservations.scene.ts
import { Scenes } from "telegraf";
import * as controller from "./controllers/reservations.controller.ts";
import type { MyContext } from "../../../../types/index.ts";

export const SCENE_ID = "CUSTOMER_RESERVATIONS_SCENE";
export const Scene = new Scenes.BaseScene<MyContext>(SCENE_ID);

Scene.enter(controller.handleEnter);
Scene.action(/cancel_appt_(\d+)/, controller.handleCancel);
Scene.action("back_to_customer_dashboard", controller.handleBack);
