// src/features/manager/billing/billing.scene.ts
import { Scenes } from "telegraf";
import * as controller from "./controllers/billing.controller.ts";
import type { MyContext } from "../../../core/types.ts";

export const SCENE_ID = "MANAGER_BILLING_SCENE";
export const Scene = new Scenes.BaseScene<MyContext>(SCENE_ID);

Scene.enter(controller.handleEnter);
Scene.action(/buy_pkg_(\d+)_(\d+)/, controller.handleSelectPackage);
Scene.action("cancel_receipt", controller.handleCancelReceipt);
Scene.on("photo", controller.handleReceiptPhoto);
Scene.on("text", controller.handleText);

Scene.action("back_dash", async (ctx) => {
  await ctx.answerCbQuery().catch(() => {});
  await ctx.scene.enter("MANAGER_DASHBOARD_SCENE");
});
Scene.action("exit_panel", async (ctx) => {
  await ctx.answerCbQuery().catch(() => {});
  await ctx.editMessageText("از پنل خارج شدید. برای ورود مجدد /manager را ارسال کنید.").catch(() => {});
  await ctx.scene.leave();
});
