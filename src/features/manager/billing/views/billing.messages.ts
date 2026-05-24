// src/features/manager/billing/views/billing.messages.ts
export const BillingMessages = {
  activeSub: (date: Date) => `✅ *وضعیت اشتراک: فعال*\n📅 تاریخ انقضا: ${new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long', day: 'numeric'}).format(date)}`,
  expiredSub: "❌ *وضعیت اشتراک: منقضی شده*\nبرای جلوگیری از قطع دسترسی مشتریان، لطفا اشتراک خود را تمدید کنید.",
  howItWorks: "\n\nℹ️ *راهنمای اشتراک:*\nبا تهیه اشتراک، ربات نوبت‌دهی برای مشتریان شما فعال می‌ماند. در این مدت محدودیتی در تعداد نوبت‌ها و مشتریان نخواهید داشت. در صورت عدم تمدید، لینک نوبت‌دهی مشتریان موقتاً غیرفعال می‌شود.",
  choosePackage: "\n\n🛒 *بسته‌های تمدید:*\nلطفا یکی از بسته‌های زیر را انتخاب کنید:",
  pkg1Month: "۱ ماهه - ۹۹,۰۰۰ تومان",
  pkg3Months: "۳ ماهه - ۲۵۰,۰۰۰ تومان (تخفیف)",
  pkg6Months: "۶ ماهه - ۴۵۰,۰۰۰ تومان (تخفیف ویژه)",
  pkg1Year: "۱ ساله - ۸۰۰,۰۰۰ تومان (بهترین قیمت)",
  backBtn: "🔙 بازگشت",
  exitBtn: "❌ خروج از پنل"
};
