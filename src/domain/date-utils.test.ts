import { describe, expect, it } from "vitest";

import { addDays, formatShortDate, isBefore } from "@/domain/date-utils";

describe("date utils", () => {
  it("adds days in UTC to avoid timezone drift", () => {
    expect(addDays("2026-06-12", 3)).toBe("2026-06-15");
  });

  it("detects whether a delivery date is before the minimum date", () => {
    expect(isBefore("2026-06-12", "2026-06-15")).toBe(true);
    expect(isBefore("2026-06-16", "2026-06-15")).toBe(false);
  });

  it("formats short dates in a stable human-readable way", () => {
    expect(formatShortDate("2026-06-19")).toBe("Fri, Jun 19");
  });

  it("rejects invalid ISO dates", () => {
    expect(() => addDays("06-12-2026", 1)).toThrow(
      "Expected ISO date in YYYY-MM-DD format",
    );
  });
});
