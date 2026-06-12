import type { CartItem, Product } from "@/domain/types";

export type CartLine = {
  product: Product;
  quantity: number;
  lineTotal: number;
};

export function getCartLines(
  items: CartItem[],
  products: Product[],
): CartLine[] {
  const productById = new Map(products.map((product) => [product.id, product]));

  return items.flatMap((item) => {
    const product = productById.get(item.productId);

    if (!product) {
      return [];
    }

    return [
      {
        product,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity,
      },
    ];
  });
}
