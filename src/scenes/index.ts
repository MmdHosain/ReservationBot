// src/scenes/index.ts
import { Scenes } from "telegraf";
import type { MyContext } from "../types/index.ts";
import { onboardingScene } from "./manager/onboarding/index.ts";
import { dashboardScene } from "./manager/dashboard/index.ts";
import { customerScene } from "./customer/index.ts";
import { serviceEditScene } from "./manager/service_edit/index.ts";
import { staffManageScene } from "./manager/staff_manage/index.ts";
import { settingsScene } from "./manager/settings/index.ts";

export const stage = new Scenes.Stage<MyContext>([
  onboardingScene,
  dashboardScene,
  customerScene,
  serviceEditScene,
  staffManageScene,
  settingsScene,
]);
