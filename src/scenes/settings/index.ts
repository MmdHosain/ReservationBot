// src/scenes/settings/index.ts
import { Scenes, Markup } from "telegraf";
import { pool } from "../../db/pool.ts";

export const SETTINGS_SCENE_ID = "settings";

const settings = new Scenes.BaseScene<any>(SETTINGS_SCENE_ID);

settings.enter(async (ctx) => {
  const msg = "⚙️ تنظیمات کاری:\n\nلطفا ساعت شروع و پایان کار را به فرمت زیر بفرستید.\nمثال: 09:00-18:00\n\nبرای ثبت ساعت استراحت: break 13:00-14:00\nبرای لغو استراحت: nobreak\n\nبرای تنظیم مبلغ بیعانه (تومان): deposit 50000";
  await ctx.reply(msg, Markup.inlineKeyboard([[Markup.button.callback("🔙 بازگشت", "back_dash")]]));
});

settings.action("back_dash", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.scene.enter("dashboard");
});

settings.on("text", async (ctx) => {
  const text = ctx.message.text.trim();
  if (text.startsWith("break ")) {
    const parts = text.replace("break ", "").split("-");
    if (parts.length === 2) {
      await pool.query(`UPDATE users SET break_start_time = $1, break_end_time = $2 WHERE telegram_id = $3`, [parts[0], parts[1], ctx.from!.id]);
      await ctx.reply("✅ ساعت استراحت ثبت شد.");
    }
  } else if (text === "nobreak") {
      await pool.query(`UPDATE users SET break_start_time = NULL, break_end_time = NULL WHERE telegram_id = $3`, [ctx.from!.id]);
      await ctx.reply("✅ ساعت استراحت لغو شد.");
  } else if (text.startsWith("deposit ")) {
    const amount = parseInt(text.replace("deposit ", "").trim());
    if (!isNaN(amount)) {
      await pool.query(`UPDATE users SET deposit_amount = $1 WHERE telegram_id = $2`, [amount, ctx.from!.id]);
      await ctx.reply(`✅ مبلغ بیعانه به ${amount} تومان تغییر یافت.`);
    }
  } else if (text.includes("-")) {
    const parts = text.split("-");
    if (parts.length === 2) {
      await pool.query(`UPDATE users SET work_start_time = $1, work_end_time = $2 WHERE telegram_id = $3`, [parts[0], parts[1], ctx.from!.id]);
      await ctx.reply("✅ ساعت کاری ثبت شد.");
    }
  } else {
    await ctx.reply("❌ فرمت نامعتبر.");
  }
});

export const settingsScene = settings as unknown as Scenes.BaseScene<any>;
