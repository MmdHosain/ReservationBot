// src/scenes/service_edit/middleware.ts
import { Markup } from "telegraf";
import {
  getServiceById,
  updateService,
  deleteService,
} from "../../../db/service.repository.ts";
import { MESSAGES } from "../../../messages.ts";

export async function enterScene(ctx: any) {
  const state = ctx.scene.state;
  ctx.scene.session.serviceId = state.serviceId;
  ctx.scene.session.action = "menu";
  await showMenu(ctx);
}

export async function showMenu(ctx: any) {
  const serviceId = ctx.scene.session.serviceId;
  const service = await getServiceById(serviceId);
  if (!service) {
    await ctx.reply(MESSAGES.serviceNotFound);
    return ctx.scene.enter("dashboard");
  }

  const daysArr = JSON.parse(service.days);
  const msg = MESSAGES.editServiceTitle(
    service.name,
    service.duration,
    daysArr.join("، ")
  );

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback(MESSAGES.editNameBtn, "edit_name"),
      Markup.button.callback(MESSAGES.editDurationBtn, "edit_duration"),
    ],
    [Markup.button.callback(MESSAGES.editDaysBtn, "edit_days")],
    [Markup.button.callback(MESSAGES.deleteServiceBtn, "delete_service")],
    [Markup.button.callback(MESSAGES.dashboardBackBtn, "back_dash")],
  ]);

  if (ctx.callbackQuery) {
    await ctx.editMessageText(msg, keyboard);
  } else {
    await ctx.reply(msg, keyboard);
  }
}

export async function askName(ctx: any) {
  await ctx.answerCbQuery();
  ctx.scene.session.action = "name";
  await ctx.editMessageText(
    MESSAGES.typeNewName,
    Markup.inlineKeyboard([[Markup.button.callback(MESSAGES.menuBtn, "menu")]])
  );
}

export async function handleText(ctx: any) {
  if (ctx.scene.session.action === "name") {
    const text = ctx.message.text.trim();
    if (text) {
      await updateService(ctx.scene.session.serviceId, { name: text });
      await ctx.reply(MESSAGES.nameUpdated);
    }
    ctx.scene.session.action = "menu";
    await showMenu(ctx);
  }
}

export async function askDuration(ctx: any) {
  await ctx.answerCbQuery();
  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback(MESSAGES.onboardingMinutes30, "dur_30"),
      Markup.button.callback(MESSAGES.onboardingMinutes60, "dur_60"),
    ],
    [
      Markup.button.callback(MESSAGES.onboardingMinutes45, "dur_45"),
      Markup.button.callback(MESSAGES.onboardingMinutes90, "dur_90"),
    ],
    [Markup.button.callback(MESSAGES.menuBtn, "menu")],
  ]);
  await ctx.editMessageText(MESSAGES.askServiceDuration, keyboard);
}

export async function handleDuration(ctx: any) {
  await ctx.answerCbQuery();
  const duration = parseInt(ctx.match[1]);
  await updateService(ctx.scene.session.serviceId, { duration });
  await ctx.editMessageText(MESSAGES.durationUpdated);
  ctx.scene.session.action = "menu";
  await showMenu(ctx);
}

export async function askDays(ctx: any) {
  await ctx.answerCbQuery();
  const service = await getServiceById(ctx.scene.session.serviceId);
  ctx.scene.session.draftDays = JSON.parse(service.days);
  await renderDaysKeyboard(ctx);
}

export async function handleDay(ctx: any) {
  await ctx.answerCbQuery();
  const day = ctx.match[1];
  let draftDays = ctx.scene.session.draftDays || [];

  const index = draftDays.indexOf(day);
  if (index > -1) {
    draftDays.splice(index, 1);
  } else {
    draftDays.push(day);
  }
  ctx.scene.session.draftDays = draftDays;
  await renderDaysKeyboard(ctx);
}

async function renderDaysKeyboard(ctx: any) {
  const draftDays = ctx.scene.session.draftDays || [];
  const selectedText =
    draftDays.length > 0 ? MESSAGES.selectedDays(draftDays.join("، ")) : "";

  const DAYS_IRANIAN = [
    MESSAGES.days.saturday,
    MESSAGES.days.sunday,
    MESSAGES.days.monday,
    MESSAGES.days.tuesday,
    MESSAGES.days.wednesday,
    MESSAGES.days.thursday,
    MESSAGES.days.friday,
  ];

  const dayButtons = DAYS_IRANIAN.map((d) => {
    const isSelected = draftDays.includes(d);
    const label = isSelected ? MESSAGES.daySelectedMark(d) : d;
    return Markup.button.callback(label, `day_${d}`);
  });

  const keyboard = Markup.inlineKeyboard([
    ...dayButtons.map((btn) => [btn]),
    [Markup.button.callback(MESSAGES.confirmAndSaveBtn, "confirm_days")],
    [Markup.button.callback(MESSAGES.menuBtn, "menu")],
  ]);

  await ctx.editMessageText(MESSAGES.chooseDayPrompt(selectedText), keyboard);
}

export async function saveDays(ctx: any) {
  await ctx.answerCbQuery();
  const draftDays = ctx.scene.session.draftDays;
  if (!draftDays || draftDays.length === 0) {
    return ctx.reply(MESSAGES.pleaseSelectAtLeastOneDay);
  }
  await updateService(ctx.scene.session.serviceId, {
    days: JSON.stringify(draftDays),
  });
  await ctx.editMessageText(MESSAGES.daysUpdated);
  ctx.scene.session.action = "menu";
  await showMenu(ctx);
}

export async function deleteSvc(ctx: any) {
  await ctx.answerCbQuery();
  await deleteService(ctx.scene.session.serviceId);
  await ctx.editMessageText(MESSAGES.serviceDeleted);
  await ctx.scene.enter("dashboard");
}
