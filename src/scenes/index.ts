// src/scenes/index.ts
import { Scenes } from "telegraf";
import type { MyContext } from "../types/index.ts";
import { managerFeatureScenes } from "../features/manager/index.ts";
import { customerFeatureScenes } from "../features/customer/index.ts";

export const stage = new Scenes.Stage<MyContext>([
  ...managerFeatureScenes,
  ...customerFeatureScenes,
]);
