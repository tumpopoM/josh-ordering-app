import { useStore } from "zustand";

import { cartStore } from "@/features/cart/cart-store";

export function useCartStore<T>(selector: Parameters<typeof useStore<typeof cartStore, T>>[1]) {
  return useStore(cartStore, selector);
}
