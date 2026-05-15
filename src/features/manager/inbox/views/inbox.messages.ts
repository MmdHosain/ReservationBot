// src/features/manager/inbox/views/inbox.messages.ts
export const InboxMessages = {
  welcome: "📥 پیام‌های خوانده‌نشده شما:",
  noMessages: "📭 شما در حال حاضر پیام خوانده‌نشده‌ای ندارید.",
  archivedWelcome: "🗄 پیام‌های خوانده‌شده (آرشیو):",
  noArchivedMessages: "📭 هیچ پیام آرشیوشده‌ای وجود ندارد.",
  messageDetail: (sender: string, content: string, date: Date) =>
    `👤 فرستنده: ${sender}\n📅 تاریخ: ${date.toLocaleString('fa-IR')}\n\n💬 پیام:\n${content}`,
  error: "⚠️ خطایی در دریافت پیام‌ها رخ داد. لطفا دوباره تلاش کنید.",
  notManager: "❌ دسترسی غیرمجاز. شما هنوز به عنوان مدیر سالن ثبت‌نام نکرده‌اید.",
  backToInboxBtn: "⬅️ بازگشت به پیام‌های جدید",
  backToArchiveBtn: "⬅️ بازگشت به لیست آرشیو",
  backToDashBtn: "🔙 بازگشت به داشبورد",
  viewArchiveBtn: "🗄 مشاهده پیام‌های خوانده‌‌شده"
};
