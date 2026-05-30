// src/features/manager/categories/views/categories.view.ts
import type { CategoriesContext } from "../types/categories.types.ts";
import { CategoriesMessages } from "./categories.messages.ts";
import { buildCategoriesListKeyboard, buildCategoryActionKeyboard, buildBackListKeyboard } from "./categories.keyboards.ts";

export const showList = async (ctx: CategoriesContext, categories: any[]) => {
  const msg = categories.length === 0 ? CategoriesMessages.noCategories : CategoriesMessages.listPrompt;
  const kb = buildCategoriesListKeyboard(categories);
  if (ctx.callbackQuery) await ctx.editMessageText(msg, kb).catch(() => {});
  else await ctx.reply(msg, kb);
};

export const showCategoryActions = async (ctx: CategoriesContext, name: string) => {
  await ctx.editMessageText(CategoriesMessages.editPrompt(name), buildCategoryActionKeyboard()).catch(() => {});
};

export const showAskAddName = async (ctx: CategoriesContext) => {
  await ctx.editMessageText(CategoriesMessages.askNameAdd, buildBackListKeyboard()).catch(() => {});
};

export const showAskEditName = async (ctx: CategoriesContext) => {
  await ctx.editMessageText(CategoriesMessages.askNameEdit, buildBackListKeyboard()).catch(() => {});
};

export const showSuccess = async (ctx: CategoriesContext, msg: string) => {
  await ctx.reply(msg);
};
