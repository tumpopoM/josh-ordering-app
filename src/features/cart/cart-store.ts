import { createStore } from "zustand/vanilla";

import type { CartItem } from "@/domain/types";

type CartStoreState = {
  items: CartItem[];
  selectedDeliveryDate: string | null;
  addItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  setSelectedDeliveryDate: (date: string) => void;
  clearCart: () => void;
};

export function createCartStore() {
  return createStore<CartStoreState>((set) => ({
    items: [],
    selectedDeliveryDate: null,
    addItem: (productId) =>
      set((state) => {
        const existingItem = state.items.find((item) => item.productId === productId);

        if (existingItem) {
          return {
            items: state.items.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          };
        }

        return {
          items: [...state.items, { productId, quantity: 1 }],
        };
      }),
    updateQuantity: (productId, quantity) =>
      set((state) => ({
        items:
          quantity <= 0
            ? state.items.filter((item) => item.productId !== productId)
            : state.items.map((item) =>
                item.productId === productId ? { ...item, quantity } : item,
              ),
      })),
    removeItem: (productId) =>
      set((state) => ({
        items: state.items.filter((item) => item.productId !== productId),
      })),
    setSelectedDeliveryDate: (date) => set({ selectedDeliveryDate: date }),
    clearCart: () => set({ items: [], selectedDeliveryDate: null }),
  }));
}

export const cartStore = createCartStore();
