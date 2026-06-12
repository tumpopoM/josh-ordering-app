import { describe, expect, it } from "vitest";

import { createCartStore } from "@/features/cart/cart-store";

describe("cart store", () => {
  it("adds items, updates quantities, and removes items", () => {
    const store = createCartStore();

    store.getState().addItem("meat-ribeye");
    store.getState().addItem("meat-ribeye");
    store.getState().updateQuantity("meat-ribeye", 5);
    store.getState().removeItem("meat-ribeye");

    expect(store.getState().items).toEqual([]);
  });
});
