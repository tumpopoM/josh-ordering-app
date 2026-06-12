import { describe, expect, it } from "vitest";

import { products } from "@/data/products";
import { filterProducts, getProductById } from "@/features/products/product-service";

describe("product service", () => {
  it("filters products by search text and category", () => {
    const result = filterProducts(products, {
      category: "Seafood",
      searchText: "salmon",
    });

    expect(result.map((product) => product.id)).toEqual(["seafood-salmon"]);
  });

  it("returns undefined when a product id does not exist", () => {
    expect(getProductById(products, "missing-product")).toBeUndefined();
  });
});
