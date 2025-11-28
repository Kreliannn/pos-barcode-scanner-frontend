"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { transactionInterface } from "@/app/types/transactions.typ";

export default function Page() {
  const [transactions, setTransactions] = useState<transactionInterface[]>([])

  const { data } = useQuery({
    queryKey : ["transactions"],
    queryFn : () => axiosInstance.get(`/transaction`)
  })

  useEffect(() => {
    if(data?.data){
      setTransactions(data.data.reverse())
    }
  }, [data])



  return (
    <div className="w-full h-dvh p-4 bg-gray-100 overflow-auto">
      <div className="max-w-3xl mx-auto space-y-4">
  
        <h1 className="text-2xl font-bold">Transaction History</h1>
  
        <div className="space-y-3">
          {transactions.map((t) => (
            <div
              key={t._id}
              className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">Receipt #{t._id.slice(-6)}</p>
                  <p className="text-sm text-gray-600">{t.date}</p>
                  <p className="text-sm text-gray-600">Cashier: {t.cashier}</p>
                </div>
  
                <div className="text-right">
                  <p className="text-lg font-bold">₱{t.total.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">VAT: ₱{t.vat.toLocaleString()}</p>
                </div>
              </div>
  
              <div className="mt-3 border-t pt-2 text-sm text-gray-600">
                <ul>
                  {t.orders.map((item, index) => (
                   <li className="grid grid-cols-3 gap-2 text-sm" key={index}>
                    <span className="truncate">{item.name} - {item.variant}</span>
                    <span className="text-center">{item.qty}x</span>
                    <span className="text-right">₱{item.total}</span>
                  </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
  
}
