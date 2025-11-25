"use client";

import { transactionOrderInterface } from "@/app/types/transactions.typ";
import useCartStore from "@/app/store/useCartStore";
import { X } from "lucide-react";

// Don't remove for testing purposes
export const mockCart: transactionOrderInterface[] = [
  {
    name: "Coca-Cola",
    barcode: "1234567890123",
    variant: "Regular",
    price: 25,
    qty: 2,
    total: 50,
  },
  {
    name: "Cheese Burger",
    barcode: "9876543210987",
    variant: "Solo",
    price: 75,
    qty: 1,
    total: 75,
  },
  {
    name: "French Fries",
    barcode: "1122334455667",
    variant: "Large",
    price: 60,
    qty: 3,
    total: 180,
  },
];

export default function Cart() {
  const { cart, clearOrder, removeOrder } = useCartStore();

  const grandTotal = cart.reduce(
    (sum: number, item: transactionOrderInterface) => sum + item.total,
    0
  );

  return (
    <div className="w-full h-full flex flex-col bg-stone-100">
      {/* Label */}
      <div className="p-4 bg-white border-b shadow text-xl font-bold">
        Cart
      </div>

      {/* Cart Items */}
      {mockCart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <p className="text-lg">Your cart is empty</p>
          <p className="text-sm mt-1">Add some items to get started</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {mockCart.map((item) => (
            <div
              className="bg-white p-3 rounded-lg shadow flex justify-between items-center relative"
              key={item.barcode + item.variant} // unique key
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">{item.variant}</p>
              </div>

              <div className="flex gap-3 items-center">
                <div className="text-right">
                  <p className="text-sm">Qty: {item.qty}</p>
                  <p className="font-semibold text-green-500">₱{item.total}</p>
                </div>
                <button
                  className="text-gray-400 hover:text-red-500"
                  onClick={() => removeOrder(item.barcode)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="p-4 bg-white border-t shadow flex justify-between items-center">
        <div className="text-lg font-bold">Total: <span className="text-green-500">  ₱{grandTotal} </span></div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
          disabled={cart.length === 0}
        >
          Pay
        </button>
      </div>
    </div>
  );
}
