import type { CartItem, CartTotals, Product } from "@/domain/types";

export function calculateCartTotals(
  cartItems: CartItem[],
  products: Product[],
): CartTotals {
  const productById = new Map(products.map((product) => [product.id, product]));

  return cartItems.reduce<CartTotals>(
    (totals, item) => {
      const product = productById.get(item.productId);

      if (!product) {
        return totals;
      }

      return {
        itemCount: totals.itemCount + item.quantity,
        subtotal: totals.subtotal + product.price * item.quantity,
      };
    },
    { itemCount: 0, subtotal: 0 },
  );
}
