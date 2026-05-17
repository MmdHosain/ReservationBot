// src/features/customer/salons/views/salons.messages.ts
export const SalonMessages = {
  noSalons: "شما در هیچ سالنی عضو نیستید یا نوبتی نداشته‌اید.",
  header: "🏪 لیست سالن‌های شما:\n\nلطفاً سالن مورد نظر خود را جهت رزرو، ارسال پیام یا مدیریت انتخاب کنید:",
  salonDetails: (salonName: string) => `🏪 سالن: ${salonName}\n\nچه کاری می‌خواهید انجام دهید؟`,
  deleteBtn: "🗑 حذف از لیست",
  reserveBtn: "📝 رزرو نوبت",
  sendMsgBtn: "✉️ ارسال پیام",
  backBtn: "🔙 بازگشت به داشبورد",
  backToSalonsBtn: "🔙 بازگشت به لیست سالن‌ها",
  unknownUser: "سالن ناشناس",
  deleteSuccess: "✅ سالن با موفقیت از لیست شما حذف شد.",
  typeMessage: "لطفاً پیام خود را برای این سالن تایپ کرده و ارسال کنید:",
  msgSent: "✅ پیام شما با موفقیت به سالن ارسال شد."
};
