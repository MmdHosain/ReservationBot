// src/features/manager/onboarding/views/onboarding.keyboards.ts
import { Markup } from "telegraf";
import { OnboardingMessages, DAYS_IRANIAN } from "./onboarding.messages.ts";

export const buildStartKeyboard = () => Markup.inlineKeyboard([
  [Markup.button.callback(OnboardingMessages.startBtn, "start_service")],
]);

export const buildCategoryKeyboard = (categories: any[]) => {
  const buttons = categories.map(c => [Markup.button.callback(`📂 ${c.name}`, `sel_cat_${c.id}`)]);
  buttons.push([Markup.button.callback(OnboardingMessages.noCategoryBtn, "sel_cat_none")]);
  return Markup.inlineKeyboard(buttons);
};

export const buildDurationKeyboard = () => Markup.inlineKeyboard([
  [
    Markup.button.callback(OnboardingMessages.minutes30, "dur_30"),
    Markup.button.callback(OnboardingMessages.minutes60, "dur_60"),
  ],
  [
    Markup.button.callback(OnboardingMessages.minutes45, "dur_45"),
    Markup.button.callback(OnboardingMessages.minutes90, "dur_90"),
  ],
]);

export const buildDaysKeyboard = (draftDays: string[]) => {
  const dayButtons = DAYS_IRANIAN.map((d) => {
    const isSelected = draftDays.includes(d);
    const label = isSelected ? OnboardingMessages.daySelectedMark(d) : d;
    return Markup.button.callback(label, `day_${d}`);
  });
  return Markup.inlineKeyboard([
    ...dayButtons.map((btn) => [btn]),
    [Markup.button.callback(OnboardingMessages.confirmAndSaveBtn, "confirm_days")],
  ]);
};

export const buildGoToDashboardKeyboard = () => Markup.inlineKeyboard([
  [Markup.button.callback(OnboardingMessages.goToDashboardBtn, "go_to_dashboard")],
]);
