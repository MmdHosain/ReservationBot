// src/features/manager/services/views/services.messages.ts
export const ServicesMessages = {
  serviceNotFound: "❌ خدمت یافت نشد.",
  editTitle: (name: string, dur: number, days: string, catName: string) => `🛠 مدیریت خدمت «${name}»\nمدت: ${dur} دقیقه\nدسته: ${catName}\nروزها: ${days}\n\nچه تغییری می‌خواهید ایجاد کنید؟`,
  editNameBtn: "✏️ ویرایش نام",
  editDurationBtn: "⏳ ویرایش زمان",
  editDaysBtn: "📅 ویرایش روزها",
  editCategoryBtn: "📂 ویرایش دسته‌بندی",
  deleteServiceBtn: "🗑 حذف خدمت",
  typeNewName: "لطفاً نام جدید خدمت را وارد کنید:",
  askCategory: "لطفاً دسته‌بندی جدید این خدمت را انتخاب کنید:",
  noCategoryBtn: "❌ بدون دسته‌بندی",
  nameUpdated: "✅ نام خدمت با موفقیت تغییر یافت.",
  durationUpdated: "✅ زمان خدمت با موفقیت تغییر یافت.",
  daysUpdated: "✅ روزهای کاری خدمت با موفقیت تغییر یافت.",
  categoryUpdated: "✅ دسته‌بندی خدمت با موفقیت تغییر یافت.",
  serviceDeleted: "✅ خدمت با موفقیت حذف شد.",
  menuBtn: "🔙 بازگشت به منو",
  backDashBtn: "🔙 بازگشت به داشبورد",
  askServiceDuration: "مدت‌زمان جدید را انتخاب کنید:",
  minutes30: "۳۰ دقیقه", minutes45: "۴۵ دقیقه", minutes60: "۶۰ دقیقه", minutes90: "۹۰ دقیقه",
  days: {
    saturday: "شنبه", sunday: "یکشنبه", monday: "دوشنبه", tuesday: "سه‌شنبه",
    wednesday: "چهارشنبه", thursday: "پنجشنبه", friday: "جمعه",
  },
  selectedDays: (days: string) => `\n✅ انتخاب شده: ${days}`,
  daySelectedMark: (day: string) => `✅ ${day}`,
  confirmAndSaveBtn: "✅ تأیید و ذخیره",
  chooseDayPrompt: (selectedText: string) => `روزهای هفته را انتخاب کنید:${selectedText}`,
  pleaseSelectAtLeastOneDay: "لطفا حداقل یک روز انتخاب کنید."
};
export const DAYS_IRANIAN = [
  ServicesMessages.days.saturday, ServicesMessages.days.sunday, ServicesMessages.days.monday,
  ServicesMessages.days.tuesday, ServicesMessages.days.wednesday, ServicesMessages.days.thursday, ServicesMessages.days.friday
];
