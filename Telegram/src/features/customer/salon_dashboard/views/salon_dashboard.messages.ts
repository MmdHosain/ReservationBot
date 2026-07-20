// src/features/customer/salon_dashboard/views/salon_dashboard.messages.ts
import { getDictionary, BusinessCategory } from "../../../../core/dictionary.ts";

export const getSalonDashboardMessages = (category: BusinessCategory | string = 'generic') => {
  const dict = getDictionary(category);
  return {
    welcome: (salonName: string) => `🏪 به صفحه اختصاصی ${dict.business} «${salonName}» خوش آمدید.\n\nجهت رزرو نوبت یا مشاهده اطلاعات، از گزینه‌های زیر استفاده کنید:`,
    bookBtn: "📝 رزرو نوبت",
    backBtn: "🔙 بازگشت به داشبورد من"
  };
};
