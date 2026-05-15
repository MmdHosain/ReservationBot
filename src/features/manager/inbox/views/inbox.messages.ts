// src/features/manager/inbox/views/inbox.messages.ts
export const InboxMessages = {
  welcome: "📥 پیام‌های خوانده‌نشده شما:",
  noMessages: "📭 شما در حال حاضر پیام خوانده‌نشده‌ای ندارید.",
  messageDetail: (sender: string, content: string, date: Date) =>
    `👤 فرستنده: ${sender}\n📅 تاریخ: ${date.toLocaleString('fa-IR')}\n\n💬 پیام:\n${content}`,
  error: "⚠️ خطایی در دریافت پیام‌ها رخ داد. لطفا دوباره تلاش کنید.",
  notManager: "❌ دسترسی غیرمجاز. شما هنوز به عنوان مدیر سالن ثبت‌نام نکرده‌اید.",
  backToInboxBtn: "⬅️ بازگشت به لیست پیام‌ها",
  backToDashBtn: "🔙 بازگشت به داشبورد"
};
