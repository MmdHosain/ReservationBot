// src/features/manager/dashboard/views/dashboard.messages.ts
export const DashboardMessages = {
  welcome: (salonName: string) => `💅 *پنل مدیریت ${salonName}*\n\nلطفا یک گزینه را انتخاب کنید:`,
  ownerLink: (link: string) => `\n\nلینک رزرو اختصاصی شما:\n${link}`,
  appointmentsBtn: "📅 نوبت‌های امروز",
  servicesBtn: "✂️ مدیریت خدمات",
  staffBtn: "👥 مدیریت پرسنل",
  settingsBtn: "⚙️ تنظیمات کاری",
  inboxBtn: "📥 پیام‌ها",
  guideBtn: "📚 راهنمای مدیر",
  restartBtn: "⚠️ ریست سالن (حذف همه)",
  exitBtn: "❌ خروج",
  backBtn: "🔙 بازگشت",
  noAppointments: "بدون نوبت\n\n",
  appointments: (count: number, revenue: number, list: string) => 
    `📅 *نوبت‌های آینده:*\n\n${list}\n📊 *آمار:*\nدرآمد تقریبی: ${count} × ۲۵۰۰۰۰ = ${revenue} تومان`,
  servicesTitle: "مدیریت خدمات:\nبرای ویرایش روی هر کدام کلیک کنید:",
  servicesList: (list: string) => `✂️ *خدمات سالن شما:*\n\n${list}`,
  serviceListItemBtn: (name: string, duration: number) => `✂️ ${name} (${duration} دقیقه)`,
  addServiceBtn: "➕ افزودن خدمت جدید",
  panelExited: "از پنل خارج شدید. برای ورود مجدد /manager را ارسال کنید.",
  managerGuide: `📚 *راهنمای مدیر سالن*\n\n` +
    `1️⃣ *ایجاد خدمت:* از بخش «مدیریت خدمات» می‌توانید خدمات جدید تعریف کنید، زمان هر خدمت و روزهای کاری را مشخص کنید.\n` +
    `2️⃣ *لینک اختصاصی:* در صفحه اصلی پنل، لینکی وجود دارد. آن را در بیو یا کانال خود قرار دهید تا مشتریان مستقیماً رزرو کنند.\n` +
    `3️⃣ *مدیریت پرسنل:* اگر چندین آرایشگر دارید، نام آن‌ها را در بخش پرسنل وارد کنید.\n` +
    `4️⃣ *تنظیمات:* ساعت شروع، پایان و استراحت خود را در بخش تنظیمات وارد کنید تا نوبت‌ها تداخل نداشته باشند.\n` +
    `5️⃣ *بیعانه:* می‌توانید مبلغی را به عنوان بیعانه تنظیم کنید تا نوبت‌ها فقط پس از پرداخت قطعی شوند.`
};
