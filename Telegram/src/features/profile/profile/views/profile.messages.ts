// src/features/profile/profile/views/profile.messages.ts
export const ProfileMessages = {
  profileMenu: "تنظیمات حساب کاربری:\nلطفا تقویم مورد نظر خود را انتخاب کنید:",
  shamsiBtn: "تقویم شمسی",
  miladiBtn: "تقویم میلادی",
  calendarSetShamsi: "✅ تقویم شما روی شمسی تنظیم شد.",
  calendarSetMiladi: "✅ تقویم شما روی میلادی تنظیم شد.",
  currentCalendar: (type: string) => `تقویم فعلی: ${type === 'shamsi' ? 'شمسی' : 'میلادی'}`,
  closeBtn: "بستن",
  closed: "تنظیمات بسته شد."
};
