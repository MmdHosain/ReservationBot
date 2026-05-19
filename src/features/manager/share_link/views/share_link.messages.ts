// src/features/manager/share_link/views/share_link.messages.ts
export const ShareLinkMessages = {
  title: (link: string) => 
    `🔗 *لینک اختصاصی نوبت‌دهی شما*\n\n` +
    `شما می‌توانید این لینک را در بیو کانال، پیج خود قرار دهید یا مستقیماً برای مشتریان ارسال کنید.\n\n` +
    `💡 *برای کپی شدن لینک، روی متن زیر یک‌بار کلیک کنید:*\n\n` +
    `\`${link}\``,
  backBtn: "🔙 بازگشت به داشبورد"
};
