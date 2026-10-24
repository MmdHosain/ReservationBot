import { Scenes } from "telegraf";
import * as controller from "./controllers/salon_dashboard.controller.ts";
import type { MyContext } from "../../../core/types.ts";

export const SCENE_ID = "CUSTOMER_SALON_DASHBOARD_SCENE";
export const Scene = new Scenes.BaseScene<MyContext>(SCENE_ID);

Scene.enter(controller.handleEnter);
Scene.action("start_booking", controller.goToBooking);
Scene.action("back_to_main", controller.goBack);
