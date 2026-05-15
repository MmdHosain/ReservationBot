// src/scenes/index.ts
import { Scenes } from "telegraf";
import type { MyContext } from "./types.ts";
import { managerFeatureScenes } from "../features/manager/index.ts";
import { customerFeatureScenes } from "../features/customer/index.ts";
import { profileFeatureScenes } from "../features/profile/index.ts";

export const stage = new Scenes.Stage<MyContext>([
  ...managerFeatureScenes,
  ...customerFeatureScenes,
  ...profileFeatureScenes,
]);
