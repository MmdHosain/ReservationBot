// src/scenes/staff_manage/index.ts
import { Scenes, Markup } from "telegraf";
import {
  getStaffByUserId,
  addStaff,
  deleteStaff,
} from "../../../db/staff.repository.ts";
import { getUserByTelegramId } from "../../../db/user.repository.ts";

export const STAFF_MANAGE_SCENE_ID = "staff_manage";

const staffManage = new Scenes.BaseScene<any>(STAFF_MANAGE_SCENE_ID);

staffManage.enter(async (ctx) => {
  const user = await getUserByTelegramId(ctx.from!.id);
  const staffList = await getStaffByUserId(user.id);

  ctx.scene.session.userId = user.id;

  const buttons = staffList.map((s: any) => [
    Markup.button.callback(`❌ حذف ${s.name}`, `del_staff_${s.id}`),
  ]);
  buttons.push([Markup.button.callback("🔙 بازگشت", "back_dash")]);

  await ctx.reply(
    "👥 لیست پرسنل:\nبرای افزودن پرسنل جدید، نام او را تایپ کرده و بفرستید.",
    Markup.inlineKeyboard(buttons)
  );
});

staffManage.action("back_dash", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.scene.enter("dashboard");
});

staffManage.action(/del_staff_(\d+)/, async (ctx) => {
  await ctx.answerCbQuery();
  await deleteStaff(parseInt(ctx.match[1]));
  await ctx.reply("✅ پرسنل حذف شد.");
  await ctx.scene.reenter();
});

staffManage.on("text", async (ctx) => {
  const name = ctx.message.text.trim();
  await addStaff(ctx.scene.session.userId, name);
  await ctx.reply("✅ پرسنل جدید اضافه شد.");
  await ctx.scene.reenter();
});

export const staffManageScene = staffManage as unknown as Scenes.BaseScene<any>;
