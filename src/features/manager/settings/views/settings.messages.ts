// src/features/manager/settings/views/settings.messages.ts
export const SettingsMessages = {
  prompt: "⚙️ تنظیمات کاری:\n\nلطفا ساعت شروع و پایان کار را به فرمت زیر بفرستید.\nمثال: 09:00-18:00\n\nبرای ثبت ساعت استراحت: break 13:00-14:00\nبرای لغو استراحت: nobreak\n\nبرای تنظیم مبلغ بیعانه (تومان): deposit 50000",
  breakSet: "✅ ساعت استراحت ثبت شد.",
  breakRemoved: "✅ ساعت استراحت لغو شد.",
  depositSet: (amt: number) => `✅ مبلغ بیعانه به ${amt} تومان تغییر یافت.`,
  workHoursSet: "✅ ساعت کاری ثبت شد.",
  invalidFormat: "❌ فرمت نامعتبر.",
  backBtn: "🔙 بازگشت"
};
