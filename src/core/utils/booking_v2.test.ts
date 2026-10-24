import { describe, it, expect } from "vitest";
import { getAvailableDaysV2, getAvailableSlotsV2 } from "./booking_v2.ts";
import dayjs from "dayjs";
import { EventStatus } from "../../db/types.ts";

describe("booking_v2 util (Multi-Tenant Engine)", () => {
  const mockRules = [
    { id: "1", schedule_id: "s1", day_of_week: 1, start_time: "09:00:00", end_time: "18:00:00" }, // Monday
    { id: "2", schedule_id: "s1", day_of_week: 2, start_time: "09:00:00", end_time: "18:00:00" }, // Tuesday
  ];

  describe("getAvailableDaysV2", () => {
    it("returns available days based on schedule_rules", () => {
      // Use bypass to verify working days logic
      const result = getAvailableDaysV2(mockRules, [], 0, false);
      // Should only include Mondays (1) and Tuesdays (2) in the next 7 days
      const validDays = result.map(r => dayjs(r.date).day());
      expect(validDays.every(d => d === 1 || d === 2)).toBe(true);
    });

    it("blocks days that have a false schedule_exception", () => {
      const targetDateStr = dayjs().add(2, "day").format("YYYY-MM-DD");
      const targetDay = dayjs().add(2, "day").day();
      
      const rules = [{ id: "1", schedule_id: "s1", day_of_week: targetDay, start_time: "09:00:00", end_time: "18:00:00" }];
      const exceptions = [
        { id: "e1", organization_id: "o1", specific_date: targetDateStr, is_available: false }
      ];

      const result = getAvailableDaysV2(rules, exceptions, 0, false);
      const containsTarget = result.some(r => r.date === targetDateStr);
      expect(containsTarget).toBe(false);
    });
  });

  describe("getAvailableSlotsV2", () => {
    it("generates correct slots according to schedule_rules", () => {
      // Let's assume target date falls on Monday (day 1)
      // Since we can't easily hardcode today's weekday without mocking time, 
      // we'll find the next Monday.
      let nextMonday = dayjs();
      while (nextMonday.day() !== 1) nextMonday = nextMonday.add(1, "day");
      
      const dateStr = nextMonday.format("YYYY-MM-DD");
      const rules = [{ id: "1", schedule_id: "s1", day_of_week: 1, start_time: "10:00:00", end_time: "12:00:00" }];
      
      const slots = getAvailableSlotsV2(dateStr, rules, [], 30, [], false);
      expect(slots).toEqual(["10:00", "10:30", "11:00", "11:30"]);
    });

    it("blocks slots for confirmed existing events", () => {
      let nextMonday = dayjs();
      while (nextMonday.day() !== 1) nextMonday = nextMonday.add(1, "day");
      const dateStr = nextMonday.format("YYYY-MM-DD");
      
      const rules = [{ id: "1", schedule_id: "s1", day_of_week: 1, start_time: "10:00:00", end_time: "12:00:00" }];
      
      const existingEvents = [
        {
          id: "ev1",
          organization_id: "o1",
          status: EventStatus.CONFIRMED,
          event_date: dateStr,
          booking_mode: "scheduled" as any,
          created_at: new Date(),
          updated_at: new Date(),
          planned_start_time: new Date(`${dateStr}T10:30:00`), 
          planned_end_time: new Date(`${dateStr}T11:00:00`)
        }
      ];

      const slots = getAvailableSlotsV2(dateStr, rules, [], 30, existingEvents, false);
      // 10:30 to 11:00 is taken
      expect(slots).toEqual(["10:00", "11:00", "11:30"]);
    });

    it("ignores canceled existing events", () => {
      let nextMonday = dayjs();
      while (nextMonday.day() !== 1) nextMonday = nextMonday.add(1, "day");
      const dateStr = nextMonday.format("YYYY-MM-DD");
      
      const rules = [{ id: "1", schedule_id: "s1", day_of_week: 1, start_time: "10:00:00", end_time: "11:00:00" }];
      
      const existingEvents = [
        {
          id: "ev1",
          organization_id: "o1",
          status: EventStatus.CANCELED,
          event_date: dateStr,
          booking_mode: "scheduled" as any,
          created_at: new Date(),
          updated_at: new Date(),
          planned_start_time: new Date(`${dateStr}T10:00:00`), 
          planned_end_time: new Date(`${dateStr}T10:30:00`)
        }
      ];

      const slots = getAvailableSlotsV2(dateStr, rules, [], 30, existingEvents, false);
      // Since the event is canceled, 10:00 should still be available
      expect(slots).toEqual(["10:00", "10:30"]);
    });
  });
});
