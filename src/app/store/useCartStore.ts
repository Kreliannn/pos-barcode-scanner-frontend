import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { transactionOrderInterface } from '../types/transactions.typ';

type CartStore = {
  cart : transactionOrderInterface[];
  addOrder: (data: transactionOrderInterface) => void;
  clearOrder: () => void;
};

const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart : [],
      addOrder: (item) =>
        set((prev) => ({
          cart : [...prev.cart , item],
        })),
      clearOrder: () => set({ cart : [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;
