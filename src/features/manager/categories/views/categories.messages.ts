// src/features/manager/categories/views/categories.messages.ts
export const CategoriesMessages = {
  listPrompt: "📂 مدیریت دسته‌بندی‌ها\n\nبرای ویرایش هر دسته‌بندی روی آن کلیک کنید و یا برای افزودن دسته‌بندی جدید دکمه زیر را بزنید:",
  noCategories: "شما هیچ دسته‌بندی ندارید. برای ایجاد، روی دکمه افزودن کلیک کنید.",
  addBtn: "➕ افزودن دسته‌بندی جدید",
  backDashBtn: "🔙 بازگشت به داشبورد",
  askNameAdd: "لطفا نام دسته‌بندی جدید را ارسال کنید:",
  addSuccess: "✅ دسته‌بندی جدید با موفقیت افزوده شد.",
  editPrompt: (name: string) => `📂 دسته‌بندی: ${name}\n\nچه کاری می‌خواهید انجام دهید؟`,
  editNameBtn: "✏️ ویرایش نام دسته‌بندی",
  deleteBtn: "🗑 حذف دسته‌بندی",
  backListBtn: "🔙 بازگشت به لیست دسته‌بندی‌ها",
  askNameEdit: "لطفا نام جدید دسته‌بندی را ارسال کنید:",
  editSuccess: "✅ نام دسته‌بندی ویرایش شد.",
  deleteSuccess: "✅ دسته‌بندی حذف شد (خدمات زیرمجموعه بدون دسته شدند).",
};
