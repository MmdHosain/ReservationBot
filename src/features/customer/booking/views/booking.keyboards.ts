// src/features/customer/booking/views/booking.keyboards.ts
import { Markup } from "telegraf";
import { getBookingMessages } from "./booking.messages.ts";

export const buildRootServicesKeyboard = (categories: any[], uncategorizedServices: any[], categoryStr: string = 'generic') => {
  const m = getBookingMessages(categoryStr);
  const buttons = [];
  categories.forEach(c => {
    buttons.push([Markup.button.callback(`📁 ${c.name}`, `select_cat_${c.id}`)]);
  });
  uncategorizedServices.forEach(s => {
    buttons.push([Markup.button.callback(`✂️ ${s.name} (${s.duration_minutes} دقیقه)`, `select_svc_${s.id}`)]);
  });
  buttons.push([Markup.button.callback(m.cancelBtn, "cancel_booking")]);
  return Markup.inlineKeyboard(buttons);
};

export const buildCategoryServicesKeyboard = (services: any[], categoryStr: string = 'generic') => {
  const m = getBookingMessages(categoryStr);
  const buttons = services.map(s => [Markup.button.callback(`✂️ ${s.name} (${s.duration_minutes} دقیقه)`, `select_svc_${s.id}`)]);
  buttons.push([Markup.button.callback(m.backToCategoriesBtn, "back_to_cats")]);
  buttons.push([Markup.button.callback(m.cancelBtn, "cancel_booking")]);
  return Markup.inlineKeyboard(buttons);
};

export const buildDatesKeyboard = (days: any[], currentPage: number, categoryStr: string = 'generic') => {
  const m = getBookingMessages(categoryStr);
  const buttons = days.map(d => [Markup.button.callback(d.label, `select_date_${d.date}`)]);
  const navRow = [];
  if (currentPage > 0) navRow.push(Markup.button.callback(m.pagePrev, `page_${currentPage - 1}`));
  if (currentPage < 2) navRow.push(Markup.button.callback(m.pageNext, `page_${currentPage + 1}`));
  if (navRow.length > 0) buttons.push(navRow);
  buttons.push([Markup.button.callback(m.cancelBtn, "cancel_booking")]);
  return Markup.inlineKeyboard(buttons);
};

export const buildTimesKeyboard = (slots: string[], categoryStr: string = 'generic') => {
  const m = getBookingMessages(categoryStr);
  const buttons = [];
  for(let i=0; i<slots.length; i+=3) {
     const row = [];
     for(let j=0; j<3 && i+j<slots.length; j++){
         row.push(Markup.button.callback(slots[i+j], `select_time_${slots[i+j]}`));
     }
     buttons.push(row);
  }
  buttons.push([Markup.button.callback(m.backToDatesBtn, "page_0")]);
  buttons.push([Markup.button.callback(m.cancelBtn, "cancel_booking")]);
  return Markup.inlineKeyboard(buttons);
};

export const buildConfirmKeyboard = (categoryStr: string = 'generic') => {
  const m = getBookingMessages(categoryStr);
  return Markup.inlineKeyboard([
    [Markup.button.callback(m.confirmBtn, "confirm_booking")],
    [Markup.button.callback(m.cancelBtn, "cancel_booking")]
  ]);
};
