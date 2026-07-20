import { describe, it, expect } from "vitest";
import { getAvailableDays, getAvailableSlots } from "./booking.ts";

describe("booking util", () => {
  describe("getAvailableDays", () => {
    it("returns an empty array when serviceDays string is empty array and bypass is false", () => {
      const result = getAvailableDays("[]", 0, false);
      expect(result).toHaveLength(0);
    });

    it("returns 7 days if bypass is true", () => {
      const result = getAvailableDays("[]", 0, true);
      expect(result).toHaveLength(7);
      expect(result[0]).toHaveProperty("date");
      expect(result[0]).toHaveProperty("label");
    });
  });

  describe("getAvailableSlots", () => {
    it("generates slots based on start time, end time, and duration", () => {
      const slots = getAvailableSlots("09:00", "11:00", null, null, 30, [], false);
      expect(slots).toEqual(["09:00", "09:30", "10:00", "10:30"]);
    });

    it("removes slots that fall within break time", () => {
      const slots = getAvailableSlots("09:00", "12:00", "10:00", "11:00", 30, [], false);
      // 09:00, 09:30, 11:00, 11:30
      expect(slots).toEqual(["09:00", "09:30", "11:00", "11:30"]);
    });

    it("removes slots overlapping with existing appointments", () => {
      const existing = [{ appointment_time: "09:30:00", duration: 60 }];
      const slots = getAvailableSlots("09:00", "12:00", null, null, 30, existing, false);
      // 09:30 to 10:30 is blocked
      // Slots: 09:00, 09:30 (blocked), 10:00 (blocked), 10:30, 11:00, 11:30
      expect(slots).toEqual(["09:00", "10:30", "11:00", "11:30"]);
    });

    it("allows bypassing checks", () => {
      const existing = [{ appointment_time: "09:30:00", duration: 60 }];
      const slots = getAvailableSlots("09:00", "11:00", "09:30", "10:30", 30, existing, true);
      expect(slots).toEqual(["09:00", "09:30", "10:00", "10:30"]);
    });
  });
});
