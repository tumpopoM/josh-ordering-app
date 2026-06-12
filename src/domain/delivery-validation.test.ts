import { describe, expect, it } from "vitest";

import { deliveryRules } from "@/data/delivery-rules";
import { products } from "@/data/products";
import { calculateCartTotals } from "@/domain/cart-calculation";
import {
  getEarliestDeliveryDate,
  validateDelivery,
} from "@/domain/delivery-validation";
import type { CartItem } from "@/domain/types";

const bangkokDate = "2026-06-19";
const earlyDate = "2026-06-13";

describe("cart calculation", () => {
  it("calculates subtotal and item count from product prices and quantities", () => {
    const cartItems: CartItem[] = [
      { productId: "meat-ribeye", quantity: 2 },
      { productId: "dairy-milk", quantity: 3 },
    ];

    const result = calculateCartTotals(cartItems, products);

    expect(result).toEqual({
      itemCount: 5,
      subtotal: 3350,
    });
  });
});

describe("delivery validation", () => {
  it("returns an earliest delivery date from a product lead time", () => {
    const product = products.find((item) => item.id === "seafood-salmon");

    expect(product).toBeDefined();
    expect(getEarliestDeliveryDate(product!, "2026-06-12")).toBe("2026-06-15");
  });

  it("blocks checkout when the selected date is before an item's earliest delivery date", () => {
    const result = validateDelivery({
      cartItems: [{ productId: "seafood-salmon", quantity: 1 }],
      products,
      deliveryRules,
      selectedDate: earlyDate,
      region: "bangkok",
      today: "2026-06-12",
    });

    expect(result.canCheckout).toBe(false);
    expect(result.messages).toContainEqual(
      expect.objectContaining({
        code: "date_unavailable",
        severity: "error",
      }),
    );
  });

  it("warns that frozen and non-frozen items require split delivery", () => {
    const result = validateDelivery({
      cartItems: [
        { productId: "seafood-frozen-shrimp", quantity: 1 },
        { productId: "bakery-baguette", quantity: 2 },
      ],
      products,
      deliveryRules,
      selectedDate: bangkokDate,
      region: "bangkok",
      today: "2026-06-12",
    });

    expect(result.canCheckout).toBe(true);
    expect(result.requiresSplitDelivery).toBe(true);
    expect(result.messages).toContainEqual(
      expect.objectContaining({
        code: "split_delivery_required",
        severity: "warning",
      }),
    );
  });

  it("blocks upcountry checkout for frozen items because they need a frozen route", () => {
    const result = validateDelivery({
      cartItems: [{ productId: "dairy-ice-cream", quantity: 1 }],
      products,
      deliveryRules,
      selectedDate: bangkokDate,
      region: "upcountry",
      today: "2026-06-12",
    });

    expect(result.canCheckout).toBe(false);
    expect(result.messages).toContainEqual(
      expect.objectContaining({
        code: "frozen_route_only",
        severity: "error",
      }),
    );
  });
});
