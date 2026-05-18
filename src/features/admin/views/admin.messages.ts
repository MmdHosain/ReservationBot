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
  exited: "👋 از پنل مدیریت خارج شدید.",
  pendingReceiptsBtn: "💳 بررسی رسیدهای پرداختی",
  noPendingReceipts: "هیچ رسید در حال بررسی وجود ندارد.",
  pendingReceiptDetails: (amount: number, days: number, salonName: string) => `💳 مبلغ: ${amount.toLocaleString('fa-IR')} تومان\n⏳ مدت: ${days} روز\n🏪 سالن: ${salonName}`,
  approveBtn: "✅ تأیید",
  rejectBtn: "❌ رد",
  backBtn: "🔙 بازگشت"
};
