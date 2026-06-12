import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

import type { CartItem } from "@/domain/types";

const memoryStorage = new Map<string, string>();

async function getAsyncStorageModule() {
  try {
    const module = await import("@react-native-async-storage/async-storage");
    return module.default;
  } catch {
    return null;
  }
}

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
  return createStore<CartStoreState>()(
    persist(
      (set) => ({
        items: [],
        selectedDeliveryDate: null,
        addItem: (productId) =>
          set((state) => {
            const existingItem = state.items.find(
              (item) => item.productId === productId,
            );

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
      }),
      {
        name: "josh-cart-storage",
        storage: {
          getItem: async (name) => {
            const asyncStorage = await getAsyncStorageModule();

            if (asyncStorage) {
              const value = await asyncStorage.getItem(name);
              return value ? JSON.parse(value) : null;
            }

            return memoryStorage.has(name)
              ? JSON.parse(memoryStorage.get(name)!)
              : null;
          },
          setItem: async (name, value) => {
            const asyncStorage = await getAsyncStorageModule();

            if (asyncStorage) {
              await asyncStorage.setItem(name, JSON.stringify(value));
              return;
            }

            memoryStorage.set(name, JSON.stringify(value));
          },
          removeItem: async (name) => {
            const asyncStorage = await getAsyncStorageModule();

            if (asyncStorage) {
              await asyncStorage.removeItem(name);
              return;
            }

            memoryStorage.delete(name);
          },
        },
      },
    ),
  );
}

export const cartStore = createCartStore();
