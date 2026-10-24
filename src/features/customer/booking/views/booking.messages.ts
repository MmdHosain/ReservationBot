// src/features/customer/booking/views/booking.messages.ts
import { getDictionary, BusinessCategory } from "../../../../core/dictionary.ts";

export const getBookingMessages = (category: BusinessCategory | string = 'generic') => {
  const dict = getDictionary(category);
  return {
    selectCategoryOrService: `✂️ لطفاً دسته‌بندی یا ${dict.service} مورد نظر خود را انتخاب کنید:`,
    servicesInCategory: (cat: string) => `📁 ${dict.service}‌های دسته‌بندی «${cat}»:\nلطفاً ${dict.service} مورد نظر را انتخاب کنید:`,
    backToCategoriesBtn: `🔙 بازگشت به لیست ${dict.service}‌ها`,
    selectDate: "📅 لطفا تاریخ نوبت را انتخاب کنید:",
    selectTime: "⏰ لطفا ساعت مورد نظر را انتخاب کنید:",
    confirmPrompt: (svc: string, date: string, time: string) => `✅ آیا از رزرو نوبت برای «${svc}» در تاریخ ${date} ساعت ${time} اطمینان دارید?`,
    confirmPromptManager: (name: string, svc: string, date: string, time: string) => `ثبت نوبت برای ${dict.client} «${name}»\n${dict.service}: ${svc}\nتاریخ: ${date}\nساعت: ${time}\nآیا تأیید می‌کنید?`,
    success: "🎉 نوبت شما با موفقیت ثبت شد!",
    successManager: `✅ نوبت ${dict.client} با موفقیت ثبت شد و به او اطلاع داده شد.`,
    managerBookedForYouNotification: (salon: string, svc: string, date: string, time: string) => `🔔 مشتری گرامی!\nنوبت شما در ${dict.business} «${salon}» برای ${dict.service} «${svc}» در تاریخ ${date} ساعت ${time} توسط مدیریت ثبت و تأیید شد.`,
    noServices: `متأسفانه این ${dict.business} در حال حاضر ${dict.service}ی ارائه نمی‌دهد.`,
    noSlots: "❌ در این تاریخ زمان خالی وجود ندارد. لطفا تاریخ دیگری انتخاب کنید.",
    pagePrev: "⬅️ قبلی",
    pageNext: "بعدی ➡️",
    confirmBtn: "بله، ثبت کن",
    cancelBtn: "❌ انصراف",
    backToDatesBtn: "🔙 بازگشت به تاریخ‌ها"
  };
};
