import { describe, expect, it } from "vitest";

import { products } from "@/data/products";
import { getCartLines } from "@/features/cart/cart-selectors";

describe("cart selectors", () => {
  it("hydrates cart items with products and line totals", () => {
    const lines = getCartLines(
      [
        { productId: "bakery-baguette", quantity: 3 },
        { productId: "missing-product", quantity: 2 },
      ],
      products,
    );

    expect(lines).toHaveLength(1);
    expect(lines[0]).toEqual(
      expect.objectContaining({
        lineTotal: 255,
        quantity: 3,
        product: expect.objectContaining({ id: "bakery-baguette" }),
      }),
    );
  });
});
