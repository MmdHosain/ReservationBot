// src/features/admin/views/admin.messages.ts
export const AdminMessages = {
  askPassword: "🔐 لطفا رمز عبور مدیریت را وارد کنید:",
  wrongPassword: "❌ رمز عبور اشتباه است.",
  welcome: "✅ با موفقیت وارد پنل مدیریت شدید.",
  stats: (u: number, s: number, a: number, svc: number) => 
    `📊 *آمار کلی سیستم:*\n\n` +
    `👥 کل کاربران: ${u}\n` +
    `🏪 کل سالن‌ها: ${s}\n` +
    `📅 کل نوبت‌های ثبت‌شده: ${a}\n` +
    `✂️ کل خدمات ثبت‌شده: ${svc}`,
  refreshBtn: "🔄 بروزرسانی آمار",
  exitBtn: "❌ خروج از مدیریت",
  exited: "👋 از پنل مدیریت خارج شدید."
};
