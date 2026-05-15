// src/messages.ts
export const MESSAGES = {
  welcomeBack: "خوش برگشتید",
  deletingUser: "⏳ در حال حذف کاربر...",
  userNotFound: "کاربر یافت نشد.",
  userDeleted: (telegramId: number) => `کاربر با ID تلگرام ${telegramId} و تمام داده‌های مرتبط حذف شد.`,
  
  calendarSetShamsi: "✅ تقویم شما روی شمسی تنظیم شد.",
  calendarSetMiladi: "✅ تقویم شما روی میلادی تنظیم شد.",

  customerGeneralWelcome: "👋 به ربات نوبت‌دهی خوش آمدید!\n\nبرای رزرو نوبت، لطفاً از لینک اختصاصی سالن مورد نظر خود استفاده کنید.\nشما می‌توانید نوبت‌ها و سالن‌های خود را از طریق دکمه‌های زیر مدیریت کنید:",
  viewMyBookingsBtn: "📅 نوبت‌های من",
  viewMySalonsBtn: "🏪 سالن‌های من",
  customerGuideBtn: "📚 راهنمای مشتری",
  backToCustomerDashboardBtn: "🔙 بازگشت به داشبورد مشتری",
  customerSalonsHeader: "🏪 سالن‌هایی که تا به حال بازدید کرده‌اید:",
  customerNoSalons: "شما هنوز به هیچ سالنی مراجعه نکرده‌اید.",
  deleteSalonBtn: "🗑 حذف",
  salonDeleted: "✅ سالن از لیست شما حذف شد.",

  customerWelcome: "👋 به سیستم رزرو خوش آمدید. لطفا خدمت مورد نظر خود را انتخاب کنید:",
  customerNoServices: "این سالن هنوز خدمتی ثبت نکرده است.",
  customerSelectDay: "📅 لطفا روز مورد نظر خود را انتخاب کنید:",
  customerNoAvailableDays: "متأسفانه در روزهای آینده وقت خالی وجود ندارد.",
  customerSelectTime: "⏰ لطفا ساعت مورد نظر خود را انتخاب کنید:",
  customerConfirmBooking: (serviceName: string, date: string, time: string) => `شما در حال رزرو خدمت «${serviceName}» در تاریخ ${date} ساعت ${time} هستید.\nآیا تأیید می‌کنید؟`,
  confirmBtn: "✅ تأیید",
  customerBookingSuccess: (service: string, day: string, time: string) => `✅ نوبت شما برای خدمت «${service}» در تاریخ ${day} ساعت ${time} با موفقیت ثبت شد!`,
  customerBookingError: "❌ خطایی در ثبت نوبت رخ داد. لطفا دوباره تلاش کنید.",
  notAvailable: "متأسفانه این زمان پر شده است.",
  ownerNewBookingNotification: (customerName: string, serviceName: string, date: string, time: string) => `🔔 نوبت جدید!\n\nمشتری: ${customerName}\nخدمت: ${serviceName}\nتاریخ: ${date}\nساعت: ${time}`,
  unknownUser: "کاربر ناشناس",
  
  customerNoBookings: "شما هیچ نوبت رزرو شده‌ای ندارید.",
  customerBookingsHeader: "📅 نوبت‌های رزرو شده شما در تمامی سالن‌ها:\n\n",
  customerBookingItem: (index: number, serviceName: string, date: string, time: string) => `${index}️⃣ ${serviceName} - ${date} ساعت ${time}\n`,

  customerGuide: `📚 *راهنمای مشتری*\n\n` +
    `1️⃣ *رزرو نوبت:* ابتدا از طریق لینک اختصاصی سالن وارد شوید، خدمت و پرسنل را انتخاب کرده و سپس تاریخ و ساعت خالی را رزرو کنید.\n` +
    `2️⃣ *پیگیری نوبت:* با زدن دکمه «نوبت‌های من» در داشبورد، لیست تمام رزروهای خود را مشاهده کنید.\n` +
    `3️⃣ *لغو نوبت:* در بخش «نوبت‌های من»، می‌توانید نوبت‌هایی که نمی‌توانید حضور پیدا کنید را لغو کنید تا ساعت سالن آزاد شود.\n` +
    `4️⃣ *تاریخچه سالن‌ها:* در بخش «سالن‌های من»، لیست تمام سالن‌هایی که قبلاً به آن‌ها مراجعه کرده‌اید برای دسترسی سریع‌تر موجود است.`
};
