// src/features/manager/dashboard/views/dashboard.messages.ts
import { getDictionary, BusinessCategory } from "../../../../core/dictionary.ts";

export const getDashboardMessages = (category: BusinessCategory | string = 'beauty') => {
  const dict = getDictionary(category);
  return {
    welcome: (salonName: string) => `💅 *پنل مدیریت ${salonName}*\n\nلطفا یک گزینه را انتخاب کنید:`,
    shareLinkBtn: `🔗 اشتراک‌گذاری لینک ${dict.business}`,
    appointmentsBtn: "📅 نوبت‌های امروز",
    servicesBtn: `✂️ مدیریت ${dict.service}‌ها`,
    inboxBtn: "📥 پیام‌ها",
    toolsMenuBtn: "🔧 تنظیمات و ابزارها",
    toolsMenuTitle: "🔧 *تنظیمات و ابزارها*\n\nلطفا یک گزینه را انتخاب کنید:",
    categoriesBtn: "📂 مدیریت دسته‌بندی‌ها",
    billingBtn: "💳 مدیریت اشتراک",
    staffBtn: `👥 مدیریت ${dict.provider}`,
    settingsBtn: "⚙️ تنظیمات کاری",
    guideBtn: "📚 راهنمای مدیر",
    restartBtn: `⚠️ ریست ${dict.business} (حذف همه)`,
    exitBtn: "❌ خروج",
    backBtn: "🔙 بازگشت",
    noAppointments: "بدون نوبت\n\n",
    appointments: (count: number, list: string) => 
      `📅 *نوبت‌های آینده (${count} نوبت):*\n\n${list}`,
    servicesTitle: `مدیریت ${dict.service}‌ها:\nبرای ویرایش روی هر کدام کلیک کنید:`,
    servicesList: (list: string) => `✂️ *${dict.service}‌های ${dict.business} شما:*\n\n${list}`,
    serviceListItemBtn: (name: string, duration: number) => `✂️ ${name} (${duration} دقیقه)`,
    addServiceBtn: `➕ افزودن ${dict.service} جدید`,
    panelExited: "از پنل خارج شدید. برای ورود مجدد /manager را ارسال کنید.",
    managerGuide: `📚 *راهنمای مدیر ${dict.business}*\n\n` +
      `1️⃣ *ایجاد ${dict.service}:* از بخش «مدیریت ${dict.service}‌ها» می‌توانید ${dict.service}‌های جدید تعریف کنید، زمان هر ${dict.service} و روزهای کاری را مشخص کنید.\n` +
      `2️⃣ *لینک اختصاصی:* از بخش اشتراک‌گذاری، لینک اختصاصی خود را دریافت کرده و در بیو یا کانال خود قرار دهید.\n` +
      `3️⃣ *مدیریت ${dict.provider}:* اگر چندین ${dict.provider} دارید، نام آن‌ها را در بخش پرسنل وارد کنید.\n` +
      `4️⃣ *تنظیمات:* ساعت شروع، پایان و استراحت خود را در بخش تنظیمات وارد کنید تا نوبت‌ها تداخل نداشته باشند.\n` +
      `5️⃣ *بیعانه:* می‌توانید مبلغی را به عنوان بیعانه تنظیم کنید تا نوبت‌ها فقط پس از پرداخت قطعی شوند.`
  };
};
