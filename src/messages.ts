// src/messages.ts
export const MESSAGES = {
  welcome: `عالیه! 🙌
  
  با این ربات می‌تونی:
  
  • نوبت‌دهی رو کاملاً خودکار کنی
  • زمان‌های خالی سالن رو دقیق نشون بدی
  • تماس‌ها و پیام‌های تکراری رو کم کنی
  
  اگه آماده‌ای ربات سالن خودتو بسازی، بزن روی دکمه زیر:`,

  askServiceName:
    "خب، اسم یکی از خدمات سالن رو بگو.\n\nمثال: اصلاح، رنگ مو، ناخن، کاشت مژه و…",

  askServiceDuration:
    "مدت‌زمان تقریبی این خدمت چقدره؟\n(می‌تونی دکمه رو بزنی یا فقط عدد بنویسی)",

  askServiceDays:
    "روزهای هفته‌ای که این خدمت رو انجام می‌دی رو انتخاب کن.\n\nمثلاً: شنبه تا چهارشنبه، یا فقط جمعه و یکشنبه.",

  serviceRegistered: (serviceName: string, duration: number) =>
    `✅ خدمت «${serviceName}» با مدت‌زمان ${duration} دقیقه ثبت شد!\n`,

  askSalonName: "عالی! حالا اسم سالن یا کسب‌وکارت رو بگو تا ثبتش کنم:",
  onboardingComplete: (salonName: string) => `🎉 سالن «${salonName}» با موفقیت ثبت شد!\n\nبرای شروع مدیریت سالن به داشبورد بروید:`,
  goToDashboardBtn: "📊 ورود به داشبورد",

  welcomeBack: "خوش برگشتید",
  deletingUser: "⏳ در حال حذف کاربر...",
  userNotFound: "کاربر یافت نشد.",
  userDeleted: (telegramId: number) => `کاربر با ID تلگرام ${telegramId} و تمام داده‌های مرتبط حذف شد.`,
  panelExited: "از پنل خارج شدید. برای ورود مجدد /manager را ارسال کنید.",
  
  dashboardWelcome: (salonName: string) => `💅 *پنل مدیریت ${salonName}*\n\nلطفا یک گزینه را انتخاب کنید:`,
  dashboardOwnerLink: (link: string) => `\n\nلینک رزرو اختصاصی شما:\n${link}`,
  dashboardAppointmentsBtn: "📅 نوبت‌های امروز",
  dashboardServicesBtn: "✂️ مدیریت خدمات",
  dashboardRestartBtn: "⚠️ ریست سالن (حذف همه)",
  dashboardExitBtn: "❌ خروج",
  dashboardGuideBtn: "📚 راهنمای مدیر",
  
  dashboardAppointments: (count: number, revenue: number, list: string) => 
    `📅 *نوبت‌های آینده:*\n\n${list}\n📊 *آمار:*\nدرآمد تقریبی: ${count} × ۲۵۰۰۰۰ = ${revenue} تومان`,
  
  noAppointments: "بدون نوبت\n\n",
  dashboardServicesTitle: "مدیریت خدمات:\nبرای ویرایش روی هر کدام کلیک کنید:",
  dashboardServices: (list: string) => `✂️ *خدمات سالن شما:*\n\n${list}`,
  noServices: "- بدون خدمت\n",
  serviceListItemBtn: (name: string, duration: number) => `✂️ ${name} (${duration} دقیقه)`,
  dashboardBackBtn: "🔙 بازگشت",

  onboardingStartBtn: "🚀 شروع",
  onboardingMinutes30: "۳۰ دقیقه",
  onboardingMinutes45: "۴۵ دقیقه",
  onboardingMinutes60: "۶۰ دقیقه",
  onboardingMinutes90: "۹۰ دقیقه",

  days: {
    saturday: "شنبه",
    sunday: "یکشنبه",
    monday: "دوشنبه",
    tuesday: "سه‌شنبه",
    wednesday: "چهارشنبه",
    thursday: "پنجشنبه",
    friday: "جمعه",
  },
  
  selectedDays: (days: string) => `\n✅ انتخاب شده: ${days}`,
  daySelectedMark: (day: string) => `✅ ${day}`,
  confirmAndSaveBtn: "✅ تأیید و ذخیره",
  chooseDayPrompt: (selectedText: string) => `روزهای هفته‌ای که این خدمت رو انجام می‌دی رو انتخاب کن.${selectedText}`,
  pleaseSelectAtLeastOneDay: "لطفا حداقل یک روز انتخاب کنید.",
  pleaseProvideNameAndDuration: "لطفا ابتدا نام خدمت و مدت‌زمان را مشخص کنید.",
  selectedDaysConfirmation: (days: string) => `\n📅 روزهای انتخاب شده: ${days}`,

  // Manager Edit/Add Services
  addNewServicePrompt: "خب، اسم خدمت جدیدی که می‌خوای اضافه کنی چیه؟\n\nمثال: براشینگ، پدیکور و...",
  addServiceBtn: "➕ افزودن خدمت جدید",
  serviceNotFound: "❌ خدمت یافت نشد.",
  editServiceTitle: (name: string, duration: number, days: string) => `🛠 مدیریت خدمت «${name}»\nمدت: ${duration} دقیقه\nروزها: ${days}\n\nچه تغییری می‌خواهید ایجاد کنید؟`,
  editNameBtn: "✏️ ویرایش نام",
  editDurationBtn: "⏳ ویرایش زمان",
  editDaysBtn: "📅 ویرایش روزها",
  deleteServiceBtn: "🗑 حذف خدمت",
  typeNewName: "لطفاً نام جدید خدمت را وارد کنید:",
  nameUpdated: "✅ نام خدمت با موفقیت تغییر یافت.",
  durationUpdated: "✅ زمان خدمت با موفقیت تغییر یافت.",
  daysUpdated: "✅ روزهای کاری خدمت با موفقیت تغییر یافت.",
  serviceDeleted: "✅ خدمت با موفقیت حذف شد.",
  menuBtn: "🔙 بازگشت به منو",

  // Settings
  calendarSetShamsi: "✅ تقویم شما روی شمسی تنظیم شد.",
  calendarSetMiladi: "✅ تقویم شما روی میلادی تنظیم شد.",

  // Customer Flow
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
  
  // Customer Dashboard
  customerNoBookings: "شما هیچ نوبت رزرو شده‌ای ندارید.",
  customerBookingsHeader: "📅 نوبت‌های رزرو شده شما در تمامی سالن‌ها:\n\n",
  customerBookingItem: (index: number, serviceName: string, date: string, time: string) => `${index}️⃣ ${serviceName} - ${date} ساعت ${time}\n`,

  // Guides
  managerGuide: `📚 *راهنمای مدیر سالن*\n\n` +
    `1️⃣ *ایجاد خدمت:* از بخش «مدیریت خدمات» می‌توانید خدمات جدید تعریف کنید، زمان هر خدمت و روزهای کاری را مشخص کنید.\n` +
    `2️⃣ *لینک اختصاصی:* در صفحه اصلی پنل، لینکی وجود دارد. آن را در بیو یا کانال خود قرار دهید تا مشتریان مستقیماً رزرو کنند.\n` +
    `3️⃣ *مدیریت پرسنل:* اگر چندین آرایشگر دارید، نام آن‌ها را در بخش پرسنل وارد کنید.\n` +
    `4️⃣ *تنظیمات:* ساعت شروع، پایان و استراحت خود را در بخش تنظیمات وارد کنید تا نوبت‌ها تداخل نداشته باشند.\n` +
    `5️⃣ *بیعانه:* می‌توانید مبلغی را به عنوان بیعانه تنظیم کنید تا نوبت‌ها فقط پس از پرداخت قطعی شوند.`,

  customerGuide: `📚 *راهنمای مشتری*\n\n` +
    `1️⃣ *رزرو نوبت:* ابتدا از طریق لینک اختصاصی سالن وارد شوید، خدمت و پرسنل را انتخاب کرده و سپس تاریخ و ساعت خالی را رزرو کنید.\n` +
    `2️⃣ *پیگیری نوبت:* با زدن دکمه «نوبت‌های من» در داشبورد، لیست تمام رزروهای خود را مشاهده کنید.\n` +
    `3️⃣ *لغو نوبت:* در بخش «نوبت‌های من»، می‌توانید نوبت‌هایی که نمی‌توانید حضور پیدا کنید را لغو کنید تا ساعت سالن آزاد شود.\n` +
    `4️⃣ *تاریخچه سالن‌ها:* در بخش «سالن‌های من»، لیست تمام سالن‌هایی که قبلاً به آن‌ها مراجعه کرده‌اید برای دسترسی سریع‌تر موجود است.`
};
