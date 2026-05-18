// src/features/manager/categories/views/categories.keyboards.ts
import { Markup } from "telegraf";
import { CategoriesMessages } from "./categories.messages.ts";

export const buildCategoriesListKeyboard = (categories: any[]) => {
  const buttons = categories.map(c => [Markup.button.callback(`📂 ${c.name}`, `edit_cat_${c.id}`)]);
  buttons.push([Markup.button.callback(CategoriesMessages.addBtn, "add_cat")]);
  buttons.push([Markup.button.callback(CategoriesMessages.backDashBtn, "back_dash")]);
  return Markup.inlineKeyboard(buttons);
};

export const buildCategoryActionKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback(CategoriesMessages.editNameBtn, "rename_cat")],
    [Markup.button.callback(CategoriesMessages.deleteBtn, "delete_cat")],
    [Markup.button.callback(CategoriesMessages.backListBtn, "back_list")],
  ]);
};

export const buildBackListKeyboard = () => Markup.inlineKeyboard([
  [Markup.button.callback(CategoriesMessages.backListBtn, "back_list")]
]);
