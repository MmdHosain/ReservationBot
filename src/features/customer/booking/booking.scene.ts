import { Scenes } from "telegraf";
import * as controller from "./controllers/booking.controller.ts";
import type { BookingContext } from "./types/booking.types.ts";

export const SCENE_ID = "CUSTOMER_BOOKING_WIZARD_SCENE";
export const Scene = new Scenes.BaseScene<BookingContext>(SCENE_ID);

Scene.enter(controller.handleEnter);
Scene.action(/select_cat_(\d+)/, controller.handleCategory);
Scene.action("back_to_cats", controller.handleBackToCategories);
Scene.action(/select_svc_(\d+)/, controller.handleService);
Scene.action(/page_(\d+)/, controller.handlePage);
Scene.action(/select_date_(.+)/, controller.handleDate);
Scene.action(/select_time_(.+)/, controller.handleTime);
Scene.action("confirm_booking", controller.handleConfirm);
Scene.action("cancel_booking", controller.handleCancel);
