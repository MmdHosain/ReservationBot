import { describe, it, expect } from "vitest";
import { formatFriendlyDate } from "./date.ts";

describe("formatFriendlyDate", () => {
  it("should format string date correctly without throwing", () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    const dateString = date.toISOString().split("T")[0];
    const result = formatFriendlyDate(dateString, "shamsi");
    expect(result).toBeTypeOf("string");
  });

  it("should prefix with 'امروز ' if it is today", () => {
    const today = new Date();
    const result = formatFriendlyDate(today, "shamsi");
    expect(result.startsWith("امروز ")).toBe(true);
  });

  it("should prefix with 'فردا ' if it is tomorrow", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const result = formatFriendlyDate(tomorrow, "shamsi");
    expect(result.startsWith("فردا ")).toBe(true);
  });
});
