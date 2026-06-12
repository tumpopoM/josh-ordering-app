import { describe, expect, it } from "vitest";

import {
  formatCurrency,
  formatProductMeta,
  formatSubtotalLabel,
  formatTemperatureType,
} from "@/domain/formatters";

describe("formatters", () => {
  it("formats currency values with a baht symbol", () => {
    expect(formatCurrency(1450)).toBe("฿1,450");
  });

  it("formats product metadata with stable separators", () => {
    expect(formatProductMeta("Seafood", "frozen", "kg")).toBe(
      "Seafood - Frozen - kg",
    );
  });

  it("formats subtotal labels with stable separators", () => {
    expect(formatSubtotalLabel(5)).toBe("SUBTOTAL - 5 ITEMS");
  });

  it("formats ambient temperature labels", () => {
    expect(formatTemperatureType("ambient")).toBe("Ambient");
  });
});
