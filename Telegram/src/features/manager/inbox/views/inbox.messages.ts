// src/features/manager/inbox/views/inbox.messages.ts
export const InboxMessages = {
  welcome: "📥 پیام‌های خوانده‌نشده شما:",
  noMessages: "📭 شما در حال حاضر پیام خوانده‌نشده‌ای ندارید.",
  archivedWelcome: "🗄 پیام‌های خوانده‌شده (آرشیو):",
  noArchivedMessages: "📭 هیچ پیام آرشیوشده‌ای وجود ندارد.",
  conversationDetail: (name: string, history: string) => `💬 تاریخچه گفتگو با ${name}:\n\n${history}`,
  error: "⚠️ خطایی در دریافت پیام‌ها رخ داد. لطفا دوباره تلاش کنید.",
  notManager: "❌ دسترسی غیرمجاز. شما هنوز به عنوان مدیر سالن ثبت‌نام نکرده‌اید.",
  backToInboxBtn: "⬅️ بازگشت به پیام‌های جدید",
  backToArchiveBtn: "⬅️ بازگشت به لیست آرشیو",
  backToDashBtn: "🔙 بازگشت به داشبورد",
  viewArchiveBtn: "🗄 مشاهده پیام‌های خوانده‌‌شده",
  bookBtn: "📅 ثبت نوبت برای این مشتری",
  replyBtn: "↩️ پاسخ به مشتری",
  typeReplyPrompt: (name: string) => `لطفا پاسخ خود را برای «${name}» بنویسید:`,
  replySentSuccess: "✅ پیام شما با موفقیت به مشتری ارسال و در تاریخچه ذخیره شد.",
  cancelBtn: "❌ انصراف"
};
