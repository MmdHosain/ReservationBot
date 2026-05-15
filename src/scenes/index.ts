import { Scenes } from "telegraf";
import type { MyContext } from "../types/index.ts";
import { onboardingScene } from "./manager/onboarding/index.ts";
import { dashboardScene } from "./manager/dashboard/index.ts";
import { serviceEditScene } from "./manager/service_edit/index.ts";
import { staffManageScene } from "./manager/staff_manage/index.ts";
import { settingsScene } from "./manager/settings/index.ts";
import { Scene as InboxScene } from "../features/manager/inbox/inbox.scene.ts";
import { customerFeatureScenes } from "../features/customer/index.ts";

export const stage = new Scenes.Stage<MyContext>([
  onboardingScene,
  dashboardScene,
  serviceEditScene,
  staffManageScene,
  settingsScene,
  InboxScene,
  ...customerFeatureScenes,
]);
