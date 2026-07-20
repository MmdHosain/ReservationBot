// src/features/manager/categories/categories.scene.ts
import { Scenes } from "telegraf";
import * as controller from "./controllers/categories.controller.ts";
import type { CategoriesContext } from "./types/categories.types.ts";
import { subscriptionGuard } from "../../../core/middlewares/subscription.guard.ts";

export const SCENE_ID = "MANAGER_CATEGORIES_SCENE";
export const Scene = new Scenes.BaseScene<CategoriesContext>(SCENE_ID);

Scene.use(subscriptionGuard);

Scene.enter(controller.handleEnter);
Scene.action("add_cat", controller.handleAddCat);
Scene.action(/edit_cat_(.+)/, controller.handleEditCat);
Scene.action("rename_cat", controller.handleRenameCat);
Scene.action("delete_cat", controller.handleDeleteCat);
Scene.action("back_list", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.scene.session.action = "list";
  await controller.handleList(ctx);
});
Scene.action("back_dash", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.scene.enter("MANAGER_DASHBOARD_SCENE");
});
Scene.on("text", controller.handleText);
