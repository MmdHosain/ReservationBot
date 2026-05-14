import { Scenes } from "telegraf";
import * as fuck from "./1/5.ts";

export const SCENE_ID = "MANAGER_INBOX_SCENE";

export const Scene = new Scenes.BaseScene<any>(SCENE_ID);

Scene.enter(fuck.handleEnter);
Scene.action(/read_msg_(.+)/, fuck.handleReadMessage);
Scene.action("back_to_inbox", fuck.handleBackToInbox);
