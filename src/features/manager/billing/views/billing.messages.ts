// src/features/manager/billing/views/billing.messages.ts
export const BillingMessages = {
  activeSub: (date: Date) => `✅ اشتراک شما فعال است.\n📅 تاریخ انقضا: ${new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long', day: 'numeric'}).format(date)}`,
  expiredSub: "❌ اعتبار پنل شما به پایان رسیده است.\nبرای جلوگیری از قطع دسترسی مشتریان، لطفا اشتراک خود را تمدید کنید.",
  choosePackage: "\n\nلطفا یکی از بسته‌های زیر را انتخاب کنید:",
  pkg1Month: "۱ ماهه - ۹۹,۰۰۰ تومان",
  pkg3Months: "۳ ماهه - ۲۵۰,۰۰۰ تومان (تخفیف)",
  pkg6Months: "۶ ماهه - ۴۵۰,۰۰۰ تومان (تخفیف ویژه)",
  pkg1Year: "۱ ساله - ۸۰۰,۰۰۰ تومان (بهترین قیمت)",
  mockPaymentPrompt: (amount: number, days: number) => `💳 صورتحساب:\nمبلغ: ${amount.toLocaleString('fa-IR')} تومان\nمدت: ${days} روز\n\n(این یک درگاه تستی است. روی دکمه زیر کلیک کنید تا پرداخت شبیه‌سازی شود)`,
  payBtn: "✅ شبیه‌سازی پرداخت موفق",
  success: "🎉 اشتراک شما با موفقیت تمدید شد!",
  backBtn: "🔙 بازگشت"
};
