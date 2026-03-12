import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  dishId: string;
  name: string;
  price: number; // cents
  quantity: number;
  imageUrl?: string;
}

interface CartState {
  cookId: string | null;
  cookName: string;
  items: CartItem[];
  addItem: (
    item: Omit<CartItem, "quantity">,
    cookId: string,
    cookName: string
  ) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cookId: null,
      cookName: "",
      items: [],

      addItem: (item, cookId, cookName) => {
        const state = get();

        // Different cook: clear and start fresh
        if (state.cookId && state.cookId !== cookId) {
          set({
            cookId,
            cookName,
            items: [{ ...item, quantity: 1 }],
          });
          return;
        }

        const existing = state.items.find((i) => i.dishId === item.dishId);
        if (existing) {
          set({
            cookId,
            cookName,
            items: state.items.map((i) =>
              i.dishId === item.dishId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({
            cookId,
            cookName,
            items: [...state.items, { ...item, quantity: 1 }],
          });
        }
      },

      removeItem: (dishId) => {
        const items = get().items.filter((i) => i.dishId !== dishId);
        if (items.length === 0) {
          set({ cookId: null, cookName: "", items: [] });
        } else {
          set({ items });
        }
      },

      updateQuantity: (dishId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(dishId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.dishId === dishId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ cookId: null, cookName: "", items: [] }),

      getTotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "homecook-cart" }
  )
);
