// src/features/customer/dashboard/dashboard.scene.ts
import { Scenes } from "telegraf";
import * as controller from "./controllers/dashboard.controller.ts";
import type { MyContext } from "../../../core/types.ts";

export const SCENE_ID = "CUSTOMER_DASHBOARD_SCENE";
export const Scene = new Scenes.BaseScene<MyContext>(SCENE_ID);

Scene.enter(controller.handleEnter);
Scene.action("view_my_bookings", controller.goToReservations);
Scene.action("view_my_salons", controller.goToSalons);
Scene.action("view_customer_guide", controller.goToGuide);
