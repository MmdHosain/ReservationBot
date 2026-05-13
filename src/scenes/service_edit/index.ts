// src/scenes/service_edit/index.ts
import { Scenes } from "telegraf";
import * as middleware from "./middleware.ts";

export const SERVICE_EDIT_SCENE_ID = "service_edit";

const edit = new Scenes.BaseScene<any>(SERVICE_EDIT_SCENE_ID);

edit.enter(middleware.enterScene);

edit.action("menu", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.scene.session.action = "menu";
  await middleware.showMenu(ctx);
});

edit.action("edit_name", middleware.askName);
edit.action("edit_duration", middleware.askDuration);
edit.action("edit_days", middleware.askDays);
edit.action("delete_service", middleware.deleteSvc);

edit.action(/dur_(\d+)/, middleware.handleDuration);
edit.action(/day_(.+)/, middleware.handleDay);
edit.action("confirm_days", middleware.saveDays);

edit.action("back_dash", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.scene.enter("dashboard");
});

edit.on("text", middleware.handleText);

export const serviceEditScene = edit as unknown as Scenes.BaseScene<any>;
