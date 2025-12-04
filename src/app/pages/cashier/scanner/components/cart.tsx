"use client";

import { transactionInterface, transactionInterfaceInput, transactionOrderInterface } from "@/app/types/transactions.typ";
import useCartStore from "@/app/store/useCartStore";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/utils/axios";
import { successAlert, errorAlert } from "@/app/utils/alert";
import useUserStore from "@/app/store/useUserStore";

export default function Cart({setIsLoading} : {setIsLoading : React.Dispatch<React.SetStateAction<boolean>>}) {
  const { cart, clearOrder, removeOrder } = useCartStore();
  const { user  } = useUserStore()

  const router = useRouter()

  const grandTotal = cart.reduce(
    (sum: number, item: transactionOrderInterface) => sum + item.total,
    0
  );


  const mutation = useMutation({
    mutationFn: (data: transactionInterfaceInput) =>
      axiosInstance.post("/transaction", data),
    onSuccess: (response) => {

      router.push(`/pages/cashier/receipt/${response.data._id}`);
      clearOrder()
    },
    onError: (err) => {
      errorAlert("error")
    },
  })

  const paymentHandler = () => {
    Swal.fire({
      title: "Enter Payment",
      html: `
        <div style="display:flex; flex-direction:column; gap:10px; font-size:16px;">
          <div><strong>Total Bill:</strong> ₱${grandTotal}</div>
          <input 
            id="payment-input"
            type="number"
            placeholder="Enter payment"
            style="padding:8px; width:100%; border-radius:6px; border:1px solid #ccc;"
          />
        </div>
      `,
      confirmButtonText: "Submit",
      focusConfirm: false,
      preConfirm: () => {
        const payment = (document.getElementById("payment-input") as HTMLInputElement)!.value;

    
        if (!payment || parseFloat(payment) < grandTotal) {
          Swal.showValidationMessage("Payment must be at least the total bill");
          return false;
        }
    
        return { payment: parseFloat(payment) };
      }
    }).then(result => {
      if (result.isConfirmed) {
        const payment = result.value.payment
      
        Swal.fire({
          title: "Payment Accepted",
          text: `Change: ₱${payment - grandTotal}`,
          icon: "success",
        }).then(() => {
          if(!user) return
          const newTransaction : transactionInterfaceInput = {
            orders: cart,
            total: grandTotal,
            vat: grandTotal* 0.12, 
            date:  new Date().toISOString().split("T")[0],
            cashier: user?.name,
            change : payment - grandTotal
          }
          
          mutation.mutate(newTransaction)

          setIsLoading(true)
        })
      }
    });
  }

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
          onClick={paymentHandler}
        >
          Payment
        </Button>
      </div>
    </div>
  );
}
