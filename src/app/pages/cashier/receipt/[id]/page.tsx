"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { transactionInterface } from "@/app/types/transactions.typ";

export default function Page() {
  const params = useParams();
  const id = params.id; 

  const [transaction, setTransaction] = useState<transactionInterface | null>(null)

  const { data } = useQuery({
    queryKey : ["receipt", id],
    queryFn : () => axiosInstance.get(`/transaction/${id}`)
  })

  useEffect(() => {
    if(data?.data){
      setTransaction(data.data)
    }
  }, [data])

  console.log(transaction);

  return (
    <div className="w-full h-dvh p-4 flex justify-center bg-gray-100">
        
       {transaction && (
        <div className="bg-white w-full max-w-sm p-4 rounded shadow text-sm font-mono">
            <div className="text-center border-b pb-2">
              <h1 className="font-bold text-lg">Store Receipt</h1>
              <p>Receipt ID: {transaction?._id}</p>
              <p>Date: {transaction?.date}</p>
              <p>Time: { new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })          }</p>
              <p>Cashier: {transaction?.cashier}</p>
            </div>
      
            <div className="mt-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left">Item</th>
                    <th className="text-left">Variant</th>
                    <th className="text-right">Qty</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {transaction?.orders.map((order, index) => (
                    <tr key={index} className="border-b">
                      <td>{order.name}</td>
                      <td>{order.variant}</td>
                      <td className="text-right">{order.qty}</td>
                      <td className="text-right">₱{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      
            <div className="mt-4 space-y-1 border-t pt-2">
              <div className="flex justify-between">
                <span>VAT (12%)</span>
                <span>₱{transaction?.vat.toLocaleString()}</span>
              </div>
      
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₱{transaction?.total.toLocaleString()}</span>
              </div>
      
              <div className="flex justify-between">
                <span>Cash</span>
                <span>₱{(transaction?.total + transaction?.change).toLocaleString()}</span>
              </div>
      
              <div className="flex justify-between">
                <span>Change</span>
                <span>₱{transaction?.change.toLocaleString()}</span>
              </div>
            </div>
      
            <p className="text-center mt-4 text-xs">Thank you for your purchase!</p>
          </div>
       )}
      
    </div>
  );  
}
