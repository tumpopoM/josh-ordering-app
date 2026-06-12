import { describe, expect, it } from "vitest";

import { products } from "@/data/products";
import {
  filterProducts,
  getProductById,
  loadProducts,
} from "@/features/products/product-service";

describe("product service", () => {
  it("filters products by search text and category", () => {
    const result = filterProducts(products, {
      category: "Seafood",
      searchText: "salmon",
    });

    expect(result.map((product) => product.id)).toEqual(["seafood-salmon"]);
  });

  it("returns the matching product when the id exists", () => {
    expect(getProductById(products, "dairy-milk")).toEqual(
      expect.objectContaining({ id: "dairy-milk", name: "Whole Milk" }),
    );
  });

  it("returns undefined when a product id does not exist", () => {
    expect(getProductById(products, "missing-product")).toBeUndefined();
  });

  it("returns a catalog error when the async load fails", async () => {
    await expect(loadProducts({ simulateFailure: true })).rejects.toThrow(
      "Catalog unavailable",
    );
  });
});
