// src/features/manager/services/views/services.keyboards.ts
import { Markup } from "telegraf";
import { ServicesMessages, DAYS_IRANIAN } from "./services.messages.ts";

export const buildMenuKeyboard = () => Markup.inlineKeyboard([
  [
    Markup.button.callback(ServicesMessages.editNameBtn, "edit_name"),
    Markup.button.callback(ServicesMessages.editDurationBtn, "edit_duration"),
  ],
  [
    Markup.button.callback(ServicesMessages.editCategoryBtn, "edit_category"),
    Markup.button.callback(ServicesMessages.editDaysBtn, "edit_days"),
  ],
  [Markup.button.callback(ServicesMessages.deleteServiceBtn, "delete_service")],
  [Markup.button.callback(ServicesMessages.backDashBtn, "back_dash")],
]);

export const buildBackToMenuKeyboard = () => Markup.inlineKeyboard([
  [Markup.button.callback(ServicesMessages.menuBtn, "menu")]
]);

export const buildCategoryKeyboard = (categories: any[]) => {
  const buttons = categories.map(c => [Markup.button.callback(`📂 ${c.name}`, `set_cat_${c.id}`)]);
  buttons.push([Markup.button.callback(ServicesMessages.noCategoryBtn, "set_cat_none")]);
  buttons.push([Markup.button.callback(ServicesMessages.menuBtn, "menu")]);
  return Markup.inlineKeyboard(buttons);
};

export const buildDurationKeyboard = () => Markup.inlineKeyboard([
  [
    Markup.button.callback(ServicesMessages.minutes30, "dur_30"),
    Markup.button.callback(ServicesMessages.minutes60, "dur_60"),
  ],
  [
    Markup.button.callback(ServicesMessages.minutes45, "dur_45"),
    Markup.button.callback(ServicesMessages.minutes90, "dur_90"),
  ],
  [Markup.button.callback(ServicesMessages.menuBtn, "menu")],
]);

export const buildDaysKeyboard = (draftDays: string[]) => {
  const dayButtons = DAYS_IRANIAN.map((d) => {
    const isSelected = draftDays.includes(d);
    const label = isSelected ? ServicesMessages.daySelectedMark(d) : d;
    return Markup.button.callback(label, `day_${d}`);
  });
  return Markup.inlineKeyboard([
    ...dayButtons.map((btn) => [btn]),
    [Markup.button.callback(ServicesMessages.confirmAndSaveBtn, "confirm_days")],
    [Markup.button.callback(ServicesMessages.menuBtn, "menu")],
  ]);
};
