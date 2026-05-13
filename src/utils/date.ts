// src/utils/date.ts
export function formatFriendlyDate(dateInput: string | Date, calendar: 'shamsi' | 'miladi' = 'shamsi') {
  let targetDate: Date;
  if (typeof dateInput === 'string') {
    targetDate = new Date(dateInput.includes('T') ? dateInput : dateInput + 'T12:00:00');
  } else {
    targetDate = new Date(dateInput);
  }

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  const targetCopy = new Date(targetDate);
  targetCopy.setHours(0, 0, 0, 0);

  let prefix = "";
  if (targetCopy.getTime() === today.getTime()) prefix = "امروز ";
  else if (targetCopy.getTime() === tomorrow.getTime()) prefix = "فردا ";

  try {
    if (calendar === 'shamsi') {
      const formatted = new Intl.DateTimeFormat('fa-IR', { calendar: 'persian', month: 'long', day: 'numeric' }).format(targetDate);
      return `${prefix}${formatted}`;
    } else {
      const formatted = new Intl.DateTimeFormat('fa-IR', { calendar: 'gregory', month: 'long', day: 'numeric' }).format(targetDate);
      return `${prefix}${formatted}`;
    }
  } catch (e) {
    return targetDate.toISOString().split('T')[0];
  }
}
