import { Scenes } from "telegraf";
import * as inboxController from "./controllers/inbox.controller.ts";
// import type { InboxContext } from "./types/inbox.types.ts";
import type { MyContext } from "../../../core/types.ts";

export const SCENE_ID = "MANAGER_INBOX_SCENE";

export const Scene = new Scenes.BaseScene<MyContext>(SCENE_ID);

Scene.enter(inboxController.handleEnter);
Scene.action(/read_msg_(.+)/, inboxController.handleReadMessage);
Scene.action("back_to_inbox", inboxController.handleBackToInbox);
