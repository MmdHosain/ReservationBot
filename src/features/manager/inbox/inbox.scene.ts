// src/features/manager/inbox/inbox.scene.ts
import { Scenes } from "telegraf";
import * as inboxController from "./controllers/inbox.controller.ts";
import type { MyContext } from "../../../core/types.ts";
import { subscriptionGuard } from "../../../core/middlewares/subscription.guard.ts";

export const SCENE_ID = "MANAGER_INBOX_SCENE";

export const Scene = new Scenes.BaseScene<MyContext>(SCENE_ID);

Scene.use(subscriptionGuard);

Scene.enter(inboxController.handleEnter);
Scene.action(/read_msg_(.+)/, inboxController.handleReadMessage);
Scene.action(/view_arc_msg_(.+)/, inboxController.handleViewArchivedMessage);
Scene.action("view_archive", inboxController.handleViewArchive);
Scene.action("back_to_inbox", inboxController.handleBackToInbox);
Scene.action("back_to_dash", inboxController.handleBackToDash);
