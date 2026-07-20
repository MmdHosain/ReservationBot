// src/features/customer/guide/views/guide.messages.ts
import { getDictionary, BusinessCategory } from "../../../../core/dictionary.ts";

export const getGuideMessages = (category: BusinessCategory | string = 'generic') => {
  const dict = getDictionary(category);
  return {
    guideText: `راهنمای استفاده از ربات برای مشتریان:\n\n1️⃣ **رزرو نوبت:** از طریق لینک اختصاصی ${dict.business} وارد شوید و مراحل رزرو را دنبال کنید.\n2️⃣ **نوبت‌های من:** در این بخش می‌توانید نوبت‌های فعال خود را مشاهده کرده یا آن‌ها را لغو کنید.\n3️⃣ **${dict.business}‌های من:** لیست ${dict.business}‌هایی که قبلاً از آن‌ها نوبت گرفته‌اید را در اینجا ببینید و با یک کلیک دوباره به آن‌ها دسترسی پیدا کنید.\n\nبرای بازگشت به منوی اصلی از دکمه زیر استفاده کنید.`,
    backBtn: "بازگشت به منو"
  };
};
