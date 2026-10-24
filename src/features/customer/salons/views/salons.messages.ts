// src/features/customer/salons/views/salons.messages.ts
import { getDictionary, BusinessCategory } from "../../../../core/dictionary.ts";

export const getSalonMessages = (category: BusinessCategory | string = 'generic') => {
  const dict = getDictionary(category);
  return {
    noSalons: `شما در هیچ ${dict.business}ی عضو نیستید یا نوبتی نداشته‌اید.`,
    header: `🏪 لیست ${dict.business}‌های شما:\n\nلطفاً ${dict.business} مورد نظر خود را جهت رزرو، ارسال پیام یا مدیریت انتخاب کنید:`,
    salonDetails: (salonName: string) => `🏪 ${dict.business}: ${salonName}\n\nچه کاری می‌خواهید انجام دهید؟`,
    deleteBtn: "🗑 حذف از لیست",
    reserveBtn: "📝 رزرو نوبت",
    sendMsgBtn: "✉️ ارسال پیام",
    backBtn: "🔙 بازگشت به داشبورد",
    backToSalonsBtn: `🔙 بازگشت به لیست ${dict.business}‌ها`,
    unknownUser: `${dict.business} ناشناس`,
    deleteSuccess: `✅ ${dict.business} با موفقیت از لیست شما حذف شد.`,
    typeMessage: `لطفاً پیام خود را برای این ${dict.business} تایپ کرده و ارسال کنید:`,
    msgSent: `✅ پیام شما با موفقیت به ${dict.business} ارسال شد.`
  };
};
