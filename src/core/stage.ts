// src/scenes/index.ts
import { Scenes } from "telegraf";
import type { MyContext } from "./types.ts";
import { managerFeatureScenes } from "../features/manager/index.ts";
import { customerFeatureScenes } from "../features/customer/index.ts";
import { profileFeatureScenes } from "../features/profile/index.ts";
import { adminFeatureScenes } from "../features/admin/index.ts";
import { handleStartCommand } from "../features/start/controllers/start.controller.ts";

export const stage = new Scenes.Stage<MyContext>([
  ...managerFeatureScenes,
  ...customerFeatureScenes,
  ...profileFeatureScenes,
  ...adminFeatureScenes,
]);

// Global interceptor for Stage: allows breaking out of ANY active scene
stage.use(async (ctx, next) => {
  const rawText = ctx.message && "text" in ctx.message ? ctx.message.text.trim() : "";
  if (!rawText) return next();

  const lower = rawText.toLowerCase().replace(/\s+/g, " ");

  // 1. Force Reset on /start, //start, // start, start, شروع
  const isStart =
    lower.startsWith("/start") ||
    lower.startsWith("//start") ||
    lower.startsWith("// start") ||
    lower === "start" ||
    lower === "شروع";

  if (isStart) {
    if (ctx.scene?.current) {
      await ctx.scene.leave().catch(() => {});
    }
    if (ctx.session) {
      delete (ctx.session as any).__scenes;
      delete (ctx.session as any).draft;
      delete (ctx.session as any).step;
    }
    return handleStartCommand(ctx);
  }

  // 2. Universal Cancel / Exit from any scene
  const isCancel =
    lower === "/cancel" ||
    lower === "//cancel" ||
    lower === "لغو" ||
    lower === "انصراف" ||
    lower === "خروج" ||
    lower === "cancel";

  if (isCancel) {
    if (ctx.scene?.current) {
      await ctx.scene.leave().catch(() => {});
      if (ctx.session) {
        delete (ctx.session as any).__scenes;
        delete (ctx.session as any).draft;
        delete (ctx.session as any).step;
      }
      await ctx.reply("❌ عملیات جاری لغو شد.\n\nبرای شروع مجدد، دستور /start را ارسال کنید.");
      return;
    }
  }

  // 3. Direct Navigation commands from inside any scene
  const isNav =
    lower === "/manager" ||
    lower === "/customer" ||
    lower === "/profile" ||
    lower === "/admin";

  if (isNav && ctx.scene?.current) {
    await ctx.scene.leave().catch(() => {});
    if (ctx.session) {
      delete (ctx.session as any).__scenes;
    }
    return next();
  }

  return next();
});
