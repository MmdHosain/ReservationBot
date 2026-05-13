// src/scenes/onboarding/middleware.ts
import { Markup } from "telegraf";
import type { OnboardingContext } from "./types.ts";
import { MESSAGES } from "../../../messages.ts";
import {
  getOrCreateUser,
  markUserOnboarded,
  updateSalonName,
} from "../../../db/user.repository.ts";
import { saveService } from "../../../db/service.repository.ts";

const DAYS_IRANIAN = [
  MESSAGES.days.saturday,
  MESSAGES.days.sunday,
  MESSAGES.days.monday,
  MESSAGES.days.tuesday,
  MESSAGES.days.wednesday,
  MESSAGES.days.thursday,
  MESSAGES.days.friday,
];

export async function enterScene(ctx: OnboardingContext) {
  ctx.scene.session.draft = {
    serviceName: undefined,
    duration: undefined,
    daysOfWeek: undefined,
  };
  ctx.scene.session.step = undefined;

  const user = await getOrCreateUser(ctx.from!.id);
  if (user.onboarded_at) {
    if (ctx.callbackQuery) {
      await ctx.editMessageText(MESSAGES.addNewServicePrompt);
    } else {
      await ctx.reply(MESSAGES.addNewServicePrompt);
    }
  } else {
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback(MESSAGES.onboardingStartBtn, "start_service")],
    ]);
    if (ctx.callbackQuery) {
      await ctx.editMessageText(MESSAGES.welcome, keyboard);
    } else {
      await ctx.reply(MESSAGES.welcome, keyboard);
    }
  }
}

export async function handleStartService(ctx: OnboardingContext) {
  await ctx.answerCbQuery();
  ctx.scene.session.draft = {
    serviceName: undefined,
    duration: undefined,
    daysOfWeek: undefined,
  };

  await ctx.editMessageText(MESSAGES.askServiceName);
}

export async function handleServiceName(ctx: OnboardingContext) {
  if (!("text" in ctx.message!) || !ctx.message.text) return;

  const serviceName = ctx.message.text.trim();
  if (!serviceName) {
    await ctx.reply(MESSAGES.askServiceName);
    return;
  }

  ctx.scene.session.draft.serviceName = serviceName;

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback(MESSAGES.onboardingMinutes30, "dur_30"),
      Markup.button.callback(MESSAGES.onboardingMinutes60, "dur_60"),
    ],
    [
      Markup.button.callback(MESSAGES.onboardingMinutes45, "dur_45"),
      Markup.button.callback(MESSAGES.onboardingMinutes90, "dur_90"),
    ],
  ]);

  await ctx.reply(MESSAGES.askServiceDuration, keyboard);
}

export async function handleDuration(ctx: OnboardingContext, duration: number) {
  await ctx.answerCbQuery();
  ctx.scene.session.draft.duration = duration;

  const keyboard = Markup.inlineKeyboard(
    DAYS_IRANIAN.map((day) => [Markup.button.callback(day, `day_${day}`)])
  );

  await ctx.editMessageText(MESSAGES.askServiceDays, keyboard);
}

export async function handleDaySelection(ctx: OnboardingContext, day: string) {
  await ctx.answerCbQuery();

  const draft = ctx.scene.session.draft;
  if (!draft.daysOfWeek) {
    draft.daysOfWeek = [];
  }

  const index = draft.daysOfWeek.indexOf(day);
  if (index > -1) {
    draft.daysOfWeek.splice(index, 1);
  } else {
    draft.daysOfWeek.push(day);
  }

  const selectedText =
    draft.daysOfWeek.length > 0
      ? MESSAGES.selectedDays(draft.daysOfWeek.join("، "))
      : "";

  const dayButtons = DAYS_IRANIAN.map((d) => {
    const isSelected = draft.daysOfWeek!.includes(d);
    const label = isSelected ? MESSAGES.daySelectedMark(d) : d;
    return Markup.button.callback(label, `day_${d}`);
  });

  const keyboard = Markup.inlineKeyboard([
    ...dayButtons.map((btn) => [btn]),
    [Markup.button.callback(MESSAGES.confirmAndSaveBtn, "confirm_days")],
  ]);

  if (ctx.callbackQuery) {
    await ctx.editMessageText(MESSAGES.chooseDayPrompt(selectedText), keyboard);
  }
}

export async function handleConfirmDays(ctx: OnboardingContext) {
  const draft = ctx.scene.session.draft;

  if (!draft.daysOfWeek || draft.daysOfWeek.length === 0) {
    await ctx.answerCbQuery(MESSAGES.pleaseSelectAtLeastOneDay, {
      show_alert: true,
    });
    return;
  }

  await ctx.answerCbQuery();

  const selectedDays = draft.daysOfWeek!;

  if (!draft.serviceName || !draft.duration) {
    await ctx.reply(MESSAGES.pleaseProvideNameAndDuration);
    return;
  }

  const telegramId = ctx.from?.id;
  const user = await getOrCreateUser(telegramId!);

  await saveService(user.id, {
    name: draft.serviceName,
    duration: draft.duration,
    days: JSON.stringify(draft.daysOfWeek),
  });

  const confirmation =
    MESSAGES.serviceRegistered(draft.serviceName, draft.duration) +
    MESSAGES.selectedDaysConfirmation(selectedDays.join("، "));

  if (!user.salon_name) {
    ctx.scene.session.step = "ask_salon_name";
    await ctx.editMessageText(confirmation + "\n\n" + MESSAGES.askSalonName);
  } else {
    await ctx.editMessageText(confirmation);
    await ctx.scene.enter("dashboard");
  }
}

export async function handleSalonName(ctx: OnboardingContext) {
  if (!("text" in ctx.message!) || !ctx.message.text) return;

  const salonName = ctx.message.text.trim();
  if (!salonName) {
    await ctx.reply(MESSAGES.askSalonName);
    return;
  }

  const telegramId = ctx.from?.id;
  const user = await getOrCreateUser(telegramId!);

  await updateSalonName(user.id, salonName);
  await markUserOnboarded(user.id);

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback(MESSAGES.goToDashboardBtn, "go_to_dashboard")],
  ]);

  await ctx.reply(MESSAGES.onboardingComplete(salonName), keyboard);
}
