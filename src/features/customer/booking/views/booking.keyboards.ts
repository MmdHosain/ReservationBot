import { Markup } from "telegraf";
import { BookingMessages } from "./booking.messages.ts";

export const buildServicesKeyboard = (services: any[]) => {
  const buttons = services.map(s => [Markup.button.callback(`${s.name} (${s.duration} دقیقه)`, `select_svc_${s.id}`)]);
  buttons.push([Markup.button.callback(BookingMessages.cancelBtn, "cancel_booking")]);
  return Markup.inlineKeyboard(buttons);
};

export const buildDatesKeyboard = (days: any[], currentPage: number) => {
  const buttons = days.map(d => [Markup.button.callback(d.label, `select_date_${d.date}`)]);
  const navRow = [];
  if (currentPage > 0) navRow.push(Markup.button.callback(BookingMessages.pagePrev, `page_${currentPage - 1}`));
  if (currentPage < 2) navRow.push(Markup.button.callback(BookingMessages.pageNext, `page_${currentPage + 1}`));
  if (navRow.length > 0) buttons.push(navRow);
  buttons.push([Markup.button.callback(BookingMessages.cancelBtn, "cancel_booking")]);
  return Markup.inlineKeyboard(buttons);
};

export const buildTimesKeyboard = (slots: string[]) => {
  const buttons = [];
  for(let i=0; i<slots.length; i+=3) {
     const row = [];
     for(let j=0; j<3 && i+j<slots.length; j++){
         row.push(Markup.button.callback(slots[i+j], `select_time_${slots[i+j]}`));
     }
     buttons.push(row);
  }
  buttons.push([Markup.button.callback(BookingMessages.backToDatesBtn, "page_0")]);
  buttons.push([Markup.button.callback(BookingMessages.cancelBtn, "cancel_booking")]);
  return Markup.inlineKeyboard(buttons);
};

export const buildConfirmKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback(BookingMessages.confirmBtn, "confirm_booking")],
    [Markup.button.callback(BookingMessages.cancelBtn, "cancel_booking")]
  ]);
};
