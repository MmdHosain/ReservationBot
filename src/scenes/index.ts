// src/scenes/index.ts
import { Scenes } from "telegraf";
import type { MyContext } from "../types/index.ts";
import { onboardingScene } from "./onboarding/index.ts";
import { dashboardScene } from "./dashboard/index.ts";
import { customerScene } from "./customer/index.ts";
import { serviceEditScene } from "./service_edit/index.ts";
import { staffManageScene } from "./staff_manage/index.ts";
import { settingsScene } from "./settings/index.ts";

export const stage = new Scenes.Stage<MyContext>([
  onboardingScene,
  dashboardScene,
  customerScene,
  serviceEditScene,
  staffManageScene,
  settingsScene
]);
