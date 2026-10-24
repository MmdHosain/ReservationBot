// src/features/customer/salons/salons.scene.ts
import { Scenes } from "telegraf";
import * as controller from "./controllers/salons.controller.ts";
import type { MyContext } from "../../../core/types.ts";

export const SCENE_ID = "CUSTOMER_SALONS_SCENE";
export const Scene = new Scenes.BaseScene<MyContext>(SCENE_ID);

Scene.enter(controller.handleEnter);
Scene.action(/select_salon_(.+)/, controller.handleSelectSalon);
Scene.action(/delete_salon_(.+)/, controller.handleDelete);
Scene.action(/reserve_salon_(.+)/, controller.handleReserve);
Scene.action(/send_msg_(.+)/, controller.handleSendMessage);
Scene.action("back_to_salons", controller.handleEnter);
Scene.action("back_to_customer_dashboard", controller.handleBack);
Scene.on("text", controller.handleText);
