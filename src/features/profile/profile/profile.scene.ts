// src/features/profile/profile/profile.scene.ts
import { Scenes } from "telegraf";
import * as controller from "./controllers/profile.controller.ts";
import type { MyContext } from "../../../types/index.ts";

export const SCENE_ID = "PROFILE_SCENE";
export const Scene = new Scenes.BaseScene<MyContext>(SCENE_ID);

Scene.enter(controller.handleEnter);
Scene.action(/set_calendar_(shamsi|miladi)/, controller.handleSetCalendar);
Scene.action("close_profile", controller.handleClose);
