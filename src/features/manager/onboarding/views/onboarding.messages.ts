// src/features/manager/onboarding/views/onboarding.messages.ts
export const OnboardingMessages = {
  welcome: `عالیه! 🙌\n\nبا این ربات می‌تونی:\n\n• نوبت‌دهی رو کاملاً خودکار کنی\n• زمان‌های خالی سالن رو دقیق نشون بدی\n• تماس‌ها و پیام‌های تکراری رو کم کنی\n\nاگه آماده‌ای ربات سالن خودتو بسازی، بزن روی دکمه زیر:`,
  startBtn: "🚀 شروع",
  askServiceName: "خب، اسم یکی از خدمات سالن رو بگو.\n\nمثال: اصلاح، رنگ مو، ناخن، کاشت مژه و…",
  askServiceDuration: "مدت‌زمان تقریبی این خدمت چقدره؟\n(می‌تونی دکمه رو بزنی یا فقط عدد بنویسی)",
  askServiceDays: "روزهای هفته‌ای که این خدمت رو انجام می‌دی رو انتخاب کن.\n\nمثلاً: شنبه تا چهارشنبه، یا فقط جمعه و یکشنبه.",
  minutes30: "۳۰ دقیقه",
  minutes45: "۴۵ دقیقه",
  minutes60: "۶۰ دقیقه",
  minutes90: "۹۰ دقیقه",
  days: {
    saturday: "شنبه", sunday: "یکشنبه", monday: "دوشنبه", tuesday: "سه‌شنبه",
    wednesday: "چهارشنبه", thursday: "پنجشنبه", friday: "جمعه",
  },
  selectedDays: (days: string) => `\n✅ انتخاب شده: ${days}`,
  daySelectedMark: (day: string) => `✅ ${day}`,
  confirmAndSaveBtn: "✅ تأیید و ذخیره",
  chooseDayPrompt: (selectedText: string) => `روزهای هفته‌ای که این خدمت رو انجام می‌دی رو انتخاب کن.${selectedText}`,
  pleaseSelectAtLeastOneDay: "لطفا حداقل یک روز انتخاب کنید.",
  pleaseProvideNameAndDuration: "لطفا ابتدا نام خدمت و مدت‌زمان را مشخص کنید.",
  serviceRegistered: (name: string, dur: number) => `✅ خدمت «${name}» با مدت‌زمان ${dur} دقیقه ثبت شد!\n`,
  selectedDaysConfirmation: (days: string) => `\n📅 روزهای انتخاب شده: ${days}`,
  askSalonName: "عالی! حالا اسم سالن یا کسب‌وکارت رو بگو تا ثبتش کنم:",
  onboardingComplete: (name: string) => 
    `🎉 سالن «${name}» با موفقیت ثبت شد!\n\n` +
    `🎁 هدیه ما به شما: ۱۴ روز استفاده کاملا رایگان از تمامی امکانات ربات!\n\n` +
    `⚠️ نحوه کارکرد اشتراک:\n` +
    `لینک اختصاصی نوبت‌دهی شما تنها در صورت داشتن «اشتراک فعال» کار می‌کند. پس از اتمام این ۱۴ روز، برای جلوگیری از غیرفعال شدن لینک نوبت‌دهی مشتریان، می‌بایست اشتراک تهیه کنید.\n\n` +
    `💳 برای تمدید یا مشاهده زمان باقیمانده، در داشبورد به مسیر زیر بروید:\n` +
    `«🔧 تنظیمات و ابزارها» ⬅️ «💳 مدیریت اشتراک»\n\n` +
    `برای ورود به داشبورد روی دکمه زیر کلیک کنید:`,
  goToDashboardBtn: "📊 ورود به داشبورد",
  addNewServicePrompt: "خب، اسم خدمت جدیدی که می‌خوای اضافه کنی چیه؟\n\nمثال: براشینگ، پدیکور و...",
};
export const DAYS_IRANIAN = [
  OnboardingMessages.days.saturday,
  OnboardingMessages.days.sunday,
  OnboardingMessages.days.monday,
  OnboardingMessages.days.tuesday,
  OnboardingMessages.days.wednesday,
  OnboardingMessages.days.thursday,
  OnboardingMessages.days.friday,
];
