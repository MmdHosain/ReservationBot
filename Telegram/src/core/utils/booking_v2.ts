import dayjs from "dayjs";
import type { ScheduleRule, ScheduleException, Event } from "../../db/types.ts";

/**
 * Calculates the available days for booking in the V2 multi-tenant schema.
 * Relies on `schedule_rules` and `schedule_exceptions` rather than static JSON arrays.
 */
export function getAvailableDaysV2(
  rules: ScheduleRule[],
  exceptions: ScheduleException[],
  page: number,
  bypass: boolean = false
) {
  const startOffset = page * 7;
  const days = [];
  
  // JS Date mapping: 0 = Sunday, 1 = Monday... 6 = Saturday
  const workingDays = new Set(rules.map(r => r.day_of_week));

  for (let i = startOffset; i < startOffset + 7; i++) {
    const d = dayjs().add(i, "day");
    const dateStr = d.format("YYYY-MM-DD");
    const dayOfWeek = d.day(); 

    const exception = exceptions.find(e => {
      const exDate = e.specific_date instanceof Date ? e.specific_date.toISOString().split('T')[0] : e.specific_date;
      return exDate === dateStr;
    });

    const isAvailable = bypass || (
      (workingDays.has(dayOfWeek) && (!exception || exception.is_available)) ||
      (exception && exception.is_available)
    );

    if (isAvailable) {
      days.push({
        date: dateStr,
        label: new Intl.DateTimeFormat("fa-IR", { month: "long", day: "numeric", weekday: "long" }).format(d.toDate())
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

/**
 * Dynamically generates 30-min (or duration-based) slots by comparing `schedule_rules` 
 * for the selected day against booked `events` and blocked `schedule_exceptions`.
 */
export function getAvailableSlotsV2(
  targetDate: string,
  rules: ScheduleRule[],
  exceptions: ScheduleException[],
  durationMinutes: number,
  existingEvents: Event[],
  bypass: boolean = false
) {
  const dayOfWeek = dayjs(targetDate).day();
  
  // Check for specific date exceptions (Overrides regular working hours)
  const exception = exceptions.find(e => {
    const exDate = e.specific_date instanceof Date ? e.specific_date.toISOString().split('T')[0] : e.specific_date;
    return exDate === targetDate;
  });

  if (exception && !exception.is_available && !bypass) return [];

  // Determine working boundaries
  let workingStartMins = 540; // 09:00 Default
  let workingEndMins = 1080;  // 18:00 Default

  if (exception && exception.start_time && exception.end_time) {
    workingStartMins = timeToMinutes(exception.start_time)!;
    workingEndMins = timeToMinutes(exception.end_time)!;
  } else {
    const rule = rules.find(r => r.day_of_week === dayOfWeek);
    if (rule) {
      workingStartMins = timeToMinutes(rule.start_time)!;
      workingEndMins = timeToMinutes(rule.end_time)!;
    } else if (!bypass) {
      return []; // Not a working day
    }
  }

  const slots = [];
  for (let t = workingStartMins; t <= workingEndMins - durationMinutes; t += durationMinutes) {
    const slotStart = t;
    const slotEnd = t + durationMinutes;

    if (!bypass) {
      // Check overlaps with existing scheduled events
      let conflict = false;
      for (const ev of existingEvents) {
        // Event status needs to be confirmed or pending to block time
        if (['canceled', 'no_show'].includes(ev.status)) continue;
        
        if (ev.planned_start_time && ev.planned_end_time) {
            const evStartStr = (ev.planned_start_time as Date).toTimeString().substring(0, 5);
            const evEndStr = (ev.planned_end_time as Date).toTimeString().substring(0, 5);
            
            const eStart = timeToMinutes(evStartStr)!;
            const eEnd = timeToMinutes(evEndStr)!;

            if (
              (slotStart >= eStart && slotStart < eEnd) ||
              (slotEnd > eStart && slotEnd <= eEnd) ||
              (slotStart <= eStart && slotEnd >= eEnd)
            ) {
              conflict = true;
              break;
            }
        }
      }
      if (conflict) continue;
    }
    slots.push(minutesToTime(slotStart));
  }
  return slots;
}
