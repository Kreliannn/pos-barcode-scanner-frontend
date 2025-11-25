import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { transactionOrderInterface } from "../types/transactions.typ";

type CartStore = {
  cart: transactionOrderInterface[];
  addOrder: (item: transactionOrderInterface) => void;
  removeOrder: (barcode: string) => void;
  clearOrder: () => void;
};

type MyPersist = PersistOptions<CartStore>;

const useCartStore = create<CartStore>()(
  persist<CartStore>(
    (set, get) => ({
      cart: [],

      // Add order: merge if barcode + variant exists
      addOrder: (item) =>
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (i) => i.barcode === item.barcode && i.variant === item.variant
          );

          if (existingIndex !== -1) {
            const updatedCart = [...state.cart];
            const existing = updatedCart[existingIndex];

            const newQty = existing.qty + item.qty;
            updatedCart[existingIndex] = {
              ...existing,
              qty: newQty,
              total: newQty * existing.price, // recalc total
            };

            return { cart: updatedCart };
          }

          return { cart: [...state.cart, item] };
        }),

      // Remove order by barcode
      removeOrder: (barcode: string) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.barcode !== barcode),
        })),

      // Clear entire cart
      clearOrder: () => set({ cart: [] }),
    }),

    {
      name: "cart-storage",
    } as MyPersist
  )
);

export default useCartStore;
