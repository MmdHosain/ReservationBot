import dayjs from "dayjs";

export function getAvailableDays(serviceDaysStr: string, page: number, bypass: boolean = false) {
  const serviceDays = JSON.parse(serviceDaysStr || "[]");
  const startOffset = page * 7;
  const days = [];
  for (let i = startOffset; i < startOffset + 7; i++) {
    const d = dayjs().add(i, "day").toDate();
    const weekdayFa = new Intl.DateTimeFormat("fa-IR", { weekday: "long" }).format(d);
    if (bypass || serviceDays.includes(weekdayFa)) {
      days.push({
        date: dayjs(d).format("YYYY-MM-DD"),
        label: new Intl.DateTimeFormat("fa-IR", { month: "long", day: "numeric", weekday: "long" }).format(d)
      });
    }
  }
  return days;
}

function timeToMinutes(timeStr: string) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(mins: number) {
  const h = Math.floor(mins / 60).toString().padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function getAvailableSlots(
  workStart: string,
  workEnd: string,
  breakStart: string | null,
  breakEnd: string | null,
  duration: number,
  existingAppointments: { appointment_time: string | Date; duration: number }[],
  bypass: boolean = false
) {
  const startMins = timeToMinutes(workStart) || 540;
  const endMins = timeToMinutes(workEnd) || 1080;
  const bStart = breakStart ? timeToMinutes(breakStart) : null;
  const bEnd = breakEnd ? timeToMinutes(breakEnd) : null;

  const slots = [];
  for (let t = startMins; t <= endMins - duration; t += duration) {
    const slotStart = t;
    const slotEnd = t + duration;

    if (!bypass) {
      if (bStart !== null && bEnd !== null) {
        if (
          (slotStart >= bStart && slotStart < bEnd) ||
          (slotEnd > bStart && slotEnd <= bEnd) ||
          (slotStart <= bStart && slotEnd >= bEnd)
        ) {
          continue;
        }
      }

      let conflict = false;
      for (const appt of existingAppointments) {
        const timeStr = typeof appt.appointment_time === "string"
          ? appt.appointment_time
          : (appt.appointment_time as Date).toTimeString().substring(0, 5);
        const aStart = timeToMinutes(timeStr)!;
        const aEnd = aStart + appt.duration;
        if (
          (slotStart >= aStart && slotStart < aEnd) ||
          (slotEnd > aStart && slotEnd <= aEnd) ||
          (slotStart <= aStart && slotEnd >= aEnd)
        ) {
          conflict = true;
          break;
        }
      }
      if (conflict) continue;
    }
    slots.push(minutesToTime(slotStart));
  }
  return slots;
}
