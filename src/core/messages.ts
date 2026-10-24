// src/core/messages.ts
import { getDictionary, BusinessCategory } from "./dictionary.ts";

export const getCoreMessages = (category: BusinessCategory | string = 'beauty') => {
  const dict = getDictionary(category);
  return {
    globalError: "⚠️ متأسفانه خطایی در سیستم رخ داد. لطفا دقایقی دیگر تلاش کنید.",
    welcomeBack: "خوش برگشتید",
    deletingUser: "⏳ در حال حذف کاربر...",
    userNotFound: "کاربر یافت نشد.",
    userDeleted: (telegramId: number) => `کاربر با ID تلگرام ${telegramId} و تمام داده‌های مرتبط حذف شد.`,

    customerGeneralWelcome: `👋 به ربات نوبت‌دهی خوش آمدید!\n\nبرای رزرو نوبت، لطفاً از لینک اختصاصی ${dict.business} مورد نظر خود استفاده کنید.\nشما می‌توانید نوبت‌ها و ${dict.business}‌های خود را از طریق دکمه‌های زیر مدیریت کنید:`,
    viewMyBookingsBtn: "📅 نوبت‌های من",
    viewMySalonsBtn: `🏪 ${dict.business}‌های من`,
    customerGuideBtn: "📚 راهنمای مشتری",
    backToCustomerDashboardBtn: "🔙 بازگشت به داشبورد مشتری",
    customerSalonsHeader: `🏪 ${dict.business}‌هایی که تا به حال بازدید کرده‌اید:`,
    customerNoSalons: `شما هنوز به هیچ ${dict.business}ی مراجعه نکرده‌اید.`,
    deleteSalonBtn: "🗑 حذف",
    salonDeleted: `✅ ${dict.business} از لیست شما حذف شد.`,

    customerWelcome: `👋 به سیستم رزرو خوش آمدید. لطفا ${dict.service} مورد نظر خود را انتخاب کنید:`,
    customerNoServices: `این ${dict.business} هنوز ${dict.service}ی ثبت نکرده است.`,
    customerSelectDay: "📅 لطفا روز مورد نظر خود را انتخاب کنید:",
    customerNoAvailableDays: "متأسفانه در روزهای آینده وقت خالی وجود ندارد.",
    customerSelectTime: "⏰ لطفا ساعت مورد نظر خود را انتخاب کنید:",
    customerConfirmBooking: (serviceName: string, date: string, time: string) => `شما در حال رزرو ${dict.service} «${serviceName}» در تاریخ ${date} ساعت ${time} هستید.\nآیا تأیید می‌کنید؟`,
    confirmBtn: "✅ تأیید",
    customerBookingSuccess: (service: string, day: string, time: string) => `✅ نوبت شما برای ${dict.service} «${service}» در تاریخ ${day} ساعت ${time} با موفقیت ثبت شد!`,
    customerBookingError: "❌ خطایی در ثبت نوبت رخ داد. لطفا دوباره تلاش کنید.",
    notAvailable: "متأسفانه این زمان پر شده است.",
    ownerNewBookingNotification: (customerName: string, serviceName: string, date: string, time: string) => `🔔 نوبت جدید!\n\n${dict.client}: ${customerName}\n${dict.service}: ${serviceName}\nتاریخ: ${date}\nساعت: ${time}`,
    unknownUser: "کاربر ناشناس",
    
    customerNoBookings: "شما هیچ نوبت رزرو شده‌ای ندارید.",
    customerBookingsHeader: `📅 نوبت‌های رزرو شده شما در تمامی ${dict.business}‌ها:\n\n`,
    customerBookingItem: (index: number, serviceName: string, date: string, time: string) => `${index}️⃣ ${serviceName} - ${date} ساعت ${time}\n`,

    customerGuide: `📚 *راهنمای ${dict.client}*\n\n` +
      `1️⃣ *رزرو نوبت:* ابتدا از طریق لینک اختصاصی ${dict.business} وارد شوید، ${dict.service} و ${dict.provider} را انتخاب کرده و سپس تاریخ و ساعت خالی را رزرو کنید.\n` +
      `2️⃣ *پیگیری نوبت:* با زدن دکمه «نوبت‌های من» در داشبورد، لیست تمام رزروهای خود را مشاهده کنید.\n` +
      `3️⃣ *لغو نوبت:* در بخش «نوبت‌های من»، می‌توانید نوبت‌هایی که نمی‌توانید حضور پیدا کنید را لغو کنید تا ساعت ${dict.business} آزاد شود.\n` +
      `4️⃣ *تاریخچه ${dict.business}‌ها:* در بخش «${dict.business}‌های من»، لیست تمام ${dict.business}‌هایی که قبلاً به آن‌ها مراجعه کرده‌اید برای دسترسی سریع‌تر موجود است.`
  };
};

export const MESSAGES = getCoreMessages('beauty'); // Backward compatibility fallback
