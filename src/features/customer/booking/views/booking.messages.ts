export const BookingMessages = {
  selectService: "✂️ لطفا خدمت مورد نظر خود را انتخاب کنید:",
  selectDate: "📅 لطفا تاریخ نوبت را انتخاب کنید:",
  selectTime: "⏰ لطفا ساعت مورد نظر را انتخاب کنید:",
  confirmPrompt: (svc: string, date: string, time: string) => `✅ آیا از رزرو نوبت برای «${svc}» در تاریخ ${date} ساعت ${time} اطمینان دارید؟`,
  confirmPromptManager: (name: string, svc: string, date: string, time: string) => `ثبت نوبت برای مشتری «${name}»\nخدمت: ${svc}\nتاریخ: ${date}\nساعت: ${time}\nآیا تأیید می‌کنید؟`,
  success: "🎉 نوبت شما با موفقیت ثبت شد!",
  successManager: "✅ نوبت مشتری با موفقیت ثبت شد و به او اطلاع داده شد.",
  managerBookedForYouNotification: (salon: string, svc: string, date: string, time: string) => `🔔 مشتری گرامی!\nنوبت شما در سالن «${salon}» برای خدمت «${svc}» در تاریخ ${date} ساعت ${time} توسط مدیریت ثبت و تأیید شد.`,
  noServices: "متأسفانه این سالن در حال حاضر خدمتی ارائه نمی‌دهد.",
  noSlots: "❌ در این تاریخ زمان خالی وجود ندارد. لطفا تاریخ دیگری انتخاب کنید.",
  pagePrev: "⬅️ قبلی",
  pageNext: "بعدی ➡️",
  confirmBtn: "بله، ثبت کن",
  cancelBtn: "❌ انصراف",
  backToDatesBtn: "🔙 بازگشت به تاریخ‌ها"
};
