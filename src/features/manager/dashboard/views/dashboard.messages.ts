// src/features/manager/dashboard/views/dashboard.messages.ts
export const DashboardMessages = {
  welcome: (salonName: string) => `💅 *پنل مدیریت ${salonName}*\n\nلطفا یک گزینه را انتخاب کنید:`,
  shareLinkBtn: "🔗 اشتراک‌گذاری لینک سالن",
  appointmentsBtn: "📅 نوبت‌های امروز",
  servicesBtn: "✂️ مدیریت خدمات",
  inboxBtn: "📥 پیام‌ها",
  toolsMenuBtn: "🔧 تنظیمات و ابزارها",
  toolsMenuTitle: "🔧 *تنظیمات و ابزارها*\n\nلطفا یک گزینه را انتخاب کنید:",
  categoriesBtn: "📂 مدیریت دسته‌بندی‌ها",
  billingBtn: "💳 مدیریت اشتراک",
  staffBtn: "👥 مدیریت پرسنل",
  settingsBtn: "⚙️ تنظیمات کاری",
  guideBtn: "📚 راهنمای مدیر",
  restartBtn: "⚠️ ریست سالن (حذف همه)",
  exitBtn: "❌ خروج",
  backBtn: "🔙 بازگشت",
  noAppointments: "بدون نوبت\n\n",
  appointments: (count: number, list: string) => 
    `📅 *نوبت‌های آینده (${count} نوبت):*\n\n${list}`,
  servicesTitle: "مدیریت خدمات:\nبرای ویرایش روی هر کدام کلیک کنید:",
  servicesList: (list: string) => `✂️ *خدمات سالن شما:*\n\n${list}`,
  serviceListItemBtn: (name: string, duration: number) => `✂️ ${name} (${duration} دقیقه)`,
  addServiceBtn: "➕ افزودن خدمت جدید",
  panelExited: "از پنل خارج شدید. برای ورود مجدد /manager را ارسال کنید.",
  managerGuide: `📚 *راهنمای مدیر سالن*\n\n` +
    `1️⃣ *ایجاد خدمت:* از بخش «مدیریت خدمات» می‌توانید خدمات جدید تعریف کنید، زمان هر خدمت و روزهای کاری را مشخص کنید.\n` +
    `2️⃣ *لینک اختصاصی:* از بخش اشتراک‌گذاری، لینک اختصاصی خود را دریافت کرده و در بیو یا کانال خود قرار دهید.\n` +
    `3️⃣ *مدیریت پرسنل:* اگر چندین آرایشگر دارید، نام آن‌ها را در بخش پرسنل وارد کنید.\n` +
    `4️⃣ *تنظیمات:* ساعت شروع، پایان و استراحت خود را در بخش تنظیمات وارد کنید تا نوبت‌ها تداخل نداشته باشند.\n` +
    `5️⃣ *بیعانه:* می‌توانید مبلغی را به عنوان بیعانه تنظیم کنید تا نوبت‌ها فقط پس از پرداخت قطعی شوند.`
};
