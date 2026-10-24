// src/features/customer/dashboard/views/dashboard.messages.ts
import { getDictionary, BusinessCategory } from "../../../../core/dictionary.ts";

export const getDashboardMessages = (category: BusinessCategory | string = 'generic') => {
  const dict = getDictionary(category);
  return {
    welcome: "پنل کاربری مشتری:\nلطفاً یکی از گزینه‌های زیر را انتخاب کنید:",
    myBookingsBtn: "📅 نوبت‌های من",
    mySalonsBtn: `🏪 ${dict.business}‌های من`,
    guideBtn: "📖 راهنمای مشتری"
  };
};
