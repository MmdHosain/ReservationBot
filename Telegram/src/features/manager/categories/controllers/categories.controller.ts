// src/features/manager/categories/controllers/categories.controller.ts
import type { CategoriesContext } from "../types/categories.types.ts";
import * as service from "../services/categories.service.ts";
import * as view from "../views/categories.view.ts";
import { CategoriesMessages } from "../views/categories.messages.ts";

export const handleEnter = async (ctx: CategoriesContext) => {
  if (!ctx.orgId) return;
  ctx.scene.session.orgId = ctx.orgId;
  ctx.scene.session.action = "list";
  await handleList(ctx);
};

export const handleList = async (ctx: CategoriesContext) => {
  const categories = await service.getCategories(ctx.scene.session.orgId!);
  await view.showList(ctx, categories);
};

export const handleAddCat = async (ctx: CategoriesContext) => {
  await ctx.answerCbQuery();
  ctx.scene.session.action = "adding";
  await view.showAskAddName(ctx);
};

export const handleEditCat = async (ctx: CategoriesContext) => {
  await ctx.answerCbQuery();
  ctx.scene.session.categoryId = ctx.match[1];
  const cat = await service.getCategory(ctx.scene.session.categoryId!);
  if (cat) {
    ctx.scene.session.action = "editing";
    await view.showCategoryActions(ctx, cat.name);
  }
};

export const handleRenameCat = async (ctx: CategoriesContext) => {
  await ctx.answerCbQuery();
  ctx.scene.session.action = "renaming";
  await view.showAskEditName(ctx);
};

export const handleDeleteCat = async (ctx: CategoriesContext) => {
  await ctx.answerCbQuery();
  if (ctx.scene.session.categoryId) {
    await service.removeCategory(ctx.scene.session.categoryId);
    await view.showSuccess(ctx, CategoriesMessages.deleteSuccess);
  }
  ctx.scene.session.action = "list";
  await handleList(ctx);
};

export const handleText = async (ctx: CategoriesContext) => {
  if (!ctx.message || !("text" in ctx.message) || !ctx.message.text) return;
  const text = ctx.message.text.trim();
  
  if (ctx.scene.session.action === "adding") {
    await service.addCategory(ctx.scene.session.orgId!, text);
    await view.showSuccess(ctx, CategoriesMessages.addSuccess);
    ctx.scene.session.action = "list";
    await handleList(ctx);
  } else if (ctx.scene.session.action === "renaming" && ctx.scene.session.categoryId) {
    await service.updateCategoryName(ctx.scene.session.categoryId, text);
    await view.showSuccess(ctx, CategoriesMessages.editSuccess);
    ctx.scene.session.action = "list";
    await handleList(ctx);
  }
};
