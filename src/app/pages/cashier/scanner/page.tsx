"use client";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/utils/axios";
import { errorAlert, successAlert, confirmAlert } from "@/app/utils/alert";
import { productInterface } from "@/app/types/product.type";
import BarcodeScanner from "./components/camera";
import ProductList from "./components/products";

export default function Page() {
  
  const [product, setProduct] = useState<productInterface[]>([])

  const { data } = useQuery({
      queryKey: ["product"],
      queryFn: () => axiosInstance.get("/product")
  })

  useEffect(() => {
      if(data?.data) setProduct(data?.data)
  }, [data])

  
  const [isTypeScanner, setIsTypeScanner] = useState(false)


  return (
    <div className="w-full h-dvh space-y-6 p-4 grid grid-cols-1 md:grid-cols-2  ">

        <div className="w-full h-[650px] bg-red-500 ">
            <div className="flex">
                <div className={`p-3 border ${!isTypeScanner ? "bg-green-500 text-white" : "bg-white text-stone-700"}`} onClick={() => setIsTypeScanner(false)}>
                    <h1> Product List </h1>
                </div>

                <div className={`p-3 border ${isTypeScanner ? "bg-green-500 text-white" : "bg-white text-stone-700"}`}  onClick={() => setIsTypeScanner(true)}>
                    <h1> Barcode Scanner</h1>
                </div>
            </div>

            {(isTypeScanner) ? (<BarcodeScanner />) : (<ProductList />)}
        </div>

        <div className="w-full h-[650px] bg-blue-500">

        </div>

        
  
    </div>
  );
}
