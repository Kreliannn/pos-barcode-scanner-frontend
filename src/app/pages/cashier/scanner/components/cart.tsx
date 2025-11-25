"use client";

import { transactionOrderInterface } from "@/app/types/transactions.typ";
import useCartStore from "@/app/store/useCartStore";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";


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
      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <p className="text-lg">Your cart is empty</p>
          <p className="text-sm mt-1">Add some items to get started</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.map((item) => (
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
        <Button
          className=" bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow"
          disabled={cart.length === 0}
        >
          Payment
        </Button>
      </div>
    </div>
  );
}
