// src/features/manager/index.ts
import { Scene as DashboardScene } from "./dashboard/dashboard.scene.ts";
import { Scene as OnboardingScene } from "./onboarding/onboarding.scene.ts";
import { Scene as ServicesScene } from "./services/services.scene.ts";
import { Scene as CategoriesScene } from "./categories/categories.scene.ts";
import { Scene as StaffScene } from "./staff/staff.scene.ts";
import { Scene as SettingsScene } from "./settings/settings.scene.ts";
import { Scene as InboxScene } from "./inbox/inbox.scene.ts";
import { Scene as BillingScene } from "./billing/billing.scene.ts";
import { Scene as ShareLinkScene } from "./share_link/share_link.scene.ts";
import { MESSAGES } from "../../core/messages.ts";

export const managerFeatureScenes = [
  DashboardScene,
  OnboardingScene,
  ServicesScene,
  CategoriesScene,
  StaffScene,
  SettingsScene,
  InboxScene,
  BillingScene,
  ShareLinkScene,
];
