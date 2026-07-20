// src/features/manager/onboarding/types/onboarding.types.ts
import { Context, Scenes } from "telegraf";
export interface OnboardingDraft {
  serviceName?: string;
  duration?: number;
  daysOfWeek?: string[];
  categoryId?: string | null;
  businessCategory?: string;
}
export interface OnboardingSession extends Scenes.SceneSessionData {
  draft: OnboardingDraft;
  step?: string;
}
export interface OnboardingContext extends Context {
  session: Scenes.SceneSession<OnboardingSession>;
  scene: Scenes.SceneContextScene<OnboardingContext, OnboardingSession>;
  match: any;
}
